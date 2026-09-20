import { showConfirmDialog } from '@/helper/confirmDialog'
import { useStorage } from '@/helper/storage'
import { isSettingsPortableKey, readKvSettings, writeKvSettings } from '@/helper/utils'
import { i18n } from '@/i18n'

// 用户在确认框里勾选"不再提示"后置为 true，之后直接应用。存在 KV 的 cache/ 段，
// 因此会随全库导出一起带走。
export const skipImportSettingsConfirm = useStorage('cache/skip-import-settings-confirm', false)

// 弹窗确认是否用即将导入的设置覆盖本地。无 key 会被实际覆盖时视为无需应用(返回 false)。
const confirmSettingsOverride = async (overriddenKeys: string[]) => {
  if (overriddenKeys.length === 0) {
    return false
  }

  // 用户选择过"不再提示"，直接应用
  if (skipImportSettingsConfirm.value) {
    return true
  }

  const { confirmed, checked } = await showConfirmDialog({
    title: i18n.global.t('importSettings'),
    message: i18n.global.t('importSettingsConfirm', {
      keys: overriddenKeys.join('\n'),
    }),
    checkboxText: i18n.global.t('dontAskAgainAlwaysApply'),
  })

  // 取消时勾选无意义(不再提示的是"不再问"),仅确认时记住
  if (confirmed && checked) {
    skipImportSettingsConfirm.value = true
  }

  return confirmed
}

// 找出导入的设置里真正会覆盖 KV 的 key(与 writeKvSettings 的过滤保持一致)
const getImportOverriddenKeys = async (settings: Record<string, unknown>) => {
  const current = await readKvSettings()

  return Object.keys(settings).filter(
    (key) =>
      isSettingsPortableKey(key) && JSON.stringify(current[key]) !== JSON.stringify(settings[key]),
  )
}

/** 导入的唯一落点:确认覆盖 → 整段写 KV → 重载让各个 store 重新水合。 */
export const applyImportedSettings = async (settings: Record<string, unknown>) => {
  if (!(await confirmSettingsOverride(await getImportOverriddenKeys(settings)))) {
    return false
  }

  await writeKvSettings(settings)
  location.reload()
  return true
}
