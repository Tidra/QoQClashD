// 面板登录会话。
//
// 密码只存在 agent 侧（同时是内核的 Clash API secret），浏览器拿到的只是一张签名
// cookie，因此这里没有任何本地密码存储：校验、签发、作废全在服务端完成，前端只缓存
// 一份 /auth/status 快照给路由守卫和登录页用。
import { ROUTE_NAME } from '@/constant'
import { openSessionGate } from '@/helper/sessionGate'
import router from '@/router'
import { ref } from 'vue'

export type AuthErrorCode = 'password-required' | 'invalid-password'

export type AuthStatus = {
  needsSetup: boolean
  authenticated: boolean
}

export type AuthResult = {
  ok: boolean
  /** 本次登录顺带把首个密码建起来了（首次进入面板时）。 */
  created?: boolean
  error?: AuthErrorCode
  /** 内核正在跑：新 secret 要重启后才会写进 active.yaml。 */
  requiresRestart?: boolean
}

const BASE = '/api/control/auth'

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${BASE}/${path}`, {
    cache: 'no-store',
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  if (!response.ok) throw new Error(`${path} failed: HTTP ${response.status}`)
  return (await response.json()) as T
}

export const authStatus = ref<AuthStatus | null>(null)

// 会话有效才放行存储层的水合请求，见 helper/sessionGate.ts。
const setAuthStatus = (status: AuthStatus) => {
  authStatus.value = status
  if (status.authenticated) openSessionGate()
  return status
}

export const getAuthStatus = async (force = false): Promise<AuthStatus> => {
  if (!force && authStatus.value) return authStatus.value
  return setAuthStatus(await request<AuthStatus>('status'))
}

export const loginToPanel = (password: string) =>
  request<AuthResult>('login', { method: 'POST', body: JSON.stringify({ password }) }).then(
    (result) => {
      if (result.ok) setAuthStatus({ needsSetup: false, authenticated: true })
      return result
    },
  )

export const changePanelPassword = (currentPassword: string, newPassword: string) =>
  request<AuthResult>('password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword }),
  }).then((result) => {
    // 改密会作废其他设备上的旧 cookie，当前这张由服务端当场重签，所以会话继续有效。
    if (result.ok) setAuthStatus({ needsSetup: false, authenticated: true })
    return result
  })

export const logoutPanel = async () => {
  await request<{ ok: boolean }>('logout', { method: 'POST' }).catch(() => undefined)
  // needsSetup 只能问服务端，留空让登录页重新取一次。
  authStatus.value = null
  await router.replace({ name: ROUTE_NAME.setup })
}
