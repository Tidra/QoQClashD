import { fetchProxyLatencyAPI, fetchProxyGroupLatencyAPI } from '@/api/clash'
import { activeBackend } from '@/store/setup'
import { proxyMap } from '@/assembly/proxies'
import { computed, ref } from 'vue'

type LatencyMap = Record<string, number | null>

export function useLatency() {
  const latencyMap = ref<LatencyMap>({})
  const latencyTimestamps = ref<Record<string, number>>({})
  const isTesting = ref(false)

  const sortedNodes = computed(() => {
    return [...proxyMap.value.entries()]
      .filter(([key]) => key !== 'Global')
      .sort((a, b) => {
        const latA = latencyMap.value[a[0]] ?? Infinity
        const latB = latencyMap.value[b[0]] ?? Infinity
        if (latA === Infinity && latB === Infinity) return a[1].name.localeCompare(b[1].name)
        return latA - latB
      })
      .map(([key, node]) => ({
        key,
        node,
        latency: latencyMap.value[key] ?? null,
      }))
  })

  async function testNodeLatency(nodeKey: string, timeoutMs = 5000): Promise<number | null> {
    if (!activeBackend.value) return null

    try {
      const { data } = await fetchProxyLatencyAPI(nodeKey, 'https://www.google.com/generate_204', timeoutMs)
      const latency = data?.delay ?? null
      latencyMap.value[nodeKey] = latency
      latencyTimestamps.value[nodeKey] = Date.now()
      return latency
    } catch {
      latencyMap.value[nodeKey] = null
      latencyTimestamps.value[nodeKey] = Date.now()
      return null
    }
  }

  async function testAllNodeLatency() {
    isTesting.value = true
    const nodes = [...proxyMap.value.entries()].filter(([key]) => key !== 'Global')
    const batchSize = 8
    for (let i = 0; i < nodes.length; i += batchSize) {
      const batch = nodes.slice(i, i + batchSize)
      await Promise.all(batch.map(([key]) => testNodeLatency(key)))
    }
    isTesting.value = false
  }

  async function testGroup(groupName: string) {
    const group = proxyMap.value.get(groupName)
    if (!group || !Array.isArray(group.nodes) || !group.nodes.length) return

    isTesting.value = true
    try {
      const { data } = await fetchProxyGroupLatencyAPI(groupName, 'https://www.google.com/generate_204', 5000)
      for (const [name, delay] of Object.entries(data)) {
        latencyMap.value[name] = typeof delay === 'number' ? delay : null
        latencyTimestamps.value[name] = Date.now()
      }
    } catch {
      // keep current values on failure
    } finally {
      isTesting.value = false
    }
  }

  return {
    latencyMap,
    latencyTimestamps,
    isTesting,
    sortedNodes,
    testNodeLatency,
    testAllNodeLatency,
    testGroup,
  }
}
