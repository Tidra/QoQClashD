import { useStorage } from '@/helper/storage'

export type RoutingRuleDraft = {
  id: string
  type: string
  payload: string
  target: string
  noResolve?: boolean
  enabled: boolean
  /** 内置默认规则：不可删除、类型锁定、始终排在末尾 */
  builtin?: boolean
}

export type SubRuleDraft = {
  name: string
  /** 每条形如 "TYPE,payload,target" 的规则；子规则以 MATCH 收尾 */
  rules: string[]
}

export type TunSettings = {
  enable: boolean
  stack: string
  device?: string
  mtu?: number
  'auto-route'?: boolean
  'auto-detect-interface'?: boolean
  'strict-route'?: boolean
  'dns-hijack'?: string[]
}

/** 主入口：对应 config.yaml 顶层端口属性 + allow-lan + tun 块（仅此处可配置 TUN） */
export type MainEntryDraft = {
  port?: number
  'socks-port'?: number
  'mixed-port'?: number
  'redir-port'?: number
  'tproxy-port'?: number
  'allow-lan'?: boolean
  tun: TunSettings
}

/** 子入口：对应 config.yaml listeners 列表项 */
export type InboundDraft = {
  id: string
  name: string
  type: string
  port?: number
  listen?: string
  udp?: boolean
  /** 引用子规则名称作为入站匹配规则，留空使用全局 rules */
  rule?: string
  /** 固定出站节点/策略组，留空走规则匹配 */
  proxy?: string
  'routing-mark'?: number
}

/** 规则集合：对应 config.yaml rule-providers，供 RULE-SET 引用 */
export type RuleProviderDraft = {
  name: string
  /** http / file / inline */
  type: string
  /** yaml / text / mrs */
  format: string
  /** domain / ipcidr / classical */
  behavior?: string
  /** type=http 必填 */
  url?: string
  path?: string
  /** 网络更新间隔，单位秒 */
  interval?: number
  /** 下载/更新所用的节点或策略组 */
  proxy?: string
  /** 0 表示不限制 */
  'size-limit'?: number
  /** 仅 inline：规则字符串列表 */
  payload?: string[]
}

export const DEFAULT_RULE_ID = 'rule-default'

export const RULE_TARGET_ACTIONS = ['DIRECT', 'REJECT', 'REJECT-DROP', 'PASS'] as const

/** 子规则行尾可用策略（对齐 wiki sub-rule 页：可跳出列表走 PROXY/ALL 等） */
export const SUB_RULE_TARGET_ACTIONS = [
  'PROXY',
  'DIRECT',
  'REJECT',
  'REJECT-DROP',
  'PASS',
  'ALL',
] as const

/** 规则类型清单（对齐 wiki.metacubex.one/config/rules 路由规则页） */
export const RULE_TYPE_GROUPS: { group: string; types: string[] }[] = [
  {
    group: '域名',
    types: [
      'DOMAIN',
      'DOMAIN-SUFFIX',
      'DOMAIN-KEYWORD',
      'DOMAIN-WILDCARD',
      'DOMAIN-REGEX',
      'GEOSITE',
    ],
  },
  {
    group: 'IP',
    types: [
      'IP-CIDR',
      'IP-CIDR6',
      'IP-SUFFIX',
      'IP-ASN',
      'GEOIP',
      'SRC-GEOIP',
      'SRC-IP-ASN',
      'SRC-IP-CIDR',
      'SRC-IP-SUFFIX',
    ],
  },
  { group: '端口与网络', types: ['DST-PORT', 'SRC-PORT', 'NETWORK', 'DSCP', 'UID'] },
  { group: '入站', types: ['IN-PORT', 'IN-TYPE', 'IN-USER', 'IN-NAME'] },
  {
    group: '进程',
    types: [
      'PROCESS-NAME',
      'PROCESS-NAME-WILDCARD',
      'PROCESS-NAME-REGEX',
      'PROCESS-PATH',
      'PROCESS-PATH-WILDCARD',
      'PROCESS-PATH-REGEX',
    ],
  },
  { group: '规则与逻辑', types: ['RULE-SET', 'SUB-RULE', 'AND', 'OR', 'NOT', 'REMATCH-NAME'] },
  { group: '兜底', types: ['MATCH'] },
]

