<template>
  <div :class="wrapperClass">
    <!--
      展开时 CommonCtrl 里已经有一个整行的切换器了,这里不再重复;
      折叠成一列图标时它是唯一能看到后端状态、能切换后端的入口。
    -->
    <BackendSwitch
      v-if="vertical"
      compact
    />
    <button
      v-if="panelPassword"
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
import BackendSwitch from '@/components/settings/backend/BackendSwitch.vue'
import { useI18n } from 'vue-i18n'
import router from '@/router'
import { isSidebarCollapsed } from '@/store/settings'
import { ArrowLeftCircleIcon, ArrowRightCircleIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/vue/24/outline'
import { computed } from 'vue'
import { logoutPanel, panelPassword } from '@/helper/panelAuth'

const props = defineProps<{
  vertical?: boolean
}>()

const { t } = useI18n()

const wrapperClass = computed(() => {
  return props.vertical
    ? 'flex flex-col items-center justify-center gap-2'
    : 'flex flex-row-reverse items-center justify-center gap-2'
})

const handleLogout = () => {
  logoutPanel()
  router.push({ name: 'setup' })
}
</script>
