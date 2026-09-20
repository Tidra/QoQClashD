import { proxyGroupList, proxyMap } from '@/assembly/proxies'
import { FOLDER_MODE, FOLDER_MODE_AUTO_THRESHOLD } from '@/constant'
import { useStorage, whenStorageReady } from '@/helper/storage'
import { proxyFolderMode } from '@/store/settings'
import { v4 as uuid } from 'uuid'
import { computed, watch } from 'vue'

export const VIRTUAL_ALL = '__all__'
export const VIRTUAL_UNCAT = '__uncat__'

const BUILTIN_STRATEGY_ID = 'builtin-strategy'
const BUILTIN_NODES_ID = 'builtin-nodes'

const REGION_BUCKETS = [
  { code: 'HK', pattern: /(?:^|[-_\s])(HKG|HK|HongKong|香港)(?:$|[-_\s])/i },
  { code: 'JP', pattern: /(?:^|[-_\s])(JP|JPN|Japan|日本)(?:$|[-_\s])/i },
  { code: 'US', pattern: /(?:^|[-_\s])(US|USA|UnitedStates|美国)(?:$|[-_\s])/i },
  { code: 'SG', pattern: /(?:^|[-_\s])(SG|Singapore|新加坡)(?:$|[-_\s])/i },
  { code: 'TW', pattern: /(?:^|[-_\s])(TW|TWN|Taiwan|台湾)(?:$|[-_\s])/i },
  { code: 'KR', pattern: /(?:^|[-_\s])(KR|Korea|韩国)(?:$|[-_\s])/i },
  { code: 'CA', pattern: /(?:^|[-_\s])(CA|Canada|加拿大)(?:$|[-_\s])/i },
  { code: 'UK', pattern: /(?:^|[-_\s])(UK|GB|UnitedKingdom|英国)(?:$|[-_\s])/i },
] as const

export const buildRegionSuggestionFolders = (groupNames: string[]): Folder[] => {
  const buckets = new Map<string, Set<string>>()

  for (const name of groupNames) {
    const normalized = name.trim()

    if (!normalized) continue

    const region = REGION_BUCKETS.find(({ pattern }) => pattern.test(normalized))?.code

    if (!region) continue

    const current = buckets.get(region) ?? new Set<string>()
    current.add(normalized)
    buckets.set(region, current)
  }

  return [...buckets.entries()]
    .sort(
      ([left], [right]) =>
        REGION_BUCKETS.findIndex((entry) => entry.code === left) -
        REGION_BUCKETS.findIndex((entry) => entry.code === right),
    )
    .map(([code, members]) => ({
      id: uuid(),
      name: code,
      order: 0,
      rules: [],
      manualIncludes: [...members].sort(),
    }))
}

export type FolderRule =
  | { type: 'auto'; value: 'nodeOnly' | 'hasGroup' }
  | { type: 'regex'; pattern: string }
  | { type: 'excludeRegex'; pattern: string }

export interface Folder {
  id: string
  name: string
  icon?: string
  order: number
  rules: FolderRule[]
  manualIncludes: string[]
}

interface FolderState {
  folders: Folder[]
  activeId: string
  seeded: boolean
}

const defaultState = (): FolderState => ({
  folders: [],
  activeId: VIRTUAL_ALL,
  seeded: false,
})

// 文件夹状态持久化在后端 KV（与其余配置同一个库）。
const folderState = useStorage<FolderState>('config/proxy-folders', defaultState())

const seedDefaultFolders = () => {
  if (folderState.value.seeded) return
  folderState.value.folders = [
    {
      id: BUILTIN_STRATEGY_ID,
      name: 'folder_builtin_strategy',
      order: 0,
      rules: [{ type: 'auto', value: 'hasGroup' }],
      manualIncludes: [],
    },
    {
      id: BUILTIN_NODES_ID,
      name: 'folder_builtin_nodes',
      order: 1,
      rules: [{ type: 'auto', value: 'nodeOnly' }],
      manualIncludes: [],
    },
  ]
  folderState.value.seeded = true
}

// 等待首次服务器读取完成，避免 seeded 标记还是默认值时覆盖已保存的分组
void whenStorageReady().then(() => seedDefaultFolders())

export const folders = computed({
  get: () => folderState.value.folders,
  set: (v) => {
    folderState.value.folders = v
  },
})

export const activeFolderId = computed({
  get: () => folderState.value.activeId,
  set: (v) => {
    folderState.value.activeId = v
  },
})

const isNodeOnly = (groupName: string) => {
  const g = proxyMap.value[groupName]
  if (!g?.all || g.all.length === 0) return false
  const groupSet = new Set(proxyGroupList.value)
  return !g.all.some((member) => groupSet.has(member))
}

