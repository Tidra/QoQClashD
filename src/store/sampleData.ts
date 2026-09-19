import { useStorage, whenStorageReady } from '@/helper/storage'
import type { CustomNode } from '@/store/nodePool'
import { addNode, addNodePool, buildMergedNodeList, nodePools } from '@/store/nodePool'
import {
  proxyGroups,
  pruneProxyGroupMembers,
  syncAllNodesGroup,
  upsertProxyGroup,
} from '@/store/proxyGroups'
import type {
  InboundDraft,
  RoutingRuleDraft,
  RuleProviderDraft,
  SubRuleDraft,
} from '@/store/routing'
import {
  routingInbounds,
  routingRuleProviders,
  routingRules,
  ruleToString,
  seedRoutingDefaults,
  subRules,
  upsertRoutingInbound,
  upsertRuleProvider,
  upsertSubRule,
} from '@/store/routing'
import { subscriptionList } from '@/store/subscriptions'
import { watch } from 'vue'

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

const SAMPLE_DATA_VERSION_V2 = 5
const SAMPLE_DATA_VERSION = 7
const ROUTING_SAMPLE_DATA_VERSION = 8
const ROUTING_SAMPLE_DATA_VERSION_V2 = 9
const sampleDataVersion = useStorage<number>('config/sample-data-version', 0)

/**
 * v2 追加式样例：补充更多节点、四种类型的代理组和带自动更新的订阅。
 * 只追加、不删除已有数据；按名称/URL 去重，可安全重放。
 */
export function seedSampleDataV2() {
  if (sampleDataVersion.value >= SAMPLE_DATA_VERSION_V2) return

  let pool = nodePools.value.find((item) => item.name === '示例节点池·v2')
  if (!pool) pool = addNodePool({ name: '示例节点池·v2', enabled: true, dedupe: true, nodes: [] })
  const v2Nodes: Omit<CustomNode, 'id'>[] = [
    {
      name: 'JP-Tokyo-02',
      type: 'vless',
      server: 'jp2.example.com',
      port: 8443,
      sni: 'jp2.example.com',
      fingerprint: 'chrome',
      wsPath: '/vless',
    },
    {
      name: 'HK-CT-HY2',
      type: 'hysteria2',
      server: 'hk-ct.example.com',
      port: 443,
      sni: 'hk-ct.example.com',
      tfo: true,
    },
    {
      name: 'US-LA-03',
      type: 'trojan',
      server: 'la.example.com',
      port: 443,
      password: 'trojan-pass',
      sni: 'la.example.com',
    },
    {
      name: 'TW-Hinet-01',
      type: 'ss',
      server: 'tw.example.com',
      port: 8389,
      cipher: 'aes-256-gcm',
      password: 'ss-pass',
    },
    {
      name: 'KR-Seoul-01',
      type: 'vmess',
      server: 'kr.example.com',
      port: 443,
      cipher: 'auto',
      sni: 'kr.example.com',
      wsPath: '/ws',
    },
    {
      name: 'SG-Frieren-03',
      type: 'vless',
      server: 'sg3.example.com',
      port: 2053,
      sni: 'sg3.example.com',
      alpn: ['h2', 'http/1.1'],
    },
  ]
  for (const node of v2Nodes) {
    if (pool.nodes.some((item) => item.name === node.name)) continue
    addNode(pool.id, node)
  }

  const existingGroupNames = new Set(proxyGroups.value.map((group) => group.name))
  const sampleGroups = [
    {
      name: '手动选择',
      type: 'select',
      proxies: ['JP-Tokyo-02', 'HK-CT-HY2', 'US-LA-03', 'TW-Hinet-01'],
      'default-selected': 'HK-CT-HY2',
      icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Proxy.png',
    },
    {
      name: '自动最优',
      type: 'url-test',
      proxies: ['JP-Tokyo-02', 'SG-Frieren-03', 'KR-Seoul-01'],
      url: 'https://www.gstatic.com/generate_204',
      interval: 300,
      timeout: 5000,
      tolerance: 50,
      lazy: true,
    },
    {
      name: '故障转移',
      type: 'fallback',
      proxies: ['US-LA-03', '手动选择'],
      url: 'https://www.gstatic.com/generate_204',
      interval: 180,
      timeout: 5000,
    },
    {
      name: '负载均衡',
      type: 'load-balance',
      proxies: ['TW-Hinet-01', 'KR-Seoul-01', '自动最优'],
      url: 'https://www.gstatic.com/generate_204',
      interval: 600,
      timeout: 5000,
      minCount: 2,
    },
  ]
  for (const group of sampleGroups) {
    if (existingGroupNames.has(group.name)) continue
    upsertProxyGroup(group)
  }

  const existingUrls = new Set(subscriptionList.value.map((item) => item.url))
  const now = new Date().toISOString()
  const sampleSubscriptions = [
    {
      id: 'subscription-sample-3',
      name: '示例订阅-C·每小时',
      url: 'https://clash.example.com/subscription/c.yaml',
      enabled: true,
      autoUpdate: true,
      updateInterval: 60,
      updatedAt: now,
    },
    {
      id: 'subscription-sample-4',
      name: '示例订阅-D·每日',
      url: 'https://clash.example.com/subscription/d.yaml',
      enabled: true,
      autoUpdate: true,
      updateInterval: 1440,
      updatedAt: now,
    },
  ]
  for (const item of sampleSubscriptions) {
    if (existingUrls.has(item.url)) continue
    subscriptionList.value = [...subscriptionList.value, item]
  }

  sampleDataVersion.value = SAMPLE_DATA_VERSION_V2
}

