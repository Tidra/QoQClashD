// 把面板草稿组合出的 YAML 应用为内核配置：以 local profile 落盘（固定名称，
// id 记在 KV 里复用），再走 activate —— 校验、写 active.yaml 并重启内核。
// 这是「节点/代理组/规则编辑 → 内核生效」链路上原本缺失的一环。
import { useControlApi } from '@/composables/useControlApi'
import { composeConfigYaml } from '@/helper/composeConfig'
import { useStorage } from '@/helper/storage'
import { computed } from 'vue'

const PANEL_PROFILE_NAME = '面板配置'

const panelProfileId = useStorage<string>('config/panel-profile-id', '')

// djb2：只为比较「草稿组合结果是否变过」，不需要密码学强度
const hashYaml = (yaml: string) => {
  let h = 5381
  for (let i = 0; i < yaml.length; i++) h = ((h << 5) + h + yaml.charCodeAt(i)) >>> 0
  return String(h)
}

const appliedConfigHash = useStorage<string>('config/applied-config-hash', '')

// 草稿组合结果 vs 上次成功应用的结果：不一致 = 有改动还没下发内核。
// 组合失败（数据不完整）时不参与比较，避免误报。
const draftConfigHash = computed(() => {
  try {
    return hashYaml(composeConfigYaml())
  } catch {
    return ''
  }
})

export const pendingConfigChanges = computed(
  () => draftConfigHash.value !== '' && draftConfigHash.value !== appliedConfigHash.value,
)

export const applyComposedConfig = async (): Promise<void> => {
  const api = useControlApi()
  const content = composeConfigYaml()
  const profiles = await api.listProfiles()

  let id = panelProfileId.value
  if (!id || !profiles.some((p) => p.id === id)) {
    id = profiles.find((p) => p.name === PANEL_PROFILE_NAME)?.id ?? ''
  }

  if (id) {
    await api.updateProfile(id, { content })
  } else {
    const meta = await api.createProfile({ name: PANEL_PROFILE_NAME, content, type: 'local' })
    id = meta.id
  }
  panelProfileId.value = id
  await api.activateProfile(id)
  appliedConfigHash.value = hashYaml(content)
}
