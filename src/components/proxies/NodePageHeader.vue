<template>
  <CtrlsBar solid>
    <!-- 窄屏放不下「分段 + 搜索 + 三个按钮」：搜索单独换一行，按钮仍留在首行，
         否则搜索框会被压到四五十像素、占位符整个看不见。 -->
    <div class="flex min-h-12 flex-wrap items-center gap-2 p-2">
      <SegmentedControl
        v-model="nodeNavigation"
        :options="navigation"
        class="shrink-0"
      />
      <div
        class="order-last flex min-w-0 basis-full items-center gap-2 md:order-none md:flex-1 md:basis-auto"
      >
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
