// 把面板各 store 里的草稿（入口/节点/代理组/规则/子规则/规则集合/TUN）组合成
// mihomo config.yaml，不依赖内核运行，用于「查看当前 YAML 配置」。
import { kernelLogLevel } from '@/assembly/config'
import { LOG_LEVEL } from '@/constant'
import type { CustomNode } from '@/store/nodePool'
import { buildMergedNodeList } from '@/store/nodePool'
import {
  ALL_NODES_GROUP_NAME,
  normalizeGroupType,
  proxyGroups,
  resolveGroupMembers,
} from '@/store/proxyGroups'
import type { DnsDraft, InboundDraft, RuleProviderDraft, TunSettings } from '@/store/routing'
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
  // mihomo 的 vmess 字段名是 alterId（非 alter-id），且与 uuid 同为必填
  if (node.type === 'vmess') proxy.alterId = String(node.alterId ?? 0)
  if (node.tfo) proxy.tfo = true
  if (node.fingerprint) proxy['client-fingerprint'] = node.fingerprint
  // mihomo 对 vmess/vless 的 tls 只接受布尔；servername/skip-cert-verify/alpn
  // 一律走代理顶层字段，各协议通用。
  const tlsTypes = new Set(['vmess', 'vless', 'trojan', 'grpc'])
  const tlsEnabled =
    node.tls || !!node.sni || node.skipCertVerification === true || !!node.alpn?.length
  if (tlsEnabled && tlsTypes.has(node.type)) proxy.tls = true
  if (node.sni) proxy.sni = node.sni
  if (node.skipCertVerification) proxy['skip-cert-verify'] = true
  if (node.alpn?.length) proxy.alpn = node.alpn
  if (node.wsPath) {
    proxy.network = 'ws'
    // mihomo 的 ws-opts.headers 只接受 string→string；订阅里同一头可能带多个值，取第一个
    const headers = node.wsHeaders
      ? Object.fromEntries(
          Object.entries(node.wsHeaders).map(([k, v]) => [
            k,
            Array.isArray(v) ? String(v[0] ?? '') : String(v),
          ]),
        )
      : undefined
    proxy['ws-opts'] = {
      path: node.wsPath,
      ...(headers && Object.keys(headers).length ? { headers } : {}),
    }
  } else if (node.grpcServiceName) {
    proxy.network = 'grpc'
    proxy['grpc-opts'] = { 'grpc-service-name': node.grpcServiceName }
  }
  return proxy
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

/** 主入口的 DNS 草稿 → config.yaml 的 dns 块：有这一项就是用户开了它，enable 恒真 */
const dnsToEntry = (dns: DnsDraft): Record<string, unknown> => {
  const entry: Record<string, unknown> = { enable: true }
  if (dns['enhanced-mode']) entry['enhanced-mode'] = dns['enhanced-mode']
  if (dns['fake-ip-range']) entry['fake-ip-range'] = dns['fake-ip-range']
  for (const key of ['default-nameserver', 'nameserver', 'fallback'] as const) {
    const value = dns[key]
    if (value?.length) entry[key] = value
  }
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
  // 主入口没配 DNS 就整块不写，内核按默认方式解析
  if (main.dns) config.dns = dnsToEntry(main.dns)
  // 日志等级来自面板偏好（见 assembly/config/logLevel）。info 就是 mihomo 自己的默认值，
  // 只有改过才写这一行 —— 否则所有人升级完都凭空多出一个「有改动待应用」的红点。
  if (kernelLogLevel.value !== LOG_LEVEL.Info) config['log-level'] = kernelLogLevel.value

  if (nodes.length) config.proxies = nodes.map(nodeToProxy)

  const groups = proxyGroups.value
  if (groups.length) config['proxy-groups'] = groups.map((group) => groupToEntry(group, nodeNames))

  const rules = routingRules.value
    .filter((rule) => rule.enabled)
    .map((rule) =>
      // mihomo 的具名子规则调度语法是 `SUB-RULE,(内联条件),组名`，组内每条规则自带出站；
      // 面板草稿把组名存进 payload、出站存进 target，这里改写为恒真条件并丢弃草稿 target。
      rule.type === 'SUB-RULE' ? `SUB-RULE,(SRC-PORT,0-65535),${rule.payload}` : ruleToString(rule),
    )
  // 规则表里的每一行都是用户的普通数据（删掉不会再冒出来），兜底的 MATCH 只在这里保证。
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
