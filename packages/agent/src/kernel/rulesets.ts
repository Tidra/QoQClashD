import { Buffer } from 'node:buffer'
import { mkdir, rename, writeFile } from 'node:fs/promises'
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path'

/** 面板写 rule-providers 草稿用的 KV 键，改这个名字要同步 src/store/routing.ts */
export const RULE_PROVIDERS_KV_KEY = 'config/routing-rule-providers'

type RuleProviderCandidate = {
  name?: unknown
  type?: unknown
  url?: unknown
  path?: unknown
}

export interface FetchRuleSetDeps {
  /** KV 里那份草稿，形状由面板写入但不保证，所以一律按 unknown 收 */
  providers: unknown
  name: string
  homeDir: string
  fetch?: typeof fetch
  /** 取消这趟下载；面板放弃时后端不该继续占着带宽写盘。 */
  signal?: AbortSignal
}

/**
 * 手动更新单个 rule-provider：按草稿里的 url 下载，覆盖它自己的 path，全程不碰内核。
 *
 * 内核那条 `PUT /providers/rules/{name}` 要求内核在跑、下载也走内核的网络栈；面板想
 * 先把规则文件备好（或者干脆不启动内核）就得自己下。下载从宿主机直出 —— 草稿里的
 * `proxy` 字段是给内核用的，这里用不上。
 */
export async function fetchRuleSet(
  deps: FetchRuleSetDeps,
): Promise<{ name: string; path: string; bytes: number }> {
  const list = Array.isArray(deps.providers) ? (deps.providers as RuleProviderCandidate[]) : []
  const provider = list.find((item) => item?.name === deps.name)
  if (!provider) throw new Error(`fetchRuleSet: rule-set "${deps.name}" not found`)

  const url = typeof provider.url === 'string' ? provider.url.trim() : ''
  const rawPath = typeof provider.path === 'string' ? provider.path.trim() : ''
  if (provider.type !== 'http' || !url) {
    throw new Error(`fetchRuleSet: rule-set "${deps.name}" has no http url to download from`)
  }
  if (!rawPath) {
    throw new Error(`fetchRuleSet: rule-set "${deps.name}" has no local path to write`)
  }

  const dest = resolveInsideHome(deps.homeDir, rawPath)
  const doFetch = deps.fetch ?? fetch
  const res = await doFetch(url, { signal: deps.signal })
  if (!res.ok) {
    throw new Error(`fetchRuleSet: download failed ${res.status} for "${deps.name}" (${url})`)
  }
  const bytes = Buffer.from(await res.arrayBuffer())

  // 先写临时文件再改名：下载中断留下的半个文件不会顶掉内核正在读的那份。
  await mkdir(dirname(dest), { recursive: true })
  const tmp = `${dest}.${process.pid}.tmp`
  await writeFile(tmp, bytes)
  await rename(tmp, dest)
  return { name: deps.name, path: dest, bytes: bytes.length }
}

/** 相对 path 按内核 home 目录解析；落到 home 目录之外（../ 或另一个盘）一律拒绝。 */
function resolveInsideHome(homeDir: string, target: string): string {
  const root = resolve(homeDir)
  const dest = isAbsolute(target) ? resolve(target) : resolve(root, target)
  const rel = relative(root, dest)
  if (!rel || rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel)) {
    throw new Error(`fetchRuleSet: path "${target}" escapes the kernel home dir`)
  }
  return dest
}
