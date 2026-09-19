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
            <div class="badge badge-success badge-lg gap-2 text-xs font-medium">
              <span class="bg-success-content h-2 w-2 rounded-full"></span>
              {{ backendReady ? '运行正常' : '等待连接' }}
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
          <div class="border-base-300/70 bg-base-200/40 rounded-xl border p-3">
            <div class="text-base-content/50 text-[10px] tracking-[0.18em] uppercase">后端</div>
            <div class="text-base-content mt-2 text-sm font-medium">{{ backendLabel }}</div>
            <div class="text-base-content/55 mt-1 text-xs">{{ backendUrl }}</div>
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
              {{ backendReady ? '已连接并可查询' : '等待后端探测' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="!activeBackend && !version"
      class="px-3 pt-3 pb-0"
    >
      <div class="card border-warning/40 bg-warning/10 rounded-2xl border p-4 shadow-sm">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div class="text-warning text-sm font-semibold">未检测到可用核心</div>
            <div class="text-base-content/70 text-sm">
              核心将直接下载到配置的核心目录，下载完成后可在设置中启动。
            </div>
          </div>
          <button
            class="btn btn-primary btn-sm"
            :disabled="downloadingCore"
            @click="downloadCore"
          >
            <span
              v-if="downloadingCore"
              class="loading loading-spinner loading-xs"
            ></span>
            {{ downloadingCore ? '下载中…' : '下载内核' }}
          </button>
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
import { useControlApi } from '@/composables/useControlApi'
import { notifyRequestError } from '@/helper/requestError'
import { getLabelFromBackend, getUrlFromBackend } from '@/helper/utils'
import { activeConnections } from '@/store/connections'
import { overviewCardOrder } from '@/store/settings'
import { activeBackend } from '@/store/setup'
import type { Component } from 'vue'
import { Cog6ToothIcon } from '@heroicons/vue/24/outline'
import { computed, defineAsyncComponent, ref } from 'vue'

const { padding } = usePaddingForViews({
  offsetTop: 0,
  offsetBottom: 0,
})

const showCardSettingsDialog = ref(false)

const backendReady = computed(() => !!activeBackend.value && !!version.value)
const backendLabel = computed(() =>
  activeBackend.value ? getLabelFromBackend(activeBackend.value) : '未连接',
)
const backendUrl = computed(() =>
  activeBackend.value ? getUrlFromBackend(activeBackend.value) : '等待后端连接',
)
const coreName = computed(() =>
  version.value?.toLowerCase().includes('honk') ? 'Honk' : version.value ? 'Mihomo' : '检测中',
)
const coreVersionLabel = computed(() => version.value || '等待版本探测')
const proxyGroupCount = computed(() => proxyGroupList.value.length)
const ruleCount = computed(() => rules.value.length)
const activeConnectionCount = computed(() => activeConnections.value.length)
const formattedCount = (value: number) => value.toLocaleString()
const downloadingCore = ref(false)

const downloadCore = async () => {
  if (downloadingCore.value) return
  downloadingCore.value = true
  try {
    const result = await useControlApi().ensureKernel()
    if (!result.ok) throw new Error(result.error || '控制服务未能下载内核')
    window.location.reload()
  } catch (error) {
    notifyRequestError(error)
  } finally {
    downloadingCore.value = false
  }
}

const visibleCards = computed(() => {
  return overviewCardOrder.value.filter((card) => card.visible)
})

const cardComponents: Record<string, Component> = {
  ChartsCard,
  NetworkCard,
  ProviderTrafficOverview,
  TopologyCharts,
  EarthGlobeCard: defineAsyncComponent(() => import('@/components/overview/EarthGlobeCard.vue')),
  ConnectionHistory,
  RuleHitCountCard,
  HonkStatsCard,
}
</script>
