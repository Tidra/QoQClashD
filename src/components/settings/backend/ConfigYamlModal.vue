<template>
  <!-- DialogWrapper teleport 到 #app-content（本组件的挂载根），需等挂载完成再渲染。 -->
  <DialogWrapper
    v-if="isReady"
    v-model="value"
    :title="$t('currentConfigYaml')"
    box-class="w-[min(640px,90vw)] max-w-none"
  >
    <div class="flex flex-col gap-3">
      <div class="text-base-content/60 text-xs">
        {{ $t('currentConfigYamlHint') }}
      </div>
      <textarea
        class="textarea textarea-bordered h-[min(65vh,640px)] w-full resize-none font-mono text-xs"
        readonly
        :value="yamlText"
        spellcheck="false"
        :aria-label="$t('currentConfigYaml')"
      ></textarea>
      <div class="flex justify-end gap-2">
        <button
          class="btn btn-sm btn-outline"
          @click="copyYaml"
        >
          {{ $t('copy') }}
        </button>
        <button
          class="btn btn-sm btn-primary"
          @click="value = false"
        >
          {{ $t('close') }}
        </button>
      </div>
    </div>
  </DialogWrapper>
</template>

<script setup lang="ts">
import DialogWrapper from '@/components/common/DialogWrapper.vue'
import { composeConfigYaml } from '@/helper/composeConfig'
import { showNotification } from '@/helper/notification'
import { onMounted, ref, watch } from 'vue'

const value = defineModel<boolean>({ required: true })

const yamlText = ref('')
const isReady = ref(false)

onMounted(() => {
  isReady.value = true
})

watch(value, (open) => {
  if (!open) return
  try {
    yamlText.value = composeConfigYaml()
  } catch (error) {
    yamlText.value = ''
    showNotification({
      content: error instanceof Error ? error.message : String(error),
      type: 'alert-error',
    })
  }
})

const copyYaml = async () => {
  try {
    await navigator.clipboard.writeText(yamlText.value)
    showNotification({ content: 'copySuccess', type: 'alert-success' })
  } catch {
    showNotification({ content: 'copyFailed', type: 'alert-error' })
  }
}
</script>
