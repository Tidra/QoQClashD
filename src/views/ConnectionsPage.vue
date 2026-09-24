<template>
  <!-- 窄屏的头部是 fixed（脱离文档流），卡片模式把 ConnectionCtrl 放进虚拟列表的 before 槽，
       它就不占位了 —— 两种模式都得让位；宽屏那侧 padding 本身为空。 -->
  <div
    class="relative flex size-full flex-col overflow-hidden"
    :style="padding"
  >
    <template v-if="isConnectionCard">
      <ConnectionCardList />
    </template>
    <template v-else>
      <ConnectionCtrl />
      <ConnectionTable />
    </template>
    <ConnectionDetails />
  </div>
</template>

<script setup lang="ts">
import { setConnectionGeoIPEnabled } from '@/api/connectionGeoip'
import ConnectionCardList from '@/components/connections/ConnectionCardList.vue'
import ConnectionDetails from '@/components/connections/ConnectionDetails.vue'
import ConnectionTable from '@/components/connections/ConnectionTable.vue'
import ConnectionCtrl from '@/components/controls/ConnectionCtrl.tsx'
import { usePaddingForViews } from '@/composables/paddingViews'
import { CONNECTIONS_TABLE_ACCESSOR_KEY } from '@/constant'
import { connectionCardGroupKey } from '@/store/connections'
import { connectionCardLines, connectionTableColumns, isConnectionCard } from '@/store/settings'
import { computed, onScopeDispose, watch } from 'vue'

const { padding } = usePaddingForViews({
  offsetTop: 0,
  offsetBottom: 0,
})

const isGeoIPVisible = computed(() =>
  isConnectionCard.value
    ? connectionCardGroupKey.value === CONNECTIONS_TABLE_ACCESSOR_KEY.GeoIP ||
      connectionCardLines.value.some((line) => line.includes(CONNECTIONS_TABLE_ACCESSOR_KEY.GeoIP))
    : connectionTableColumns.value.includes(CONNECTIONS_TABLE_ACCESSOR_KEY.GeoIP),
)

watch(isGeoIPVisible, setConnectionGeoIPEnabled, { immediate: true })
onScopeDispose(() => setConnectionGeoIPEnabled(false))
</script>

<style>
.vjs-tree {
  font-family:
    NotoEmoji,
    Monaco,
    Menlo,
    Consolas,
    Bitstream Vera Sans Mono,
    monospace;
}
.vjs-tree-node.is-highlight,
.vjs-tree-node:hover {
  background-color: var(--color-base-200);
}
</style>
