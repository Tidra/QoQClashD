import { useStorage } from '@/helper/storage'
import type { Backend } from '@/types'
import { isEqual, omit } from 'lodash'
import { v4 as uuid } from 'uuid'
import { computed, ref, watch } from 'vue'
import { sourceIPLabelList } from './settings'

// 旧版本的后端结构:没有 `type` 字段;更早的版本还把 sing-box 作为附属通道
// `singboxChannel` 挂在 clash 后端上,后来才拆成独立的 `type: 'singbox'` 条目。
// sing-box 支持已移除,两种形态都直接丢弃。
type LegacyBackend = Omit<Partial<Backend>, 'type'> & { type?: string; singboxChannel?: unknown }

const isLegacyBackend = (item: LegacyBackend) =>
  !item.type || 'singboxChannel' in item || item.type === 'singbox'

// 一次性迁移:补全 `type`,丢掉 singboxChannel 附属通道与 sing-box 后端条目。
const migrateBackendList = (list: LegacyBackend[]): Backend[] =>
  list
    .filter((item) => item.type !== 'singbox')
    .map((item) => ({ ...(omit(item, 'singboxChannel') as Backend), type: 'clash' }))

// Compatibility shape for existing views. The product now supports one Mihomo
// instance, so this collection is normalized to zero or one item.
export const backendList = useStorage<Backend[]>('setup/api-list', [])

const normalizeBackendList = () => {
  const migrated = migrateBackendList(backendList.value as LegacyBackend[])
  const next = migrated.slice(0, 1)
  if (JSON.stringify(next) !== JSON.stringify(backendList.value)) {
    backendList.value = next
  }
  return next
}

normalizeBackendList()

export const activeUuid = useStorage<string>('setup/active-uuid', '')

// 被丢弃的 sing-box 后端可能正是当前激活项,留着会让整个面板对着一个不存在的
// 后端空转。清掉 uuid 后 activeBackend 为空,路由守卫会把用户送回 Setup 页。
const reconcileActiveBackend = () => {
  const [backend] = normalizeBackendList()
  if (!backend) {
    if (activeUuid.value) activeUuid.value = ''
    return
  }
  if (activeUuid.value !== backend.uuid) activeUuid.value = backend.uuid
}

// Both values load asynchronously from agent storage. Reconcile after either
// one changes so a stale default cannot erase the persisted active instance.
watch([backendList, activeUuid], reconcileActiveBackend, { deep: true, immediate: true })
export const activeBackend = computed(() =>
  backendList.value.find((backend) => backend.uuid === activeUuid.value),
)

// 切换后端的唯一写入口。切换本身只是改一个 uuid,但后续的一切(会话重启、探测、
// 提示)都挂在 activeBackend 的 watch 上,散着写 activeUuid 就没有地方能收口。
export const setActiveBackend = (uuid: string) => {
  activeUuid.value = uuid
}

// 后端管理面板的形态。null = 关闭;list / create / edit 是同一个面板的三种视图,
// 而不是三个弹窗 —— 从列表点进编辑、保存后退回列表,都不该有弹窗开合的闪烁。
//
// 放在 store 而不是 composable:api 层遇到 401 要把编辑框直接摆到用户面前,而按
// eslint.config.ts 的分层约束,api 层只允许依赖 store/setup。
export type BackendManagerView =
  { mode: 'list' } | { mode: 'create' } | { mode: 'edit'; uuid: string }

export const backendManagerView = ref<BackendManagerView | null>(null)

export const openBackendManager = (view: BackendManagerView = { mode: 'list' }) => {
  backendManagerView.value = view
}

export const closeBackendManager = () => {
  backendManagerView.value = null
}

export const addBackend = (backend: Omit<Backend, 'uuid'>) => {
  const current = backendList.value[0]
  if (current && isEqual(omit(current, 'uuid'), backend)) {
    setActiveBackend(current.uuid)
    return current.uuid
  }

  const id = current?.uuid ?? uuid()
  backendList.value = [{
    ...backend,
    uuid: id,
  }]
  setActiveBackend(id)
  return id
}

export const updateBackend = (uuid: string, backend: Omit<Backend, 'uuid'>) => {
  const index = backendList.value.findIndex((end) => end.uuid === uuid)
  if (index !== -1) {
    backendList.value[index] = {
      ...backend,
      uuid,
    }
  }
}

export const removeBackend = (uuid: string) => {
  const wasActive = activeUuid.value === uuid

  backendList.value = backendList.value.filter((end) => end.uuid !== uuid)

  // 删掉的正是当前后端时,顺手落到剩下的第一个。否则 activeBackend 变成 undefined,
  // 路由守卫会当场把用户踢去 setup 页 —— 而他只是在管理面板里删了一条。
  if (wasActive) {
    setActiveBackend(backendList.value[0]?.uuid ?? '')
  }

  sourceIPLabelList.value.forEach((label) => {
    if (label.scope && label.scope.includes(uuid)) {
      label.scope = label.scope.filter((scope) => scope !== uuid)
      if (!label.scope.length) {
        delete label.scope
      }
    }
  })
}
