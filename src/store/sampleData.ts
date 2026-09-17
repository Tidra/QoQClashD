import { addNode, addNodePool, nodePools } from '@/store/nodePool'
import { subscriptionList } from '@/store/subscriptions'

/**
 * 注入示例数据（节点池 + 节点 + 订阅），用于展示各 tab 的显示效果。
 * 仅在本地没有数据时调用，避免覆盖真实配置。
 * 由 useStorage 的 watch 自动持久化到服务器，刷新后保留。
 */
export function seedSampleData() {
  if (nodePools.value.length) return
  if (subscriptionList.value.length) return

  const pool1 = addNodePool({ name: '示例节点池', enabled: true, dedupe: true, nodes: [] })
  addNode(pool1.id, {
    name: 'JP-Tokyo-01',
    type: 'vmess',
    server: 'jp-tokyo-01.example.com',
    port: 443,
    cipher: 'auto',
    sni: 'tokyo.example.com',
    fingerprint: 'chrome',
    wsPath: '/ws',
  })
  addNode(pool1.id, {
    name: 'SG-Singapore-02',
    type: 'vless',
    server: '192.0.2.11',
    port: 443,
    cipher: 'auto',
    sni: 'sg.example.com',
    alpn: ['h2', 'http/1.1'],
  })

  const pool2 = addNodePool({ name: '代理组·备用', enabled: true, dedupe: false, nodes: [] })
  addNode(pool2.id, {
    name: 'HK-HongKong-SS',
    type: 'ss',
    server: 'hk.example.net',
    port: 8388,
    cipher: 'chacha20-poly1305',
    password: 'sample-secret',
  })
  addNode(pool2.id, {
    name: 'US-West-H2',
    type: 'hysteria2',
    server: 'us.example.net',
    port: 444,
    sni: 'us.example.net',
    tfo: true,
  })

  subscriptionList.value = [
    {
      id: 'subscription-sample-1',
      name: '示例订阅-A',
      url: 'https://clash.example.com/subscription/a.yaml',
      enabled: true,
      autoUpdate: true,
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'subscription-sample-2',
      name: '示例订阅-B',
      url: 'https://clash.example.com/subscription/b.yaml',
      enabled: false,
      autoUpdate: false,
    },
  ]
}

// 模块加载时立即调用；若本地数据为空会注入样例。
// 刷新后 useStorage 从服务器拉取（若 seed 已持久化则保留）。
seedSampleData()