/**
 * v3 追加式样例：批量测试节点（多协议、超长名称）+ 带筛选条件的选择组，
 * 用于验证成员折叠、表格省略、筛选展开等显示效果。
 */
export function seedSampleDataV3() {
  if (sampleDataVersion.value >= SAMPLE_DATA_VERSION) return

  let pool = nodePools.value.find((item) => item.name === '示例节点池·批量')
  if (!pool) pool = addNodePool({ name: '示例节点池·批量', enabled: true, dedupe: true, nodes: [] })

  const cities = [
    ['Tokyo', 'jp'],
    ['Osaka', 'jp'],
    ['HongKong', 'hk'],
    ['Singapore', 'sg'],
    ['Seoul', 'kr'],
    ['LosAngeles', 'us'],
    ['NewYork', 'us'],
    ['London', 'uk'],
    ['Frankfurt', 'de'],
    ['Sydney', 'au'],
    ['Toronto', 'ca'],
    ['Amsterdam', 'nl'],
  ] as const
  const types = ['vless', 'vmess', 'trojan', 'hysteria2', 'ss'] as const
  const batchNodes: Omit<CustomNode, 'id'>[] = []
  for (let i = 0; i < cities.length; i++) {
    const [city, cc] = cities[i]
    for (let n = 1; n <= 2; n++) {
      const type = types[(i + n) % types.length]
      batchNodes.push({
        name: `${city}-${String(n).padStart(2, '0')}`,
        type,
        server: `${cc}${n}.batch.example.com`,
        port: 443,
        sni: `${cc}${n}.batch.example.com`,
        ...(type === 'ss' ? { cipher: 'aes-256-gcm', password: 'batch-pass' } : {}),
        ...(type === 'trojan' ? { password: 'batch-pass' } : {}),
        ...(type === 'vmess' ? { cipher: 'auto' } : {}),
      })
    }
  }
  // 超长名称 + 中文 + 特殊字符，验证表格截断与筛选
  batchNodes.push(
    {
      name: '🚀 东京- IPLC 内网中转 | 0.1倍率 | 剩余30天 | 支持4K解锁',
      type: 'vless',
      server: 'tokyo-iplc.example.com',
      port: 2053,
      sni: 'tokyo-iplc.example.com',
    },
    {
      name: '备用线路·东京-移动专线-低延迟-晚高峰优选节点-A',
      type: 'hysteria2',
      server: 'tokyo-mobile.example.com',
      port: 443,
      sni: 'tokyo-mobile.example.com',
    },
    {
      name: 'Hong Kong - BGP 双程优化 - 家庭宽带 - 非常非常非常长的节点名称示例 02',
      type: 'vmess',
      server: 'hk-bgp.example.com',
      port: 443,
      cipher: 'auto',
      sni: 'hk-bgp.example.com',
    },
  )
  for (const node of batchNodes) {
    if (pool.nodes.some((item) => item.name === node.name)) continue
    addNode(pool.id, node)
  }

  const existingGroupNames = new Set(proxyGroups.value.map((group) => group.name))
  if (!existingGroupNames.has('东京·筛选')) {
    upsertProxyGroup({
      name: '东京·筛选',
      type: 'select',
      proxies: ['JP-Tokyo-02'],
      filter: '(?i)tokyo|东京',
      'exclude-filter': '备用',
    })
  }
  if (!existingGroupNames.has('欧美·高速')) {
    upsertProxyGroup({
      name: '欧美·高速',
      type: 'url-test',
      proxies: ['London-01', 'Frankfurt-01', 'NewYork-02'],
      filter: '(?i)london|frankfurt|newyork|amsterdam',
      url: 'https://www.gstatic.com/generate_204',
      interval: 300,
      timeout: 5000,
      tolerance: 50,
    })
  }

  sampleDataVersion.value = SAMPLE_DATA_VERSION
}

