// 组装层 · 内核日志等级。面板唯一事实：偏好存后端 KV，内核在跑时顺手 PATCH /configs
// 让它立刻生效，composeConfigYaml 再把它带进 active.yaml —— 少了后半截，重启一次内核
// 等级就悄悄退回 mihomo 默认的 info，而屏幕上还显示着 debug。
import { can, Core, core } from '@/assembly/backend'
import { LOG_LEVEL } from '@/constant'
import { notifyRequestError } from '@/helper/requestError'
import { useStorage } from '@/helper/storage'
import { computed, watch } from 'vue'
import { updateConfigs } from './clash'

export const kernelLogLevel = useStorage<LOG_LEVEL>('config/log-level', LOG_LEVEL.Info)

// 各内核认的 log-level 取值不同（mihomo 无 trace，honk 无 silent）：PATCH 传错会被
// 400，写进 active.yaml 更会让内核启动即解析失败，所以逐档按能力表拼。
export const supportedLogLevels = computed<LOG_LEVEL[]>(() => {
  const levels = [LOG_LEVEL.Debug, LOG_LEVEL.Info, LOG_LEVEL.Warning, LOG_LEVEL.Error]

  if (can('traceLogLevel')) levels.unshift(LOG_LEVEL.Trace)
  if (can('silentLogLevel')) levels.push(LOG_LEVEL.Silent)

  return levels
})

// 偏好是跨会话存的，换到不认该级别的内核上必须退档，否则下一趟应用配置直接起不来。
// 内核还没探测出结论（Core.Unknown）时不动它 —— 那时候的能力表还不是最终答案。
watch(supportedLogLevels, (levels) => {
  if (core.value === Core.Unknown) return
  if (levels.includes(kernelLogLevel.value)) return
  kernelLogLevel.value = LOG_LEVEL.Info
})

export const setKernelLogLevel = async (level: LOG_LEVEL) => {
  kernelLogLevel.value = level
  // 与分流中心的主入口同一处置：内核没连着（或不是能 PATCH 配置的内核）时这一趟
  // 只改偏好，改动等「应用配置」那一趟带进内核。
  if (!can('configPatch')) return
  try {
    await updateConfigs({ 'log-level': level })
  } catch (error) {
    notifyRequestError(error)
  }
}
