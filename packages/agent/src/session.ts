import { createHmac, timingSafeEqual } from 'node:crypto'

// 面板登录会话：签名 cookie，密钥就是面板密码。
//
// 无状态（不落库）所以后端重启后 cookie 照常有效 —— 用户要的「7 天免重登」。
// 代价是登出后无法召回已签发的 cookie（改密可以让它失效，因为密钥换了）。
// 密码为空时 issue 返回 ''、verify 恒 false：没设密码就没有会话可发，
// 首屏必须先走 /auth/login 创建密码。
export const SESSION_COOKIE = 'qoqclashd_session'
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60

// 凭证类 KV 键：面板密码同时是内核的 Clash API secret，只有 agent 内部有权签发。
// HTTP 的写/删路由一律拒绝它们，导入别人导出的 JSON（或被劫持的页面）就改不掉密码。
// 与前端 helper/utils.ts 的 CREDENTIAL_KV_KEYS 是同一份名单，改一处要改两处。
export const CREDENTIAL_KV_KEYS: ReadonlySet<string> = new Set([
  'setup/panel-password',
  'setup/panel-auth',
  'setup/api-list',
])

const SIGNATURE_PREFIX = 'qoqclashd-session-v1'

export interface SessionManager {
  issue: () => string
  verify: (value: string | undefined | null) => boolean
}

export const createSessionManager = (getSecret: () => string): SessionManager => {
  const sign = (expiresAt: number, secret: string) =>
    createHmac('sha256', secret).update(`${SIGNATURE_PREFIX}:${expiresAt}`).digest('hex')

  return {
    issue() {
      const secret = getSecret()
      if (!secret) return ''
      const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000
      return `${expiresAt}.${sign(expiresAt, secret)}`
    },
    verify(value) {
      const secret = getSecret()
      if (!secret || !value) return false
      const separator = value.lastIndexOf('.')
      if (separator <= 0) return false
      const expiresAt = Number(value.slice(0, separator))
      if (!Number.isInteger(expiresAt) || expiresAt <= Date.now()) return false
      const expected = sign(expiresAt, secret)
      const provided = value.slice(separator + 1)
      // timingSafeEqual 长度不等会抛，先比长度。
      return (
        provided.length === expected.length &&
        timingSafeEqual(Buffer.from(provided), Buffer.from(expected))
      )
    },
  }
}

/** 从原始 Cookie 头里取会话值：/api/mihomo 代理是裸 node:http，没有 h3 的 getCookie。 */
export const readSessionCookie = (cookieHeader: string | string[] | undefined) => {
  const header = Array.isArray(cookieHeader) ? cookieHeader.join('; ') : cookieHeader
  if (!header) return undefined
  for (const pair of header.split(';')) {
    const separator = pair.indexOf('=')
    if (separator < 0) continue
    if (pair.slice(0, separator).trim() !== SESSION_COOKIE) continue
    try {
      return decodeURIComponent(pair.slice(separator + 1).trim())
    } catch {
      return pair.slice(separator + 1).trim()
    }
  }
  return undefined
}

export type AuthErrorCode = 'password-required' | 'invalid-password'

export interface AuthResult {
  ok: boolean
  // 首次运行创建密码的那一次登录为 true，前端据此决定文案与是否引导启动内核。
  created?: boolean
  error?: AuthErrorCode
  // 密码即内核 Clash API secret：内核在跑时要重启才会把新值写进 active.yaml。
  requiresRestart?: boolean
}

/** 面板密码的归属方（index.ts）：agent 持有明文，浏览器永远拿不到。 */
export interface PanelAuth {
  needsSetup: () => boolean
  login: (password: string) => Promise<AuthResult>
  changePassword: (current: string, next: string) => Promise<AuthResult>
}
