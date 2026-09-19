import type { SegmentOption } from '@/components/common/SegmentedControl.vue'
import { showNotification } from '@/helper/notification'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { stringify as stringifyYaml } from 'yaml'

/*
 * 编辑弹窗「表单 / YAML」双模式的共享状态。各弹窗只提供两个回调：
 * buildYaml —— 切到 YAML 页签时把表单快照序列化成对象；
 * applyYaml —— 切回表单页签（或保存）时解析文本并回填，返回 false 视为解析失败。
 */
export function useDualInputMode(options: {
  buildYaml: () => unknown
  applyYaml: (yamlText: string) => boolean
}) {
  const { t } = useI18n()

  const inputMode = ref<'form' | 'yaml'>('form')
  const yamlText = ref('')

  const inputModeOptions = computed<SegmentOption[]>(() => [
    { value: 'form', label: t('formMode') },
    { value: 'yaml', label: t('dualModeYaml') },
  ])

  // YAML 模式下的保存可用性只看文本非空（合法性留到 commitYaml 再报）
  const yamlHasContent = computed(() => !!yamlText.value.trim())

  const resetInputMode = () => {
    inputMode.value = 'form'
    yamlText.value = ''
  }

  const commitYaml = (): boolean => {
    if (!options.applyYaml(yamlText.value)) {
      showNotification({ content: 'routingInvalidYaml', type: 'alert-error' })
      return false
    }
    return true
  }

  const switchInputMode = (mode: 'form' | 'yaml') => {
    if (mode === 'yaml') {
      yamlText.value = stringifyYaml(options.buildYaml(), { indent: 2 })
    } else if (!commitYaml()) {
      return
    }
    inputMode.value = mode
  }

  return {
    inputMode,
    yamlText,
    inputModeOptions,
    yamlHasContent,
    resetInputMode,
    commitYaml,
    switchInputMode,
  }
}
