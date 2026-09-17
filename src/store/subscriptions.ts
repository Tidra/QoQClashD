import { showNotification } from '@/helper/notification'
import { useI18n } from 'vue-i18n'
import { useStorage } from '@/helper/storage'
import { ref } from 'vue'

export interface SubscriptionItem {
  id: string
  name: string
  url: string
  enabled: boolean
  autoUpdate: boolean
  updatedAt?: string
}

export type SubscriptionStatus = 'idle' | 'pending' | 'ok' | 'error'

// 订阅元数据持久化在 localStorage（data 目录的浏览器侧落点）。
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
  subscriptionList.value = subscriptionList.value.filter((item) => item.id !== id)
  delete subscriptionStatus.value[id]
  delete subscriptionError.value[id]
}

export const toggleSubscription = (id: string) => {
  subscriptionList.value = subscriptionList.value.map((item) =>
    item.id === id ? { ...item, enabled: !item.enabled } : item,
  )
}

// 拉取订阅内容。返回解析出的 YAML 文本（可能为 base64 解码后的结果），
// 失败抛错由调用方捕获。CORS 受限时提示用户。
export const fetchSubscriptionContent = async (url: string): Promise<string> => {
  const response = await fetch(url, { headers: { Accept: 'text/yaml, application/json, */*' } })
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  let text = await response.text()

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

// 批量更新所有启用的订阅（返回各订阅结果与聚合内容，供节点池合并）。
export const refreshAllSubscriptions = async (): Promise<{
  contents: Record<string, string>
}> => {
  const contents: Record<string, string> = {}
  const enabled = subscriptionList.value.filter((s) => s.enabled && isValidUrl(s.url))

  await Promise.all(
    enabled.map(async (item) => {
      const result = await refreshSubscription(item.id)
      if (result.ok && result.content) contents[item.id] = result.content
    }),
  )

  return { contents }
}
