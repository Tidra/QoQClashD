import { useControlApi } from '@/composables/useControlApi'
import { applyDraftConfig, pendingConfigChanges } from '@/helper/applyConfig'
import { showNotification } from '@/helper/notification'
import { useStorage } from '@/helper/storage'
import type { CustomNode } from '@/store/nodePool'
import { addNodePool, nodePools, removeNodePool, updateNodePool } from '@/store/nodePool'
import { v4 as uuid } from 'uuid'
import { ref } from 'vue'
import { parse as parseYaml } from 'yaml'

export interface SubscriptionItem {
  id: string
  name: string
  url: string
  enabled: boolean
  autoUpdate: boolean
  /** 自动更新间隔（分钟），autoUpdate 开启时生效 */
  updateInterval?: number
  /** 拉到新节点后是否顺带下发内核（组合 YAML → 重启内核） */
  applyToKernel?: boolean
  /** 拉取内容导入到的节点池 id */
  poolId?: string
  updatedAt?: string
}

export type SubscriptionStatus = 'idle' | 'pending' | 'ok' | 'error'

// 订阅元数据持久化在后端 KV（data 目录的 sqlite）。
// 节点内容本身拉取后由 nodePool 统一合并，这里只存"哪个订阅 + 什么状态"。
export const subscriptionList = useStorage<SubscriptionItem[]>('config/subscriptions', [])
// 每个订阅的拉取状态，不持久化（会话级），刷新后重置为 idle。
export const subscriptionStatus = ref<Record<string, SubscriptionStatus>>({})
export const subscriptionError = ref<Record<string, string>>({})

const isValidUrl = (url: string) => /^https?:\/\//.test(url.trim())

