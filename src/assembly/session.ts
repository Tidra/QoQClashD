// 组装层 · 内核会话。
//
// 一次会话 = 面板对着内置内核建立起来的整套运行时状态:版本探测 + 首屏数据 +
// 三条常驻流(connections / logs / traffic)。启动 / 重启内核、用户手动重连,
// 本质都是「结束旧会话、开一条新的」,所以共用 startKernelSession ——
// 重连不需要额外的响应式开关,再调一次就是了。

import { PROXY_TAB_TYPE, RULE_TAB_TYPE } from '@/constant'
import { initConnections, stopConnections } from '@/store/connections'
import { initSatistic, stopSatistic } from '@/store/overview'
import { fetchConfigs } from './config'
import { initLogs, stopLogs } from './logs'
import { fetchProxies, proxiesTabShow } from './proxies'
import { fetchRules, rulesTabShow } from './rules'
import { probeKernel, resetKernelProbe } from './version'

export const startKernelSession = () => {
  // 探测不 await:数据流不必等它,而 core 要等 /version 回来才有结论。
  probeKernel()
  // 三条常驻流连同各自的数据先丢掉,不能留到下面重建时再清 ——
  // 旧内核的日志与统计会安静地冒充新内核的数据。
  stopConnections()
  stopLogs()
  stopSatistic()

  rulesTabShow.value = RULE_TAB_TYPE.RULES
  proxiesTabShow.value = PROXY_TAB_TYPE.PROXIES
  fetchConfigs()
  fetchProxies()
  fetchRules()
  initConnections()
  initLogs()
  initSatistic()
}

/**
 * 内核停掉时结束会话:三条流对着死端口只会无限重连,能力表和版本展示也要退回
 * 「还没探测」的空态,而不是继续显示上一轮内核的结论。
 */
export const stopKernelSession = () => {
  stopConnections()
  stopLogs()
  stopSatistic()
  resetKernelProbe()
}
