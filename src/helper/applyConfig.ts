// 把面板草稿组合出的 YAML 应用为内核配置：以 local profile 落盘（固定名称，
// id 记在 KV 里复用），再走 activate —— 校验、写 active.yaml 并重启内核。
// 这是「节点/代理组/规则编辑 → 内核生效」链路上原本缺失的一环。
import { useControlApi } from '@/composables/useControlApi'
import { composeConfigYaml } from '@/helper/composeConfig'
import { useStorage } from '@/helper/storage'

const PANEL_PROFILE_NAME = '面板配置'

const panelProfileId = useStorage<string>('config/panel-profile-id', '')

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
}
