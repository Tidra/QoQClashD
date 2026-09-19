// 内置内核后端自动注册：内核 running 后把它的 controller 地址登记为面板唯一后端，
// 用户无需再手动配置；只在水合完成后发现"没有任何后端"时才写入，不覆盖手动配置。
// startKernelAndReconnect 是「启动内核并接上」的单一实现：连接失败弹窗与设置页
// 运行控制都要走同一条路 —— 启动 → 等 running → 补登后端 → 重建会话。
import { startBackendSession } from '@/assembly/session'
import { useControlApi } from '@/composables/useControlApi'
import { whenStorageReady } from '@/helper/storage'
import { i18n } from '@/i18n'
import { addBackend, backendList } from '@/store/setup'

const splitHostPort = (address: string) => {
  const raw = address.startsWith('http') ? new URL(address).host : address
  const WILDCARD = new Set(['0.0.0.0', '::', '[::]'])
  const separator = raw.lastIndexOf(':')
  const host = raw.slice(0, separator)
  const port = raw.slice(separator + 1) || '9090'
  return { host: WILDCARD.has(host) ? '127.0.0.1' : host, port }
}

let syncing: Promise<void> | undefined

export const syncKernelBackend = (): Promise<void> => {
  syncing ??= (async () => {
    try {
      const state = await useControlApi().getKernelStatus()
      await whenStorageReady()
      const { host, port } = splitHostPort(state.externalController)
      if (backendList.value.length > 0) {
        // 早期版本登记的后端没有 managedKernel 标记;地址对得上就地补一个,
        // 让连接失败弹窗知道该引导「启动内核」而不是「修改后端配置」。
        // 内核停着时也要补 —— 弹窗恰恰出现在这个时刻。
        // 就地改字段(useStorage 深监听会落盘),不整个替换条目 —— 免得白白重建会话。
        const match = backendList.value.find((b) => b.host === host && b.port === port)
        if (match && !match.managedKernel) match.managedKernel = true
        return
      }
      if (state.status !== 'running') return
      addBackend({
        type: 'clash',
        protocol: window.location.protocol === 'https:' ? 'https' : 'http',
        host,
        port,
        secondaryPath: '',
        password: state.secret ?? '',
        label: i18n.global.t('builtinKernel'),
        managedKernel: true,
      })
    } catch {
      // 控制 API 不可用时静默：内核管理卡片自己会呈现状态
    }
  })().finally(() => {
    syncing = undefined
  })
  return syncing
}

const KERNEL_WAIT_TIMEOUT = 15000

/** 轮询 agent 的内核状态直到 running;超时返回 false。 */
export const waitKernelRunning = async (timeoutMs = KERNEL_WAIT_TIMEOUT) => {
  const controlApi = useControlApi()
  const deadline = Date.now() + timeoutMs
  for (;;) {
    try {
      const state = await controlApi.getKernelStatus()
      if (state.status === 'running') return true
    } catch {
      // 重启空档里 agent 可能短暂不可达,继续等到超时
    }
    if (Date.now() >= deadline) return false
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
}

/** 启动内核 → 等 running → 补登后端 → 重建会话;没在超时内起来返回 false 交给调用方提示。 */
export const startKernelAndReconnect = async () => {
  await useControlApi().startKernel()
  if (!(await waitKernelRunning())) return false
  await syncKernelBackend()
  startBackendSession()
  return true
}