export const ALL_RULE_TYPES = RULE_TYPE_GROUPS.flatMap((item) => item.types)

/** no-resolve 仅对目标 IP 类规则有意义 */
export const supportsNoResolve = (type: string) =>
  /^(IP-CIDR|IP-CIDR6|IP-SUFFIX|IP-ASN|GEOIP|SRC-IP-CIDR|SRC-IP-SUFFIX|SRC-IP-ASN)/.test(type)

export const ruleToString = (rule: RoutingRuleDraft) => {
  const base =
    rule.type === 'MATCH'
      ? `MATCH,${rule.target}`
      : [rule.type, rule.payload, rule.target].join(',')
  return rule.noResolve ? `${base},no-resolve` : base
}

export const parseRuleString = (
  line: string,
): Omit<RoutingRuleDraft, 'id' | 'enabled' | 'builtin'> | null => {
  const parts = line
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part.length)
  if (parts.length < 2) return null
  const type = parts[0].toUpperCase()
  if (type === 'MATCH' || type === 'FINAL') {
    return { type: 'MATCH', payload: '', target: parts[1], noResolve: false }
  }
  if (parts.length < 3) return null
  let noResolve = false
  const target = parts[2]
  if (parts[3] === 'no-resolve') noResolve = true
  if (!ALL_RULE_TYPES.includes(type)) return null
  return { type, payload: parts[1], target, noResolve }
}

export const INBOUND_TYPES = ['mixed', 'http', 'socks', 'redirect', 'tproxy'] as const
export const TUN_STACKS = ['system', 'gvisor', 'mixed', 'mips'] as const
export const RULE_PROVIDER_TYPES = ['http', 'file', 'inline'] as const
export const RULE_PROVIDER_FORMATS = ['yaml', 'text', 'mrs'] as const
export const RULE_PROVIDER_BEHAVIORS = ['domain', 'ipcidr', 'classical'] as const

export const defaultTunSettings = (): TunSettings => ({
  enable: false,
  stack: 'gvisor',
  device: 'Mihomo',
  mtu: 9000,
  'auto-route': true,
  'auto-detect-interface': true,
  'strict-route': false,
  'dns-hijack': ['any:53'],
})

export const defaultMainEntry = (): MainEntryDraft => ({
  'mixed-port': 7890,
  'allow-lan': false,
  tun: defaultTunSettings(),
})

// ── 存储 ─────────────────────────────────────────────────────────

export const routingRules = useStorage<RoutingRuleDraft[]>('config/routing-rules', [])
export const subRules = useStorage<SubRuleDraft[]>('config/routing-sub-rules', [])
export const routingInbounds = useStorage<InboundDraft[]>('config/routing-inbounds', [])
export const routingRuleProviders = useStorage<RuleProviderDraft[]>(
  'config/routing-rule-providers',
  [],
)
export const routingMainEntry = useStorage<MainEntryDraft>(
  'config/routing-main-entry',
  defaultMainEntry(),
)

/** 规则按优先级从上到下；内置默认规则始终垫底 */
const sortBuiltinLast = (rules: RoutingRuleDraft[]) => [
  ...rules.filter((rule) => !rule.builtin),
  ...rules.filter((rule) => rule.builtin),
]

/** 整表替换主规则（规则列表编辑器保存用）；内置默认规则仍然垫底 */
export const setRoutingRules = (rules: RoutingRuleDraft[]) => {
  routingRules.value = sortBuiltinLast(rules)
}

export const upsertSubRule = (sub: SubRuleDraft, originalName?: string) => {
  const index = subRules.value.findIndex((item) => item.name === (originalName ?? sub.name))
  const next = [...subRules.value]
  if (index === -1) next.push(sub)
  else next[index] = sub
  subRules.value = next
}

export const removeSubRule = (name: string) => {
  subRules.value = subRules.value.filter((item) => item.name !== name)
}

