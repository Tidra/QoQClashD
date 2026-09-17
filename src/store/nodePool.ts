import { useStorage } from '@/helper/storage'
import { v4 as uuid } from 'uuid'
import { computed, watch } from 'vue'

export interface CustomNode {
  id: string
  name: string
  type: string
  server: string
  port: number
  cipher?: string
  password?: string
  sni?: string
  fingerprint?: string
  skipCertVerification?: boolean
  alpn?: string[]
  wsPath?: string
  wsHeaders?: Record<string, string[]>
  grpcServiceName?: string
  tfo?: boolean
}

export interface NodePool {
  id: string
  name: string
  enabled: boolean
  dedupe: boolean
  nodes: CustomNode[]
}

const storedNodePools = useStorage<NodePool[]>('nodePools', [])
export const nodePools = storedNodePools

export const nodePoolList = computed(() => nodePools.value.filter((pool) => pool.enabled))

export function addNodePool(pool: Omit<NodePool, 'id'>): NodePool {
  const created = { ...pool, id: uuid() }
  nodePools.value.push(created)
  return created
}

export function updateNodePool(id: string, patch: Partial<Omit<NodePool, 'id'>>) {
  const pool = nodePools.value.find((p) => p.id === id)
  if (!pool) return
  Object.assign(pool, patch)
}

export function removeNodePool(id: string) {
  nodePools.value = nodePools.value.filter((pool) => pool.id !== id)
}

export function toggleNodePool(id: string) {
  const pool = nodePools.value.find((p) => p.id === id)
  if (pool) pool.enabled = !pool.enabled
}

export function addNode(poolId: string, node: Omit<CustomNode, 'id'>) {
  const pool = nodePools.value.find((p) => p.id === poolId)
  if (!pool) return
  pool.nodes.push({ ...node, id: uuid() })
}

export function updateNode(poolId: string, nodeId: string, patch: Partial<CustomNode>) {
  const pool = nodePools.value.find((p) => p.id === poolId)
  if (!pool) return
  const node = pool.nodes.find((n) => n.id === nodeId)
  if (node) Object.assign(node, patch)
}

export function removeNode(poolId: string, nodeId: string) {
  const pool = nodePools.value.find((p) => p.id === poolId)
  if (!pool) return
  pool.nodes = pool.nodes.filter((node) => node.id !== nodeId)
}

export function removeNodes(poolId: string, nodeIds: string[]) {
  const pool = nodePools.value.find((p) => p.id === poolId)
  if (!pool) return
  pool.nodes = pool.nodes.filter((node) => !nodeIds.includes(node.id))
}

export function buildMergedNodeList(): CustomNode[] {
  const merged: CustomNode[] = []
  const seen = new Set<string>()

  for (const pool of nodePoolList.value) {
    for (const node of pool.nodes) {
      const key = pool.dedupe
        ? `${node.type}|${node.name}|${node.server}|${node.port}`
        : `${pool.id}|${node.id}`
      if (seen.has(key)) continue
      seen.add(key)
      merged.push(node)
    }
  }

  return merged
}

export function buildNodePoolGroup(pool: NodePool) {
  return {
    name: pool.name,
    type: 'selector',
    nodes: pool.nodes.map((node) => node.name),
  }
}

export function nodePoolsAsGroupNames() {
  return nodePoolList.value.map((pool) => pool.name)
}

export function findNodeByName(name: string) {
  for (const pool of nodePoolList.value) {
    const node = pool.nodes.find((n) => n.name === name)
    if (node) return node
  }
  return null
}

export function totalNodeCount() {
  return nodePoolList.value.reduce((sum, pool) => sum + pool.nodes.length, 0)
}

// 深度 watch，任何节点的增删改都会写回 localStorage/SQLite
watch(
  nodePools,
  () => {
    storedNodePools.value = JSON.parse(JSON.stringify(nodePools.value))
  },
  { deep: true },
)
