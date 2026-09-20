// 组装层 · 内核品牌判别与能力表。
//
// 只有一条判别轴,且**仅限 assembly 层内部使用**
//(components / views / composables 由 eslint no-restricted-imports 禁止导入):
//
//   core —— 运行时内核品牌。靠 /version 字符串嗅探得来,是启发式猜测,
//           可能误判(分支核 / 兼容核),且拉取完成前为 'unknown'。
//
// 连接通道只剩同源代理的 Clash REST/WS 一条,其上实际在用的 API 形态有两种:
//   A. core=mihomo  mihomo 的 Clash API
//   B. core=honk    honk 的 Clash 兼容 API(端点子集)
//
// 能力表只剩由 core 决定的这一张,一律通过 can() 读取。因探测是启发式,允许用户用
// displayAllFeatures 强制掰开(提示文案承诺:fork 版内核可能支持官方版没有的功能)。
//
// 两种形态都提供的端点不进表:can() 会恒真,徒增一层查表。直接调即可。
//
// 注意:能凭响应数据自证的差异(如 rules 开关端点由 rule.uuid 决定、smart 由
// proxy.type 决定)不进此表,就近放在对应的 assembly 子模块里 —— 数据比版本
// 字符串可靠,不该被降级成全局猜测。

import { displayAllFeatures } from '@/store/settings'
import { computed, ref } from 'vue'

export enum Core {
  Mihomo = 'mihomo',
  Honk = 'honk',
  Unknown = 'unknown',
}

// core 由 assembly/version.ts 在探测 /version 后写入,
// 每次重开会话前先重置为未知,避免沿用上一次探测的结论。
export const core = ref<Core>(Core.Unknown)

export const resetCore = () => {
  core.value = Core.Unknown
}

// displayAllFeatures 的适用范围:跑着非 mihomo 内核(honk)时。
// 该开关的语义是「我用的 fork 版内核也支持这些 mihomo 扩展端点,先显示出来」。
// core 未探测出结论(Unknown)时不掰,免得凭空点亮一堆按钮。
const isNonMihomoCore = computed(() => core.value === Core.Honk)

const isForkCoreOverride = computed(() => isNonMihomoCore.value && displayAllFeatures.value)

// 开关自身的可见性与其生效范围保持一致。
export const showDisplayAllFeatures = isNonMihomoCore

const soft = computed(() => {
  const mihomo = core.value === Core.Mihomo
  const honk = core.value === Core.Honk
  const mihomoOrForkCore = mihomo || isForkCoreOverride.value

  return {
    // ---------- mihomo 内核侧 ----------
    coreUpgrade: mihomoOrForkCore,
    coreRestart: mihomoOrForkCore,
    reloadConfigs: mihomoOrForkCore,
    updateConfigs: mihomoOrForkCore,
    updateGeoDatabase: mihomoOrForkCore,
    independentLatency: mihomoOrForkCore,
    coreUpdateCheck: mihomo,
    // ports / tun / allow-lan 等 PATCH /configs 配置块。
    configPatch: mihomo,

    // ---------- 日志级别集合 ----------
    // /logs?level= 传了内核不认的级别会被 400 掉,WS 随后陷入无限重连,
    // 所以按内核各自支持的取值逐档点亮,拼装见 assembly/logs。
    // trace:honk 有,mihomo 没有
    traceLogLevel: honk,
    // silent:mihomo 有,honk 没有
    silentLogLevel: mihomo,

    // ---------- honk 内核侧 ----------
    // GET /stats:honk 独有的用户态运行时快照。方向与上面那批相反,
    // 故不接 displayAllFeatures —— 那个开关说的是「我的 fork 也支持 mihomo 扩展」。
    runtimeStats: honk,
  }
})

export type Cap = keyof typeof soft.value

// 探测没出结论(Core.Unknown)前能力表整行都是 false:按钮不能凭一个还没确定的品牌
// 就摆出来,所以门控挪到这里,行为与原先「没有后端就全 false」一致。
export const can = (cap: Cap): boolean => soft.value[cap]
