<template>
  <button
    class="btn btn-sm"
    @click="dashboardSettingsDialogShow = true"
  >
    <Cog6ToothIcon
      v-if="iconOnly"
      class="h-4 w-4"
    />
    <template v-else>{{ $t('dashboardSettings') }}</template>
  </button>
  <DialogWrapper
    v-model="dashboardSettingsDialogShow"
    :title="$t('dashboardSettings')"
  >
    <div class="settings-section-label">
      {{ $t('dashboardSettingsJsonFile') }}
    </div>
    <div class="settings-grid">
      <div class="setting-item">
        <div class="setting-item-label">
          {{ $t('exportSettings') }}
        </div>
        <button
          class="btn btn-sm"
          @click="handlerClickExportSettings"
        >
          <ArrowDownCircleIcon class="h-4 w-4" />
        </button>
      </div>
      <div class="setting-item">
        <div class="setting-item-label">
          {{ $t('importFromFile') }}
        </div>
        <button
          class="btn btn-sm"
          @click="importSettingsFromFile"
        >
          <ArrowUpCircleIcon class="h-4 w-4" />
        </button>
      </div>
    </div>
    <input
      ref="inputRef"
      type="file"
      accept=".json"
      class="hidden"
      @change="handlerJsonUpload"
    />
  </DialogWrapper>
</template>

<script setup lang="ts">
import { applyImportedSettings } from '@/helper/importSettings'
import { showNotification } from '@/helper/notification'
import { notifyRequestError } from '@/helper/requestError'
import { exportSettings } from '@/helper/utils'
import { ArrowDownCircleIcon, ArrowUpCircleIcon, Cog6ToothIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import DialogWrapper from './DialogWrapper.vue'

withDefaults(
  defineProps<{
    /** 仅显示图标的触发按钮，用于左侧已有文字标签的设置行 */
    iconOnly?: boolean
  }>(),
  { iconOnly: false },
)

const inputRef = ref<HTMLInputElement>()
const dashboardSettingsDialogShow = ref(false)

const handlerClickExportSettings = async () => {
  try {
    await exportSettings()
  } catch (error) {
    notifyRequestError(error)
  }
}

const handlerJsonUpload = () => {
  const file = inputRef.value?.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = async () => {
    showNotification({
      content: 'importing',
    })
    try {
      const settings = JSON.parse(reader.result as string) as Record<string, unknown>
      dashboardSettingsDialogShow.value = false
      await applyImportedSettings(settings)
    } catch (error) {
      notifyRequestError(error)
    }
  }
  reader.readAsText(file)
}

const importSettingsFromFile = () => {
  inputRef.value?.click()
}
</script>
