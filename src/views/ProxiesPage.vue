<template>
  <div
    class="relative size-full overflow-hidden"
    :class="[disableProxiesPageTextSelect ? 'select-none' : '']"
  >
    <!-- 节点列：节点 子页保持挂载，非 nodes 时隐藏；z-0 位于 groups/subscriptions overlay 之下 -->
    <div
      v-show="nodeNavigation === 'nodes'"
      class="absolute inset-0 z-0 h-full overflow-hidden"
    >
      <NodePoolPage view="nodes" />
      <ProxyGroupChainModal />
    </div>

    <!-- 代理组：保持挂载，切换仅显隐，避免重建闪烁；z-20 位于 nodes 列之上。
         窄屏顶距由 NodePoolPage 自己留，这里再留一份就是两层空白。 -->
    <div
      v-show="nodeNavigation === 'groups'"
      class="absolute inset-0 z-20 h-full overflow-hidden"
    >
      <NodePoolPage view="groups" />
    </div>

    <!-- 订阅：保持挂载，切换仅显隐，避免重建闪烁；z-20 位于 nodes 列之上 -->
    <div
      v-show="nodeNavigation === 'subscriptions'"
      class="absolute inset-0 z-20 h-full overflow-hidden"
    >
      <SubscriptionsPage />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProxyGroupChainModal from '@/components/proxies/ProxyGroupChainModal.vue'
import NodePoolPage from '@/views/NodePoolPage.vue'
import SubscriptionsPage from '@/views/SubscriptionsPage.vue'
import { fetchProxies } from '@/assembly/proxies'
import { disableProxiesPageTextSelect } from '@/store/settings'
import { onMounted } from 'vue'
import { nodeNavigation } from '@/store/nodeNavigation'

onMounted(() => {
  setTimeout(() => {
    fetchProxies()
  })
})
</script>
