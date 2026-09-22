// 组装层 · logs 门面。持有完整的 logs ref 与流控状态(暂停 / 来源区分),
// 只接一条流：面板后端转发的内核进程 stdout/stderr(SSE)。
// store 直接引用这里导出的 logs / initLogs,不再参与组装。
import type { LogWithSeq } from '@/types'
import { ref, shallowRef } from 'vue'
import { createLogsAccumulator } from './accumulator'
import * as service from './service'

export const logs = shallowRef<LogWithSeq[]>([])
export const isPaused = ref(false)

// 这一条流里其实有两种行：内核自己打的运行日志(以前那条 Clash WS 给的就是这些),
// 和进程的其余原始输出 —— Go 的 panic 栈、启动前的裸 stderr。WS 是它的子集,所以不
// 再单独走一条通道,只把区分留在日志页的过滤里。
export const LOG_ORIGINS = ['kernel', 'process'] as const
export type LogOrigin = (typeof LOG_ORIGINS)[number]

// 「全部」下拉复用一个值域:来源那两项带前缀,免得与等级/类型同名撞车。
export const originFilterValue = (origin: LogOrigin) => `origin:${origin}`

// 过滤下拉的选中项与一条日志是否匹配:来源比字段,等级/类型沿用原文匹配。
export const matchesLogFilter = (log: LogWithSeq, filter: string) => {
  if (!filter) return true
  if (filter.startsWith('origin:')) return originFilterValue(log.origin) === filter

  return log.payload.includes(filter) || log.type === filter
}

let cancel: (() => void) | undefined

// 一次页面加载只开一条：这条流跟着面板后端而不是内核会话,内核启动/停掉都不重开它 ——
// 起来那几行与挂掉那几行正是同一屏要对着看的东西,重开只会把 seq 打回 1。
export const initLogs = () => {
  if (cancel) return

  const accumulator = createLogsAccumulator(logs, () => isPaused.value)
  const subscription = service.subscribeServiceLogs(accumulator.push)
  cancel = () => {
    accumulator.dispose()
    subscription.close()
    cancel = undefined
  }
}
