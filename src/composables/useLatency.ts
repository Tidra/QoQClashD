import { getLatencyByName, proxyLatencyTest } from '@/assembly/proxies'
import { ref } from 'vue'

type LatencyMap = Record<string, number | null>

export function useLatency() {
  const latencyMap = ref<LatencyMap>({})
  const isTesting = ref(false)

  async function testNodeLatency(nodeKey: string, timeoutMs = 5000): Promise<number | null> {
    isTesting.value = true
    try {
      await proxyLatencyTest(nodeKey, 'https://www.google.com/generate_204', timeoutMs)
      latencyMap.value[nodeKey] = getLatencyByName(nodeKey) || null
    } catch {
      latencyMap.value[nodeKey] = null
    } finally {
      isTesting.value = false
    }
    return latencyMap.value[nodeKey] ?? null
  }

  return {
    latencyMap,
    isTesting,
    testNodeLatency,
  }
}
