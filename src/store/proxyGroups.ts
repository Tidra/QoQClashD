import { useStorage } from '@/helper/storage'
import type { ProxyGroupDraft } from '@/types'

export const proxyGroups = useStorage<ProxyGroupDraft[]>('config/proxy-groups', [])

/** 内置组：成员由节点列表自动同步，不允许编辑/删除 */
export const ALL_NODES_GROUP_NAME = '全部节点'
/** 首次启动播种的 url-test 组：建完就归用户，可改名可删除 */
export const AUTO_URLTEST_GROUP_NAME = '自动选择'
export const isProtectedGroup = (name: string) => name === ALL_NODES_GROUP_NAME

/** 健康检查组的表单默认值：留空即回落到它们 */
export const GROUP_DEFAULTS = { interval: 3600, timeout: 5000 }

/**
 * 「自动选择」的种子：成员交给 filter '.*' 表达，而不是抄一份节点名单。
 *
 * 应用配置时 resolveGroupMembers 会把 filter 展开成显式成员，所以这个组播种完就不
 * 需要再托管 —— 节点增删它自己跟得上，用户改 filter 也没人会给他覆盖回去。
 */
export const autoUrlTestSeed = (testUrl: string): ProxyGroupDraft => ({
  name: AUTO_URLTEST_GROUP_NAME,
  type: 'url-test',
  proxies: [],
  filter: '.*',
  url: testUrl,
  interval: GROUP_DEFAULTS.interval,
  timeout: GROUP_DEFAULTS.timeout,
})

/** 「全部节点」常驻：成员始终等于当前节点列表 */
export const syncBuiltInGroups = (nodeNames: string[]) => {
  const groups = [...proxyGroups.value]
  const index = groups.findIndex((group) => group.name === ALL_NODES_GROUP_NAME)
  if (index === -1) {
    groups.push({ name: ALL_NODES_GROUP_NAME, type: 'select', proxies: [...nodeNames] })
  } else {
    const current = groups[index]
    const selected = current['default-selected']
    const nextProxies = [...nodeNames]
    const proxiesChanged =
      current.proxies.length !== nextProxies.length ||
      current.proxies.some((name, i) => name !== nextProxies[i])
    if (!proxiesChanged) return
    groups[index] = {
      ...current,
      proxies: nextProxies,
      'default-selected': selected && nextProxies.includes(selected) ? selected : undefined,
    }
  }
  // 一次赋值而不是逐个改：deep watch 会回调本函数，多写会连环触发 KV 回写
  proxyGroups.value = groups
}

/** 启动清理：移除成员里已不存在的节点/组引用（内置组的成员由 sync 托管，跳过） */
export const pruneProxyGroupMembers = (validNames: Set<string>) => {
  proxyGroups.value = proxyGroups.value.map((group) => {
    if (isProtectedGroup(group.name)) return group
    const proxies = group.proxies.filter((member) => validNames.has(member))
    const selected = group['default-selected']
    return {
      ...group,
      proxies,
      'default-selected': selected && !proxies.includes(selected) ? undefined : selected,
    }
  })
}

/** 归一化组类型为 mihomo 认的写法：兼容 select/selector、urltest/url-test 等别名 */
export const normalizeGroupType = (type: string) => {
  const value = type.toLowerCase()
  if (value === 'selector' || value === 'select') return 'select'
  if (value === 'urltest' || value === 'url-test') return 'url-test'
  if (value === 'loadbalance' || value === 'load-balance') return 'load-balance'
  return value
}

/** 兼容 mihomo 的 (?i) 内联忽略大小写标记；非法正则回退为子串匹配 */
export const matchesFilterPattern = (pattern: string, name: string) => {
  const cleaned = pattern.replace(/\(\?i\)/g, '')
  try {
    return new RegExp(cleaned, 'i').test(name)
  } catch {
    return name.toLowerCase().includes(cleaned.toLowerCase())
  }
}

/** 选择组的最终成员 = 显式成员 ∪ 筛选/排除筛选命中的节点 */
export const resolveGroupMembers = (group: ProxyGroupDraft, nodeNames: string[]): string[] => {
  const explicit = group.proxies ?? []
  if (!group.filter) return [...explicit]
  const matched = nodeNames.filter(
    (name) =>
      matchesFilterPattern(group.filter!, name) &&
      !(group['exclude-filter'] && matchesFilterPattern(group['exclude-filter'], name)),
  )
  return [...new Set([...matched, ...explicit])]
}

export const upsertProxyGroup = (group: ProxyGroupDraft, originalName?: string) => {
  const index = proxyGroups.value.findIndex((item) => item.name === (originalName ?? group.name))
  if (index === -1) {
    proxyGroups.value = [...proxyGroups.value, group]
    return
  }

  const next = [...proxyGroups.value]
  next[index] = group
  proxyGroups.value = next
}

export const removeProxyGroup = (name: string) => {
  if (isProtectedGroup(name)) return
  proxyGroups.value = proxyGroups.value.filter((group) => group.name !== name)
}

export const removeProxyGroupMembers = (names: string[]) => {
  const removed = new Set(names)
  proxyGroups.value = proxyGroups.value.map((group) => ({
    ...group,
    proxies: group.proxies.filter((member) => !removed.has(member)),
    'default-selected':
      group['default-selected'] && removed.has(group['default-selected'])
        ? undefined
        : group['default-selected'],
  }))
}

export const renameProxyGroupMember = (oldName: string, newName: string) => {
  if (oldName === newName) return
  proxyGroups.value = proxyGroups.value.map((group) => ({
    ...group,
    proxies: group.proxies.map((member) => (member === oldName ? newName : member)),
    'default-selected': group['default-selected'] === oldName ? newName : group['default-selected'],
  }))
}

export const setProxyGroupDefaultSelected = (name: string, member: string | undefined) => {
  proxyGroups.value = proxyGroups.value.map((group) =>
    group.name === name ? { ...group, 'default-selected': member } : group,
  )
}