export const addSubscription = (
  data: Omit<SubscriptionItem, 'id' | 'updatedAt'>,
): SubscriptionItem => {
  const item: SubscriptionItem = {
    ...data,
    id: `subscription-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  }
  subscriptionList.value = [item, ...subscriptionList.value]
  return item
}

export const updateSubscription = (id: string, patch: Partial<SubscriptionItem>) => {
  subscriptionList.value = subscriptionList.value.map((item) =>
    item.id === id ? { ...item, ...patch, id: item.id } : item,
  )
}

export const removeSubscription = (id: string) => {
  const item = subscriptionList.value.find((sub) => sub.id === id)
  if (item?.poolId && nodePools.value.some((pool) => pool.id === item.poolId)) {
    removeNodePool(item.poolId)
  }
  subscriptionList.value = subscriptionList.value.filter((sub) => sub.id !== id)
  delete subscriptionStatus.value[id]
  delete subscriptionError.value[id]
}

export const toggleSubscription = (id: string) => {
  subscriptionList.value = subscriptionList.value.map((item) =>
    item.id === id ? { ...item, enabled: !item.enabled } : item,
  )
}

// 拉取订阅内容。走面板后端代理（POST /api/control/subscriptions/fetch），
// 因为大多数订阅源不带 CORS 头，浏览器直连 fetch 必然被拦。
// 返回解析出的 YAML 文本（可能为 base64 解码后的结果），失败抛错由调用方捕获。
export const fetchSubscriptionContent = async (url: string): Promise<string> => {
  const res = await useControlApi().fetchSubscriptionContent(url)
  let text = res.content

  // 部分订阅源返回 base64 编码的 YAML（典型 Clash 订阅特征）。
  const trimmed = text.trim()
  if (
    trimmed.length > 64 &&
    /^[A-Za-z0-9+/=\s]+$/.test(trimmed) &&
    trimmed.replace(/\s/g, '').length % 4 === 0
  ) {
    try {
      const decoded = atob(trimmed.replace(/\s/g, ''))
      if (decoded.includes('proxies') || decoded.includes('proxy-groups')) {
        text = decoded
      }
    } catch {
      // 解码失败说明不是 base64，保持原文
    }
  }

  return text
}

// 更新单个订阅：拉取内容并记录状态。具体如何写入节点池由调用方
// （nodePool / 路由）决定，本函数只负责"拉取 + 状态 + 时间戳"。
export const refreshSubscription = async (
  id: string,
): Promise<{ ok: boolean; content?: string; error?: string }> => {
  const item = subscriptionList.value.find((s) => s.id === id)
  if (!item) return { ok: false, error: 'not found' }
  if (!item.enabled || !isValidUrl(item.url)) {
    subscriptionError.value[id] = 'invalid url'
    return { ok: false, error: 'disabled or invalid url' }
  }

  subscriptionStatus.value[id] = 'pending'
  try {
    const content = await fetchSubscriptionContent(item.url)
    subscriptionStatus.value[id] = 'ok'
    subscriptionError.value[id] = ''
    updateSubscription(id, { updatedAt: new Date().toISOString() })
    return { ok: true, content }
  } catch (error) {
    subscriptionStatus.value[id] = 'error'
    const message = error instanceof Error ? error.message : String(error)
    subscriptionError.value[id] = message
    showNotification({
      content: 'subscriptionUpdateFailed',
      params: { error: message },
      type: 'alert-error',
    })
    return { ok: false, error: message }
  }
}

// 批量更新所有启用的订阅（拉取 + 导入节点池）。
export const refreshAllSubscriptions = async (): Promise<{
  contents: Record<string, string>
}> => {
  const contents: Record<string, string> = {}
  const enabled = subscriptionList.value.filter((s) => s.enabled && isValidUrl(s.url))

  await Promise.all(
    enabled.map(async (item) => {
      const result = await refreshSubscriptionWithImport(item.id)
      if (result.ok) contents[item.id] = ''
    }),
  )

  return { contents }
}

// 把订阅返回的 Clash YAML 里的 proxies 列表映射成节点池条目。
// 仅映射本项目 CustomNode 支持的字段，其余核心参数原样保留在订阅配置中。
const parseSubscriptionNodes = (content: string): Omit<CustomNode, 'id'>[] => {
  let doc: unknown
  try {
    doc = parseYaml(content)
  } catch {
    return []
  }
  const rawList = Array.isArray(doc) ? doc : (doc as { proxies?: unknown })?.proxies
  if (!Array.isArray(rawList)) return []

  const nodes: Omit<CustomNode, 'id'>[] = []
  for (const entry of rawList) {
    if (!entry || typeof entry !== 'object') continue
    const p = entry as Record<string, unknown>
    const name = typeof p.name === 'string' ? p.name : ''
    const type = typeof p.type === 'string' ? p.type.toLowerCase() : ''
    const server = typeof p.server === 'string' ? p.server : ''
    const port = Number(p.port)
    if (!name || !type || !server || !Number.isInteger(port) || port <= 0 || port > 65535) continue

    const alpn = Array.isArray(p.alpn) ? (p.alpn as unknown[]).map(String) : undefined
    // vmess/vless 用 uuid，trojan/ss/hy2 用 password——面板里统一存进 password 字段。
    const secret =
      typeof p.password === 'string' && p.password
        ? p.password
        : typeof p.uuid === 'string'
          ? p.uuid
          : ''
    const alterIdRaw = Number(p.alterId ?? p['alter-id'])
    const network = typeof p.network === 'string' ? p.network.toLowerCase() : ''
    const wsOpts = (p['ws-opts'] ?? (network === 'ws' ? p : undefined)) as
      Record<string, unknown> | undefined
    const wsPath =
      typeof p['ws-path'] === 'string'
        ? p['ws-path']
        : typeof p.path === 'string'
          ? p.path
          : typeof wsOpts?.path === 'string'
            ? wsOpts.path
            : ''
    const rawHeaders = wsOpts?.headers as Record<string, unknown> | undefined
    const wsHeaders = rawHeaders
      ? Object.fromEntries(
          Object.entries(rawHeaders).map(([k, v]) => [
            k,
            Array.isArray(v) ? v.map(String) : [String(v)],
          ]),
        )
      : undefined
    const grpcOpts = (p['grpc-opts'] ?? (network === 'grpc' ? p : undefined)) as
      Record<string, unknown> | undefined
    const grpcServiceName =
      typeof p['grpc-service-name'] === 'string'
        ? p['grpc-service-name']
        : typeof grpcOpts?.['grpc-service-name'] === 'string'
          ? grpcOpts['grpc-service-name']
          : ''
    const node: Omit<CustomNode, 'id'> = {
      name,
      type,
      server,
      port,
      ...(typeof p.cipher === 'string' && p.cipher ? { cipher: p.cipher } : {}),
      ...(secret ? { password: secret } : {}),
      ...(Number.isInteger(alterIdRaw) && alterIdRaw > 0 ? { alterId: alterIdRaw } : {}),
      sni: typeof p.sni === 'string' ? p.sni : typeof p.servername === 'string' ? p.servername : '',
      tls: p.tls === true || (p.tls as { enabled?: unknown } | undefined)?.enabled === true,
      fingerprint:
        typeof p.fingerprint === 'string'
          ? p.fingerprint
          : typeof p['client-fingerprint'] === 'string'
            ? (p['client-fingerprint'] as string)
            : '',
      ...(alpn?.length ? { alpn } : {}),
      tfo: p.tfo === true,
      skipCertVerification: p['skip-cert-verify'] === true || p.skipCertVerification === true,
      wsPath,
      ...(wsHeaders ? { wsHeaders } : {}),
      grpcServiceName,
    }
    nodes.push(node)
  }
  return nodes
}

// 将订阅内容导入节点池：一个订阅对应一个池（subscriptionId 关联），每次整体刷新节点。
// 返回导入的节点数；解析不到节点时保留原池内容不动。
export const applySubscriptionContent = (id: string, content: string): number => {
  const item = subscriptionList.value.find((s) => s.id === id)
  if (!item) return 0
  const parsed = parseSubscriptionNodes(content)
  if (!parsed.length) return 0

  const nodes: CustomNode[] = parsed.map((node) => ({ ...node, id: uuid() }))
  const existing = nodePools.value.find((pool) => pool.subscriptionId === id)
  if (existing) {
    updateNodePool(existing.id, { name: item.name, nodes })
    return nodes.length
  }
  const pool = addNodePool({
    name: item.name,
    enabled: true,
    dedupe: true,
    nodes: [],
    subscriptionId: id,
  })
  updateNodePool(pool.id, { nodes })
  updateSubscription(id, { poolId: pool.id })
  return nodes.length
}

export const refreshSubscriptionWithImport = async (
  id: string,
): Promise<{ ok: boolean; imported: number; error?: string }> => {
  const item = subscriptionList.value.find((s) => s.id === id)
  const result = await refreshSubscription(id)
  if (!result.ok) return { ok: false, imported: 0, error: result.error }
  const imported = result.content ? applySubscriptionContent(id, result.content) : 0
  // 勾选了「更新后下发内核」：订阅源没变时草稿 hash 不变，就不去重启内核。
  // 批量刷新里多个订阅同时命中会各自请求一次，applyDraftConfig 内部合并成补发一轮。
  if (imported && item?.applyToKernel && pendingConfigChanges.value) void applyDraftConfig()
  return { ok: true, imported }
}

const AUTO_UPDATE_TICK_MS = 60_000
const DEFAULT_UPDATE_INTERVAL_MIN = 1440
let autoUpdateTimer: ReturnType<typeof setInterval> | undefined
let autoUpdateRunning = false
// 会话级：记录失败尝试时间，避免订阅源持续失败时每个 tick 都重试并弹通知
const lastAttemptAt = new Map<string, number>()

// 自动更新：每分钟检查一次，到点的订阅拉取并导入节点池。
export const startSubscriptionAutoUpdate = () => {
  if (autoUpdateTimer !== undefined) return
  autoUpdateTimer = setInterval(() => {
    void runAutoUpdateTick()
  }, AUTO_UPDATE_TICK_MS)
  void runAutoUpdateTick()
}

const runAutoUpdateTick = async () => {
  if (autoUpdateRunning) return
  autoUpdateRunning = true
  try {
    const now = Date.now()
    const due = subscriptionList.value.filter((item) => {
      if (!item.enabled || !item.autoUpdate) return false
      const intervalMs = (item.updateInterval ?? DEFAULT_UPDATE_INTERVAL_MIN) * 60_000
      const last = Math.max(
        item.updatedAt ? new Date(item.updatedAt).getTime() : 0,
        lastAttemptAt.get(item.id) ?? 0,
      )
      return now - last >= intervalMs
    })
    for (const item of due) {
      lastAttemptAt.set(item.id, Date.now())
      await refreshSubscriptionWithImport(item.id)
    }
  } finally {
    autoUpdateRunning = false
  }
}
