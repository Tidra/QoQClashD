<template>
  <CtrlsBar solid>
    <div class="flex min-h-12 items-center gap-2 p-2">
      <SegmentedControl
        v-model="nodeNavigation"
        :options="navigation"
        class="shrink-0"
      />
      <div class="flex min-w-0 flex-1 items-center gap-2">
        <slot name="search" />
      </div>
      <div class="ml-auto flex shrink-0 items-center gap-2">
        <slot />
      </div>
    </div>
  </CtrlsBar>
</template>

<script setup lang="ts">
import { nodeNavigation } from '@/store/nodeNavigation'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import SegmentedControl from '@/components/common/SegmentedControl.vue'
import CtrlsBar from '@/components/common/CtrlsBar.vue'

const { t } = useI18n()
const navigation = computed(() => [
  { value: 'nodes' as const, label: t('proxies') },
  { value: 'groups' as const, label: t('proxyGroup') },
  { value: 'subscriptions' as const, label: t('subscriptions') },
])
</script>
