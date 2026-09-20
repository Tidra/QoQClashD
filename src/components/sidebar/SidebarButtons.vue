<template>
  <div :class="wrapperClass">
    <!-- 侧栏常驻：草稿有改动但没下发给内核时红点闪烁，点一下直接组合 YAML 并重启内核，
         不用进设置页找「重载配置」。 -->
    <button
      v-if="authStatus?.authenticated"
      class="btn btn-circle btn-sm relative"
      :disabled="applyingConfig"
      :title="t('applyConfigSummary')"
      :aria-label="t('applyConfig')"
      @click="applyDraftConfig"
    >
      <span
        v-if="applyingConfig"
        class="loading loading-spinner h-4 w-4"
      ></span>
      <ArrowPathIcon
        v-else
        class="h-4 w-4"
      />
      <span
        v-if="pendingConfigChanges && !applyingConfig"
        class="bg-error absolute -top-1 -right-1 flex h-2 w-2 animate-ping rounded-full"
      ></span>
      <span
        v-if="pendingConfigChanges && !applyingConfig"
        class="bg-error absolute -top-1 -right-1 h-2 w-2 rounded-full"
      ></span>
    </button>
    <button
      v-if="authStatus?.authenticated"
      class="btn btn-circle btn-sm"
      :title="t('logout')"
      @click="handleLogout"
    >
      <ArrowRightStartOnRectangleIcon class="h-4 w-4" />
    </button>
    <button
      class="btn btn-circle btn-sm"
      @click="isSidebarCollapsed = !isSidebarCollapsed"
    >
      <component
        :is="isSidebarCollapsed ? ArrowRightCircleIcon : ArrowLeftCircleIcon"
        class="h-5 w-5"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import { applyDraftConfig, applyingConfig, pendingConfigChanges } from '@/helper/applyConfig'
import { authStatus, logoutPanel } from '@/helper/panelSession'
import { isSidebarCollapsed } from '@/store/settings'
import {
  ArrowLeftCircleIcon,
  ArrowPathIcon,
  ArrowRightCircleIcon,
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/vue/24/outline'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  vertical?: boolean
}>()

const { t } = useI18n()

const wrapperClass = computed(() => {
  return props.vertical
    ? 'flex flex-col items-center justify-center gap-2'
    : 'flex flex-row-reverse items-center justify-center gap-2'
})

const handleLogout = () => void logoutPanel()
</script>
