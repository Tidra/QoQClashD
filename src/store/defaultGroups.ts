import { useStorage } from '@/helper/storage'
import { computed, ref } from 'vue'

export interface DefaultGroup {
  name: string
  region: string
  nodes: string[]
}

const storedDefaultGroups = useStorage<DefaultGroup[]>('defaultGroups', [])
export const defaultGroups = ref<DefaultGroup[]>(storedDefaultGroups.value || [])

export const defaultGroupList = computed(() => defaultGroups.value)

export const DEFAULT_REGIONS = ['HK', 'JP', 'US'] as const

export function addDefaultGroup(group: DefaultGroup) {
  if (defaultGroups.value.some((g) => g.name === group.name)) return
  defaultGroups.value.push(group)
}

export function updateDefaultGroup(groupName: string, patch: Partial<DefaultGroup>) {
  const group = defaultGroups.value.find((g) => g.name === groupName)
  if (!group) return
  Object.assign(group, patch)
}

export function removeDefaultGroup(groupName: string) {
  defaultGroups.value = defaultGroups.value.filter((g) => g.name !== groupName)
}

export function nodePoolToDefaultGroups(poolNames: string[]) {
  const pools = poolNames
    .filter((name) => name)
    .map((name) => ({
      name,
      region: '',
      nodes: [name],
    }))

  if (!pools.length) return

  const newNames = new Set(pools.map((p) => p.name))
  defaultGroups.value = defaultGroups.value.filter((g) => !newNames.has(g.name))
  defaultGroups.value.push(...pools)
}

export function buildDefaultGroupMihomo() {
  const groups: DefaultGroup[] = [
    { name: 'HK', region: 'HK', nodes: [] },
    { name: 'JP', region: 'JP', nodes: [] },
    { name: 'US', region: 'US', nodes: [] },
  ]
  const overrides = new Map<string, DefaultGroup>(defaultGroups.value.map((g) => [g.name, g]))
  for (const group of groups) {
    const override = overrides.get(group.name)
    if (override) Object.assign(group, override)
  }

  return groups
}