/** 子规则改名后，同步主规则 SUB-RULE 与 listeners 的 rule 引用 */
export const renameSubRuleReferences = (oldName: string, newName: string) => {
  if (oldName === newName) return
  routingRules.value = routingRules.value.map((rule) =>
    rule.type === 'SUB-RULE' && rule.payload === oldName ? { ...rule, payload: newName } : rule,
  )
  routingInbounds.value = routingInbounds.value.map((inbound) =>
    inbound.rule === oldName ? { ...inbound, rule: newName } : inbound,
  )
}

export const subRuleReferenceCount = (name: string) =>
  routingRules.value.filter((rule) => rule.type === 'SUB-RULE' && rule.payload === name).length +
  routingInbounds.value.filter((inbound) => inbound.rule === name).length

export const upsertRoutingInbound = (inbound: InboundDraft, originalId?: string) => {
  const index = routingInbounds.value.findIndex((item) => item.id === (originalId ?? inbound.id))
  const next = [...routingInbounds.value]
  if (index === -1) next.push(inbound)
  else next[index] = inbound
  routingInbounds.value = next
}

export const removeRoutingInbound = (id: string) => {
  routingInbounds.value = routingInbounds.value.filter((item) => item.id !== id)
}

export const upsertRoutingMainEntry = (entry: MainEntryDraft) => {
  routingMainEntry.value = entry
}

export const upsertRuleProvider = (provider: RuleProviderDraft, originalName?: string) => {
  const index = routingRuleProviders.value.findIndex(
    (item) => item.name === (originalName ?? provider.name),
  )
  const next = [...routingRuleProviders.value]
  if (index === -1) next.push(provider)
  else next[index] = provider
  routingRuleProviders.value = next
}

export const removeRuleProvider = (name: string) => {
  routingRuleProviders.value = routingRuleProviders.value.filter((item) => item.name !== name)
}

const ruleLineReferences = (line: string, name: string) => {
  const parsed = parseRuleString(line)
  return parsed?.type === 'RULE-SET' && parsed.payload === name
}

/** 规则集合改名后，同步主规则与子规则中 RULE-SET 的引用 */
export const renameRuleProviderReferences = (oldName: string, newName: string) => {
  if (oldName === newName) return
  routingRules.value = routingRules.value.map((rule) =>
    rule.type === 'RULE-SET' && rule.payload === oldName ? { ...rule, payload: newName } : rule,
  )
  subRules.value = subRules.value.map((sub) => ({
    ...sub,
    rules: sub.rules.map((line) =>
      ruleLineReferences(line, oldName)
        ? line
            .split(',')
            .map((part) => (part.trim() === oldName ? newName : part))
            .join(',')
        : line,
    ),
  }))
}

export const ruleProviderReferenceCount = (name: string) =>
  routingRules.value.filter((rule) => rule.type === 'RULE-SET' && rule.payload === name).length +
  subRules.value.reduce(
    (total, sub) => total + sub.rules.filter((line) => ruleLineReferences(line, name)).length,
    0,
  )

// ── 默认种子（追加式、幂等） ──────────────────────────────────────

export const seedRoutingDefaults = () => {
  // v8 曾把主入口建模为内置 listener；顶层属性 store 出现后把它迁移掉
  type LegacyInbound = InboundDraft & { builtin?: boolean }
  if (routingInbounds.value.some((item) => (item as LegacyInbound).builtin)) {
    routingInbounds.value = routingInbounds.value.filter((item) => !(item as LegacyInbound).builtin)
  }

  if (!routingMainEntry.value?.tun) {
    routingMainEntry.value = defaultMainEntry()
  } else if (routingMainEntry.value['allow-lan'] === undefined) {
    // 旧草稿没有 allow-lan 字段：按 mihomo 默认 false 回填
    routingMainEntry.value = { ...routingMainEntry.value, 'allow-lan': false }
  }

  if (!routingRules.value.some((item) => item.id === DEFAULT_RULE_ID)) {
    routingRules.value = [
      ...routingRules.value,
      {
        id: DEFAULT_RULE_ID,
        type: 'MATCH',
        payload: '',
        target: '全部节点',
        enabled: true,
        builtin: true,
      },
    ]
  }
}
