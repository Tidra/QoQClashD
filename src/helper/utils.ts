import { MIN_PROXY_CARD_WIDTH, PROXY_CARD_SIZE } from '@/constant'
import { readKvEntries, writeKvEntries } from '@/helper/storage'
import { useMediaQuery } from '@vueuse/core'
import dayjs from 'dayjs'
import prettyBytes, { type Options } from 'pretty-bytes'

export const isPreferredDark = useMediaQuery('(prefers-color-scheme: dark)')
export const isMiddleScreen = useMediaQuery('(max-width: 768px)')
export const isPWA = (() => {
  return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone
})()

export const prettyBytesHelper = (bytes: number, opts?: Options) => {
  // prettyBytes 对 NaN / Infinity 是抛错的。格式化函数几乎全在渲染函数里调用,
  // 一个脏字段抛出去就会毁掉整棵 vnode 树(而不只是这一格),故就地兜住。
  return prettyBytes(Number.isFinite(bytes) ? bytes : 0, {
    binary: false,
    ...opts,
  })
}

export const fromNow = (timestamp: string | number) => {
  return dayjs(timestamp).fromNow()
}

// 导出覆盖整个 KV，只按两份黑名单剔除：凭证类键 ——
//   setup/panel-password —— 面板登录密码，同时也是内核的 Clash API secret；
//   setup/api-list       —— 旧版本存下的后端列表，里头躺着明文 secret（数据保留，只是不外发）；
//   setup/panel-auth     —— 前端自己记的登录标记，会话改成服务端签发后已经没有意义。
// agent 侧（packages/agent/src/session.ts 的 CREDENTIAL_KV_KEYS）读时同样剔除、写删一律
// 400，这里再挡一层是为了导出的 JSON 本身就干净；两份名单要一起改。
export const CREDENTIAL_KV_KEYS = ['setup/panel-password', 'setup/api-list', 'setup/panel-auth']

// 第二份名单：机器专属路径，换机器时必坏的四个键。前三条是绝对路径，导入后会成为设置页
// 的预填值，点一下保存就 mkdir -p 并把内核 home 指到那台机器上的目录；applied-config-hash
// 则让「配置待下发」角标按下家机器的旧状态误判。运行时真正的路径来自 env
// （server/config.ts），所以不带它们不影响启动。
export const MACHINE_LOCAL_KV_KEYS = [
  'config/runtime-root',
  'config/config-dir',
  'config/core-storage-dir',
  'config/applied-config-hash',
]

/** 设置导入门禁：全库 − 凭证 − 机器专属路径。读写两侧同一口径，确认框才如实反映落盘的键。 */
export const isSettingsPortableKey = (key: string) =>
  !CREDENTIAL_KV_KEYS.includes(key) && !MACHINE_LOCAL_KV_KEYS.includes(key)

export const readKvSettings = async (): Promise<Record<string, unknown>> => {
  const entries = await readKvEntries('')
  const settings: Record<string, unknown> = {}

  for (const [key, raw] of Object.entries(entries)) {
    if (!isSettingsPortableKey(key)) continue
    try {
      settings[key] = JSON.parse(raw)
    } catch (error) {
      console.warn(`[settings] ${key} is not valid JSON, skipped`, error)
    }
  }

  return settings
}

/** 整段写回 KV,只覆盖点名的键;值与 useStorage 一样按 JSON 编码。 */
export const writeKvSettings = async (settings: Record<string, unknown>) => {
  const entries: Record<string, string> = {}

  for (const [key, value] of Object.entries(settings)) {
    if (!isSettingsPortableKey(key)) continue
    entries[key] = JSON.stringify(value)
  }

  const keys = Object.keys(entries)
  if (keys.length === 0) return 0

  await writeKvEntries(entries)
  return keys.length
}

export const exportSettings = async () => {
  const settings = await readKvSettings()
  const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'qoqclashd-settings'
  a.click()
  URL.revokeObjectURL(url)
}

export const getMinCardWidth = (size: PROXY_CARD_SIZE) => {
  return size === PROXY_CARD_SIZE.LARGE ? MIN_PROXY_CARD_WIDTH.LARGE : MIN_PROXY_CARD_WIDTH.SMALL
}

export const PROXIES_PARENT_CLASS = 'proxies-scrollable-parent'
