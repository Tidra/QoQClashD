import { useStorage } from '@/helper/storage'
import { ALL_NODES_GROUP_NAME } from '@/store/proxyGroups'

export type RoutingRuleDraft = {
  id: string
  type: string
  payload: string
  target: string
  noResolve?: boolean
  enabled: boolean
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

/**
 * DNS：对应 config.yaml 的 dns 块。只存用户真正填了的字段，构建 YAML 时补 `enable: true`；
 * 主入口没有这一项就等于不配置 DNS（内核用默认解析）。
 */
export type DnsDraft = {
  /** redir-host / fake-ip，留空走内核默认 */
  'enhanced-mode'?: string
  /** 解析 nameserver 自身用的 DNS，一般填 IP 或 `system` */
  'default-nameserver'?: string[]
  nameserver?: string[]
  fallback?: string[]
  'fake-ip-range'?: string
}

/** 主入口：对应 config.yaml 顶层端口属性 + allow-lan + tun / dns 块（仅此处可配置 TUN） */
export type MainEntryDraft = {
  port?: number
  'socks-port'?: number
  'mixed-port'?: number
  'redir-port'?: number
  'tproxy-port'?: number
  'allow-lan'?: boolean
  tun: TunSettings
  /** 缺省即 YAML 里不写 dns 块，走内核默认的解析方式 */
  dns?: DnsDraft
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

export const parseRuleString = (line: string): Omit<RoutingRuleDraft, 'id' | 'enabled'> | null => {
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
export const DNS_ENHANCED_MODES = ['redir-host', 'fake-ip'] as const
export const RULE_PROVIDER_TYPES = ['http', 'file', 'inline'] as const
export const RULE_PROVIDER_FORMATS = ['yaml', 'text', 'mrs'] as const
export const RULE_PROVIDER_BEHAVIORS = ['domain', 'ipcidr', 'classical'] as const

/** 规则集合的默认缓存路径：`./ruleset/<名字>.<后缀>`，后缀即声明的解析格式 */
export const ruleProviderDefaultPath = (name: string, format: string) =>
  `./ruleset/${name.trim().replace(/[\\/:*?"<>|\s]/g, '_')}.${format === 'text' ? 'txt' : format}`

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

/**
 * 内置规则集合的格式纠正跑过没有（纠正那一步在 seedRoutingDefaults 里）。
 *
 * 早先版本把 reject/proxy/direct 三份按 `text` 声明，内核会把资产首行的 `payload:` 也当成一条
 * 规则；这里只把那三行的格式与缓存路径改回 yaml，跑一次就够，不增不减行、也不碰主规则表。
 */
const RULE_PROVIDER_FORMAT_FIX_GENERATION = 3
const routingDefaultsGeneration = useStorage<number>('config/routing-defaults-generation', 0)

/**
 * 整表替换主规则（规则列表编辑器保存用）。
 *
 * MATCH 是终止规则：内核命中它就不再往下看后面的行，所以它一律垫底，用户把它排到中间也不会
 * 让自己前面的规则凭空失效。
 */
export const setRoutingRules = (rules: RoutingRuleDraft[]) => {
  routingRules.value = [
    ...rules.filter((rule) => rule.type !== 'MATCH'),
    ...rules.filter((rule) => rule.type === 'MATCH'),
  ]
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

const LOYAL_SOLDIER = 'https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release'

/**
 * 内置默认规则集合：Loyalsoldier 的 reject/proxy/direct 三份域名集。
 *
 * 资产文件名以 `.txt` 结尾，内容却是 `payload:` 打头的 YAML 规则文档（`- '+.a.com'`
 * 一行一条），所以格式只能按 `yaml` 声明；按 text 读会把首行 `payload:` 也当成一条规则。
 */
export const DEFAULT_RULE_PROVIDERS: RuleProviderDraft[] = ['reject', 'proxy', 'direct'].map(
  (name) => ({
    name,
    type: 'http',
    format: 'yaml',
    behavior: 'domain',
    url: `${LOYAL_SOLDIER}/${name}.txt`,
    path: ruleProviderDefaultPath(name, 'yaml'),
    interval: 86400,
  }),
)

/**
 * 代次迁移比对用的字段：格式与缓存路径是内置默认值自己会纠正的两项，不参与签名；
 * 其余任一项对不上就算用户改过这份集合，整行不动。
 */
const PROVIDER_FIELDS_LOCKED = [
  'name',
  'type',
  'behavior',
  'url',
  'interval',
  'size-limit',
  'proxy',
] as const

const isUntouchedDefaultProvider = (item: RuleProviderDraft, def: RuleProviderDraft) =>
  PROVIDER_FIELDS_LOCKED.every((field) => item[field] === def[field])

/**
 * 冷启动默认主规则：广告拦截 → 局域网直连 → 域名代理 → 国内域名直连 → 国内 IP 直连
 * → 其余走「全部节点」。
 *
 * 局域网一段用 `GEOIP,LAN` 而不是逐条私网 IP-CIDR：LAN 是内核内建的私网判定，一行就够，
 * 也不用像 `RULE-SET,LAN` 那样先养一个同名规则集合（删掉集合会让这条规则指空、整份配置
 * 在内核侧失效）。
 */
const defaultRoutingRules = (): RoutingRuleDraft[] => [
  {
    id: 'rule-set-reject',
    type: 'RULE-SET',
    payload: 'reject',
    target: 'REJECT',
    enabled: true,
  },
  {
    id: 'rule-geoip-lan',
    type: 'GEOIP',
    payload: 'LAN',
    target: 'DIRECT',
    noResolve: true,
    enabled: true,
  },
  {
    id: 'rule-set-proxy',
    type: 'RULE-SET',
    payload: 'proxy',
    target: ALL_NODES_GROUP_NAME,
    enabled: true,
  },
  {
    id: 'rule-set-direct',
    type: 'RULE-SET',
    payload: 'direct',
    target: 'DIRECT',
    enabled: true,
  },
  {
    id: 'rule-geoip-cn',
    type: 'GEOIP',
    payload: 'CN',
    target: 'DIRECT',
    noResolve: true,
    enabled: true,
  },
  {
    id: 'rule-default',
    type: 'MATCH',
    payload: '',
    target: ALL_NODES_GROUP_NAME,
    enabled: true,
  },
]

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

  // 只在各自为空时注入默认内容（冷启动）：这些行落库后就是用户的普通数据，删掉不会在下次
  // 启动又冒出来。构建 YAML 那侧另有兜底，规则表没有 MATCH 也会补一条（composeConfig）。
  if (routingRules.value.length === 0) routingRules.value = defaultRoutingRules()
  if (routingRuleProviders.value.length === 0)
    routingRuleProviders.value = [...DEFAULT_RULE_PROVIDERS]

  if (routingDefaultsGeneration.value < RULE_PROVIDER_FORMAT_FIX_GENERATION) {
    // 追加式种子不会回头改已存在的行，所以老库里那三份 text 要单独纠正一次格式与缓存路径；
    // 除这两项以外任一字段对不上就算用户改过这份集合，整行不动。
    routingRuleProviders.value = routingRuleProviders.value.map((item) => {
      const def = DEFAULT_RULE_PROVIDERS.find((provider) => provider.name === item.name)
      if (!def || !isUntouchedDefaultProvider(item, def)) return item
      if (item.format === def.format && item.path === def.path) return item
      return { ...item, format: def.format, path: def.path }
    })
    routingDefaultsGeneration.value = RULE_PROVIDER_FORMAT_FIX_GENERATION
  }
}