/**
 * 分流中心追加式样例：示例规则/子规则/入口 + 必需的默认规则与主入口。
 * 只追加不删除；按 payload/名称/ID 去重，可安全重放。
 */
export function seedRoutingData() {
  seedRoutingDefaults()
  if (sampleDataVersion.value >= ROUTING_SAMPLE_DATA_VERSION) return

  const existingSubNames = new Set(subRules.value.map((item) => item.name))
  const sampleSubRules: SubRuleDraft[] = [
    {
      name: '局域网直连',
      rules: [
        'IP-CIDR,192.168.0.0/16,DIRECT,no-resolve',
        'IP-CIDR,10.0.0.0/8,DIRECT,no-resolve',
        'IP-CIDR,172.16.0.0/12,DIRECT,no-resolve',
        'MATCH,DIRECT',
      ],
    },
    {
      name: '广告拦截',
      rules: ['GEOSITE,category-ads-all,REJECT', 'DOMAIN-KEYWORD,adservice,REJECT', 'MATCH,PASS'],
    },
  ]
  for (const sub of sampleSubRules) {
    if (existingSubNames.has(sub.name)) continue
    upsertSubRule(sub)
  }

  const existingRuleKeys = new Set(routingRules.value.map((rule) => ruleToString(rule)))
  const sampleRules: Omit<RoutingRuleDraft, 'id'>[] = [
    { type: 'DOMAIN', payload: 'dns.alidns.com', target: 'DIRECT', enabled: true },
    { type: 'GEOSITE', payload: 'apple-cn', target: 'DIRECT', enabled: true },
    { type: 'PROCESS-NAME', payload: 'telegram.exe', target: '手动选择', enabled: true },
    { type: 'SUB-RULE', payload: '局域网直连', target: 'DIRECT', enabled: true },
    { type: 'SUB-RULE', payload: '广告拦截', target: 'REJECT', enabled: true },
    {
      type: 'SRC-IP-CIDR',
      payload: '192.168.1.201/32',
      target: '手动选择',
      noResolve: true,
      enabled: true,
    },
    { type: 'DST-PORT', payload: '443', target: '自动最优', enabled: true },
  ]
  // 默认规则保持垫底：示例规则插到内置规则之前
  const extra: RoutingRuleDraft[] = []
  for (const rule of sampleRules) {
    if (existingRuleKeys.has(ruleToString({ ...rule, id: '' }))) continue
    extra.push({ ...rule, id: `routing-${extra.length}-${Math.random().toString(36).slice(2, 8)}` })
  }
  if (extra.length) {
    const builtins = routingRules.value.filter((rule) => rule.builtin)
    routingRules.value = [
      ...routingRules.value.filter((rule) => !rule.builtin),
      ...extra,
      ...builtins,
    ]
  }

  const existingInboundIds = new Set(routingInbounds.value.map((item) => item.id))
  const sampleInbounds: InboundDraft[] = [
    {
      id: 'inbound-socks',
      name: 'SOCKS5 入口',
      type: 'socks',
      port: 7891,
      listen: '0.0.0.0',
      udp: true,
    },
    {
      id: 'inbound-tproxy',
      name: 'TProxy 透明入口',
      type: 'tproxy',
      port: 7895,
      listen: '0.0.0.0',
      udp: true,
      rule: '局域网直连',
    },
  ]
  for (const inbound of sampleInbounds) {
    if (existingInboundIds.has(inbound.id)) continue
    upsertRoutingInbound(inbound)
  }

  sampleDataVersion.value = ROUTING_SAMPLE_DATA_VERSION
}

