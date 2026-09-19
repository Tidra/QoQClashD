import { proxyLatencyTest } from '@/assembly/proxies'
import { computed, ref } from 'vue'

type LatencyMap = Record<string, number | null>

// 模块级单例：节点/代理组两个视图各挂一份 NodePoolPage，
// 共享同一张延迟表才能让节点测速结果直接出现在代理组成员里。
const latencyMap = ref<LatencyMap>({})
// 按节点跟踪测速中的名字，允许多个节点并发测试互不阻塞
const testingNodes = ref<Set<string>>(new Set())

export function useLatency() {
  const isTesting = computed(() => testingNodes.value.size > 0)

  const isNodeTesting = (nodeKey: string) => testingNodes.value.has(nodeKey)

  // url/timeout 留给 assembly 默认（speedtestUrl 设置项）；手动 /delay 不写
  // 内核 history，直接以返回值落表。同一节点重复点击时忽略。
  async function testNodeLatency(nodeKey: string): Promise<number | null> {
    if (isNodeTesting(nodeKey)) return latencyMap.value[nodeKey] ?? null
    testingNodes.value.add(nodeKey)
    try {
      const delay = await proxyLatencyTest(nodeKey)
      latencyMap.value[nodeKey] = delay && delay > 0 ? delay : null
    } catch {
      latencyMap.value[nodeKey] = null
    } finally {
      testingNodes.value.delete(nodeKey)
    }
    return latencyMap.value[nodeKey] ?? null
  }

  return {
    latencyMap,
    isTesting,
    isNodeTesting,
    testNodeLatency,
  }
}
