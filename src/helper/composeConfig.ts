// 把面板各 store 里的草稿（入口/节点/代理组/规则/子规则/规则集合/TUN）组合成
// mihomo config.yaml，不依赖内核运行，用于「查看当前 YAML 配置」。
import type { CustomNode } from '@/store/nodePool'
import { buildMergedNodeList } from '@/store/nodePool'
import { ALL_NODES_GROUP_NAME, proxyGroups, resolveGroupMembers } from '@/store/proxyGroups'
import type { InboundDraft, RuleProviderDraft, TunSettings } from '@/store/routing'
import {
  routingInbounds,
  routingMainEntry,
  routingRuleProviders,
  routingRules,
  ruleToString,
  subRules,
} from '@/store/routing'
import type { ProxyGroupDraft } from '@/types'
import { stringify } from 'yaml'

const nodeToProxy = (node: CustomNode): Record<string, unknown> => {
  const proxy: Record<string, unknown> = {
    name: node.name,
    type: node.type,
    server: node.server,
    port: node.port,
    udp: true,
  }
  if (node.cipher) proxy.cipher = node.cipher
  if (node.password) {
    // 面板表单里 password 是通用密钥字段：vmess/vless 对应 uuid。
    proxy[node.type === 'vmess' || node.type === 'vless' ? 'uuid' : 'password'] = node.password
  }
  if (node.tfo) proxy.tfo = true
  if (node.fingerprint) proxy['client-fingerprint'] = node.fingerprint
  if (node.sni || node.skipCertVerification || node.alpn?.length) {
    proxy.tls = {
      enabled: true,
      ...(node.sni ? { servername: node.sni } : {}),
      ...(node.skipCertVerification ? { 'skip-cert-verify': true } : {}),
      ...(node.alpn?.length ? { alpn: node.alpn } : {}),
    }
  }
  if (node.wsPath) {
    proxy.network = 'ws'
    proxy['ws-opts'] = {
      path: node.wsPath,
      ...(node.wsHeaders ? { headers: node.wsHeaders } : {}),
    }
  } else if (node.grpcServiceName) {
    proxy.network = 'grpc'
    proxy['grpc-opts'] = { 'grpc-service-name': node.grpcServiceName }
  }
  return proxy
}

const normalizeGroupType = (type: string) => {
  const value = type.toLowerCase()
  if (value === 'selector' || value === 'select') return 'select'
  if (value === 'urltest' || value === 'url-test') return 'url-test'
  if (value === 'loadbalance' || value === 'load-balance') return 'load-balance'
  if (value === 'fallback') return 'fallback'
  return value
}

const groupToEntry = (group: ProxyGroupDraft, nodeNames: string[]): Record<string, unknown> => {
  const entry: Record<string, unknown> = {
    name: group.name,
    type: normalizeGroupType(group.type),
    proxies: resolveGroupMembers(group, nodeNames),
  }
  const optional = [
    'url',
    'interval',
    'timeout',
    'tolerance',
    'strategy',
    'icon',
    'hidden',
    'lazy',
    'default-selected',
  ] as const
  for (const key of optional) {
    const value = group[key]
    if (value !== undefined) entry[key] = value
  }
  if (group.filter) entry.filter = group.filter
  if (group['exclude-filter']) entry['exclude-filter'] = group['exclude-filter']
  return entry
}

const tunToEntry = (tun: TunSettings): Record<string, unknown> => {
  const entry: Record<string, unknown> = { enable: tun.enable, stack: tun.stack }
  const optional = [
    'device',
    'mtu',
    'auto-route',
    'auto-detect-interface',
    'strict-route',
    'dns-hijack',
  ] as const
  for (const key of optional) {
    const value = tun[key as keyof TunSettings]
    if (value !== undefined) entry[key] = value
  }
  return entry
}

const providerToEntry = (provider: RuleProviderDraft): Record<string, unknown> => {
  const entry: Record<string, unknown> = { type: provider.type, format: provider.format }
  if (provider.behavior) entry.behavior = provider.behavior
  if (provider.type === 'inline') {
    entry.payload = provider.payload ?? []
  } else {
    if (provider.url) entry.url = provider.url
    if (provider.path) entry.path = provider.path
  }
  if (provider.interval !== undefined) entry.interval = provider.interval
  if (provider.proxy) entry.proxy = provider.proxy
  if (provider['size-limit'] !== undefined) entry['size-limit'] = provider['size-limit']
  return entry
}

const inboundToEntry = (inbound: InboundDraft): Record<string, unknown> => {
  const entry: Record<string, unknown> = { name: inbound.name, type: inbound.type }
  if (inbound.port !== undefined) entry.port = inbound.port
  if (inbound.listen) entry.listen = inbound.listen
  if (inbound.udp !== undefined) entry.udp = inbound.udp
  if (inbound.rule) entry.rule = inbound.rule
  if (inbound.proxy) entry.proxy = inbound.proxy
  if (inbound['routing-mark'] !== undefined) entry['routing-mark'] = inbound['routing-mark']
  return entry
}

export const composeConfigYaml = (): string => {
  const nodes = buildMergedNodeList()
  const nodeNames = nodes.map((node) => node.name)

  const main = routingMainEntry.value
  const config: Record<string, unknown> = {}
  for (const key of ['port', 'socks-port', 'mixed-port', 'redir-port', 'tproxy-port'] as const) {
    const value = main[key]
    if (value) config[key] = value
  }
  if (main['allow-lan']) config['allow-lan'] = true
  if (main.tun) config.tun = tunToEntry(main.tun)

  if (nodes.length) config.proxies = nodes.map(nodeToProxy)

  const groups = proxyGroups.value
  if (groups.length) config['proxy-groups'] = groups.map((group) => groupToEntry(group, nodeNames))

  const rules = routingRules.value.filter((rule) => rule.enabled).map(ruleToString)
  if (!rules.some((line) => line.startsWith('MATCH'))) {
    rules.push(`MATCH,${ALL_NODES_GROUP_NAME}`)
  }
  config.rules = rules

  if (subRules.value.length) {
    config['sub-rules'] = Object.fromEntries(
      subRules.value.map((sub) => [sub.name, [...sub.rules]]),
    )
  }

  if (routingRuleProviders.value.length) {
    config['rule-providers'] = Object.fromEntries(
      routingRuleProviders.value.map((provider) => [provider.name, providerToEntry(provider)]),
    )
  }

  if (routingInbounds.value.length) {
    config.listeners = routingInbounds.value.map(inboundToEntry)
  }

  return stringify(config, { indent: 2, lineWidth: 0 })
}