/**
 * v9 追加式样例：规则集合（rule-providers）示例 + 引用它们的 RULE-SET 规则。
 * 只追加不删除；按名称/规则字符串去重，可安全重放。
 */
export function seedRoutingDataV2() {
  seedRoutingDefaults()
  if (sampleDataVersion.value >= ROUTING_SAMPLE_DATA_VERSION_V2) return

  const existingProviders = new Set(routingRuleProviders.value.map((item) => item.name))
  const sampleProviders: RuleProviderDraft[] = [
    {
      name: 'ads',
      type: 'http',
      format: 'text',
      behavior: 'domain',
      url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Advertising/Advertising.txt',
      interval: 86400,
      proxy: 'DIRECT',
    },
    {
      name: 'direct-cn',
      type: 'http',
      format: 'text',
      behavior: 'domain',
      url: 'https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/direct.txt',
      interval: 86400,
    },
    {
      name: 'local-inline',
      type: 'inline',
      format: 'text',
      behavior: 'domain',
      payload: ['DOMAIN-SUFFIX,lan.local', 'DOMAIN-KEYWORD,intranet'],
    },
  ]
  for (const provider of sampleProviders) {
    if (existingProviders.has(provider.name)) continue
    upsertRuleProvider(provider)
  }

  const existingRuleKeys = new Set(routingRules.value.map((rule) => ruleToString(rule)))
  const sampleRules: Omit<RoutingRuleDraft, 'id'>[] = [
    { type: 'RULE-SET', payload: 'ads', target: 'REJECT', enabled: true },
    { type: 'RULE-SET', payload: 'direct-cn', target: 'DIRECT', enabled: true },
  ]
  const extra: RoutingRuleDraft[] = []
  for (const rule of sampleRules) {
    if (existingRuleKeys.has(ruleToString({ ...rule, id: '' }))) continue
    extra.push({ ...rule, id: `routing-${extra.length}-${Math.random().toString(36).slice(2, 8)}` })
  }
  if (extra.length) {
    const builtins = routingRules.value.filter((rule) => rule.builtin)
    routingRules.value = [
      ...routingRules.value.filter((rule) => !rule.builtin),
      ...extra,
      ...builtins,
    ]
  }

  sampleDataVersion.value = ROUTING_SAMPLE_DATA_VERSION_V2
}

// 等存储完成首次服务器读取后再判断是否注入。
// 若在读取完成前同步执行，nodePools 还是默认空值，会误判"无数据"注入示例，
// 读取失败时示例数据还会被 watch 回写、覆盖数据库里的真实节点。
void whenStorageReady().then(() => {
  seedSampleData()
  seedSampleDataV2()
  seedSampleDataV3()
  seedRoutingData()
  seedRoutingDataV2()

  // 清理引用了不存在成员的旧代理组，再建立/同步内置"全部节点"组
  const nodeNames = () => buildMergedNodeList().map((node) => node.name)
  pruneProxyGroupMembers(new Set([...nodeNames(), ...proxyGroups.value.map((group) => group.name)]))
  syncAllNodesGroup(nodeNames())
  // 节点增删后自动同步"全部节点"组成员（sync 幂等，不会触发循环写入）
  watch([nodePools, proxyGroups], () => syncAllNodesGroup(nodeNames()), { deep: true })
})
