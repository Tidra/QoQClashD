import { useStorage } from '@/helper/storage'
import type { ProxyGroupDraft } from '@/types'

export const proxyGroups = useStorage<ProxyGroupDraft[]>('config/proxy-groups', [])

/** 内置的“全部节点”选择组：成员自动同步全部节点，不允许删除 */
export const ALL_NODES_GROUP_NAME = '全部节点'
export const isProtectedGroup = (name: string) => name === ALL_NODES_GROUP_NAME

export const syncAllNodesGroup = (nodeNames: string[]) => {
  const index = proxyGroups.value.findIndex((group) => group.name === ALL_NODES_GROUP_NAME)
  if (index === -1) {
    proxyGroups.value = [
      { name: ALL_NODES_GROUP_NAME, type: 'select', proxies: [...nodeNames] },
      ...proxyGroups.value,
    ]
    return
  }
  const current = proxyGroups.value[index]
  const selected = current['default-selected']
  const nextProxies = [...nodeNames]
  const unchanged =
    (!selected || nextProxies.includes(selected)) &&
    current.proxies.length === nextProxies.length &&
    current.proxies.every((name, i) => name === nextProxies[i])
  if (unchanged) return
  const next = [...proxyGroups.value]
  next[index] = {
    ...current,
    proxies: nextProxies,
    'default-selected': selected && nextProxies.includes(selected) ? selected : undefined,
  }
  proxyGroups.value = next
}

/** 启动清理：移除成员里已不存在的节点/组引用（“全部节点”组由 sync 托管，跳过） */
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
    'default-selected':
      group['default-selected'] === oldName ? newName : group['default-selected'],
  }))
}

export const setProxyGroupDefaultSelected = (name: string, member: string | undefined) => {
  proxyGroups.value = proxyGroups.value.map((group) =>
    group.name === name ? { ...group, 'default-selected': member } : group,
  )
}
