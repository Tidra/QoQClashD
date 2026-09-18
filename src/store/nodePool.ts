import { useStorage } from '@/helper/storage'
import { v4 as uuid } from 'uuid'
import { computed } from 'vue'
import { removeProxyGroupMembers, renameProxyGroupMember } from '@/store/proxyGroups'

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
  /** 由订阅自动导入维护的池会记录来源订阅 id */
  subscriptionId?: string
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
  const pool = nodePools.value.find((p) => p.id === id)
  if (!pool) return
  removeProxyGroupMembers(pool.nodes.map((node) => node.name))
  nodePools.value = nodePools.value.filter((p) => p.id !== id)
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
  if (!node) return
  const previousName = node.name
  Object.assign(node, patch)
  if (patch.name && patch.name !== previousName) {
    renameProxyGroupMember(previousName, patch.name)
  }
}

export function removeNode(poolId: string, nodeId: string) {
  const pool = nodePools.value.find((p) => p.id === poolId)
  if (!pool) return
  const removed = pool.nodes.find((node) => node.id === nodeId)
  pool.nodes = pool.nodes.filter((node) => node.id !== nodeId)
  if (removed) removeProxyGroupMembers([removed.name])
}

export function removeNodes(poolId: string, nodeIds: string[]) {
  const pool = nodePools.value.find((p) => p.id === poolId)
  if (!pool) return
  const removedNames = pool.nodes
    .filter((node) => nodeIds.includes(node.id))
    .map((node) => node.name)
  pool.nodes = pool.nodes.filter((node) => !nodeIds.includes(node.id))
  removeProxyGroupMembers(removedNames)
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
