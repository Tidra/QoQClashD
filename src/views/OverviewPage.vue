<template>
  <div
    class="h-full overflow-x-hidden overflow-y-auto"
    :style="padding"
  >
    <div class="px-3 pt-3">
      <div
        class="card bg-base-100/80 border-base-300/70 rounded-2xl border p-4 shadow-sm backdrop-blur-sm"
      >
        <div class="flex items-center justify-between gap-3">
          <div>
            <div class="text-base-content/60 text-[10px] font-semibold tracking-[0.2em] uppercase">
              QoQClashD
            </div>
            <h2 class="text-base-content mt-1 text-xl font-semibold">Mihomo 控制面板</h2>
          </div>
          <div class="flex items-center gap-2">
            <div
              class="badge badge-lg gap-2 text-xs font-medium"
              :class="kernelReady ? 'badge-success' : 'badge-warning'"
            >
              <span
                class="h-2 w-2 rounded-full"
                :class="kernelReady ? 'bg-success-content' : 'bg-warning-content'"
              ></span>
              {{ kernelReady ? '运行正常' : '等待连接' }}
            </div>
            <button
              class="btn btn-circle btn-ghost btn-sm"
              :title="$t('overviewCardSettings')"
              @click="showCardSettingsDialog = true"
            >
              <Cog6ToothIcon class="h-4 w-4" />
            </button>
          </div>
        </div>

        <div class="mt-4 grid gap-2 sm:grid-cols-3">
          <div class="border-base-300/70 bg-base-200/40 min-w-0 rounded-xl border p-3">
            <div class="text-base-content/50 text-[10px] tracking-[0.18em] uppercase">后端</div>
            <div class="text-base-content mt-2 text-sm font-medium">{{ kernelLabel }}</div>
            <div class="text-base-content/55 mt-1 text-xs break-all">{{ kernelUrl }}</div>
          </div>
          <div class="border-base-300/70 bg-base-200/40 rounded-xl border p-3">
            <div class="text-base-content/50 text-[10px] tracking-[0.18em] uppercase">内核</div>
            <div class="text-base-content mt-2 flex items-center gap-2 text-sm font-medium">
              <img
                :src="coreBrand.logo"
                class="h-4 w-4 rounded-sm"
              />
              {{ coreName }}
            </div>
            <div class="text-base-content/55 mt-1 text-xs">{{ coreVersionLabel }}</div>
          </div>
          <div class="border-base-300/70 bg-base-200/40 rounded-xl border p-3">
            <div class="text-base-content/50 text-[10px] tracking-[0.18em] uppercase">状态</div>
            <div class="text-base-content mt-2 text-sm font-medium">
              {{ formattedCount(proxyGroupCount) }} 组 / {{ formattedCount(ruleCount) }} 条 /
              {{ formattedCount(activeConnectionCount) }} 连
            </div>
            <div class="text-base-content/55 mt-1 text-xs">
              {{ kernelReady ? '已连接并可查询' : '等待内核探测' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <OverviewCardSettingsDialog v-model="showCardSettingsDialog" />
    <div class="flex flex-col gap-3 p-3">
      <component
        v-for="item in visibleCards"
        :key="item"
        :is="cardComponents[item.card]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { proxyGroupList } from '@/assembly/proxies'
import { rules } from '@/assembly/rules'
import { coreBrand, version } from '@/assembly/version'
import OverviewCardSettingsDialog from '@/components/overview/OverviewCardSettingsDialog.vue'
import ChartsCard from '@/components/overview/ChartsCard.vue'
import ConnectionHistory from '@/components/overview/ConnectionHistory.vue'
import HonkStatsCard from '@/components/overview/HonkStatsCard.vue'
import NetworkCard from '@/components/overview/NetworkCard.vue'
import ProviderTrafficOverview from '@/components/overview/ProviderTrafficOverview.vue'
import RuleHitCountCard from '@/components/overview/RuleHitCountCard.vue'
import TopologyCharts from '@/components/overview/TopologyCharts.vue'
import { usePaddingForViews } from '@/composables/paddingViews'
import { activeConnections } from '@/store/connections'
import { overviewCardOrder } from '@/store/settings'
import type { Component } from 'vue'
import { Cog6ToothIcon } from '@heroicons/vue/24/outline'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { padding } = usePaddingForViews({
  offsetTop: 0,
  offsetBottom: 0,
})

const showCardSettingsDialog = ref(false)

// 面板只对着 agent 托管的内核工作，地址就是同源代理那一条。
const kernelReady = computed(() => !!version.value)
const kernelLabel = computed(() => t('builtinKernel'))
const kernelUrl = `${window.location.origin}/api/mihomo`
const coreName = computed(() =>
  version.value?.toLowerCase().includes('honk') ? 'Honk' : version.value ? 'Mihomo' : '检测中',
)
const coreVersionLabel = computed(() => version.value || '等待版本探测')
const proxyGroupCount = computed(() => proxyGroupList.value.length)
const ruleCount = computed(() => rules.value.length)
const activeConnectionCount = computed(() => activeConnections.value.length)
const formattedCount = (value: number) => value.toLocaleString()

const visibleCards = computed(() => {
  return overviewCardOrder.value.filter((card) => card.visible)
})

const cardComponents: Record<string, Component> = {
  ChartsCard,
  NetworkCard,
  ProviderTrafficOverview,
  TopologyCharts,
  ConnectionHistory,
  RuleHitCountCard,
  HonkStatsCard,
}
</script>