const matchRule = (groupName: string, rule: FolderRule): boolean => {
  if (rule.type === 'auto') {
    return rule.value === 'nodeOnly' ? isNodeOnly(groupName) : !isNodeOnly(groupName)
  }
  if (rule.type === 'regex' || rule.type === 'excludeRegex') {
    if (!rule.pattern) return false
    try {
      return new RegExp(rule.pattern).test(groupName)
    } catch {
      return false
    }
  }
  return false
}

const folderRuleMatch = (groupName: string, rules: FolderRule[]): boolean => {
  const includes = rules.filter((r) => r.type === 'auto' || r.type === 'regex')
  const excludes = rules.filter((r) => r.type === 'excludeRegex')
  if (!includes.some((r) => matchRule(groupName, r))) return false
  return !excludes.some((r) => matchRule(groupName, r))
}

const sortedFolders = computed(() =>
  [...folderState.value.folders].sort((a, b) => a.order - b.order),
)

export const groupMatchesFolderRule = (groupName: string, folderId: string): boolean => {
  const f = folderState.value.folders.find((x) => x.id === folderId)
  if (!f) return false
  return folderRuleMatch(groupName, f.rules)
}

const foldersOfGroup = (groupName: string): string[] => {
  const result: string[] = []
  for (const f of sortedFolders.value) {
    const manual = f.manualIncludes.includes(groupName)
    const ruled = folderRuleMatch(groupName, f.rules)
    if (manual || ruled) result.push(f.id)
  }
  return result
}

const groupsByFolder = computed(() => {
  const map = new Map<string, string[]>()
  for (const name of proxyGroupList.value) {
    const ids = foldersOfGroup(name)
    if (ids.length === 0) {
      const list = map.get(VIRTUAL_UNCAT) ?? []
      list.push(name)
      map.set(VIRTUAL_UNCAT, list)
      continue
    }
    for (const id of ids) {
      const list = map.get(id) ?? []
      list.push(name)
      map.set(id, list)
    }
  }
  return map
})

export const groupsInActiveFolder = computed<Set<string> | null>(() => {
  const id = folderState.value.activeId
  if (id === VIRTUAL_ALL) return null
  const list = groupsByFolder.value.get(id) ?? []
  return new Set(list)
})

export const folderCount = (id: string) => groupsByFolder.value.get(id)?.length ?? 0

export const isProxyFolderModeActive = computed(() => {
  switch (proxyFolderMode.value) {
    case FOLDER_MODE.ON:
      return true
    case FOLDER_MODE.OFF:
      return false
    default:
      return proxyGroupList.value.length > FOLDER_MODE_AUTO_THRESHOLD
  }
})

watch(
  proxyGroupList,
  (list) => {
    if (!list.length) return
    const id = folderState.value.activeId
    if (id === VIRTUAL_ALL || id === VIRTUAL_UNCAT) return
    if (!folderState.value.folders.some((f) => f.id === id)) {
      folderState.value.activeId = VIRTUAL_ALL
    }
  },
  { immediate: true },
)

export const createFolder = (name: string): Folder => {
  const folder: Folder = {
    id: uuid(),
    name,
    order: folderState.value.folders.length,
    rules: [],
    manualIncludes: [],
  }
  folderState.value.folders.push(folder)
  return folder
}

export const removeFolder = (id: string) => {
  folderState.value.folders = folderState.value.folders.filter((f) => f.id !== id)
  if (folderState.value.activeId === id) folderState.value.activeId = VIRTUAL_ALL
}

export const updateFolder = (id: string, patch: Partial<Omit<Folder, 'id'>>) => {
  const f = folderState.value.folders.find((x) => x.id === id)
  if (!f) return
  Object.assign(f, patch)
}

export const reorderFolders = (ids: string[]) => {
  const map = new Map(folderState.value.folders.map((f) => [f.id, f]))
  const next: Folder[] = []
  ids.forEach((id, idx) => {
    const f = map.get(id)
    if (f) {
      f.order = idx
      next.push(f)
      map.delete(id)
    }
  })
  for (const f of map.values()) {
    f.order = next.length
    next.push(f)
  }
  folderState.value.folders = next
}

export const addGroupToFolder = (groupName: string, folderId: string) => {
  const f = folderState.value.folders.find((x) => x.id === folderId)
  if (!f) return
  if (!f.manualIncludes.includes(groupName)) f.manualIncludes.push(groupName)
}

export const removeManualInclude = (groupName: string, folderId: string) => {
  const f = folderState.value.folders.find((x) => x.id === folderId)
  if (!f) return
  f.manualIncludes = f.manualIncludes.filter((n) => n !== groupName)
}

export const folderManagerOpen = useStorage('cache/folder-manager-open', false, sessionStorage)
