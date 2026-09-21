// 内核下载是分钟级的长请求，用户中途切去别的页面很常见。进度和「下载中」的按钮态
// 一旦挂在设置页组件上，卸载即丢：回来时进度条没了、下载按钮还能再点一次。
// 所以这份状态放模块级 —— 在途请求与轮询都跟着模块活，不跟着组件活。
import { startKernelSession } from '@/assembly/session'
import { useControlApi } from '@/composables/useControlApi'
import { showNotification } from '@/helper/notification'
import { notifyRequestError } from '@/helper/requestError'
import type { KernelDownloadProgress } from '@/types/control'
import { computed, ref } from 'vue'

const PROGRESS_POLL_MS = 400

const progress = ref<KernelDownloadProgress | null>(null)
// 取消请求是否已发出。POST /kernel/ensure 要等 agent 掐断流才返回，这中间按钮得显示
// 「取消中」并禁点，否则用户会连按，而第二次取消落在已经没有在途下载的时刻。
const cancelling = ref(false)
// 本模块持有那条 POST 时才为 true。整页刷新后拿不到，此时靠 agent 的快照兜底显示。
let owned = false
let pollTimer: ReturnType<typeof setInterval> | undefined

const isLive = (value: KernelDownloadProgress | null): value is KernelDownloadProgress =>
  !!value && (value.phase === 'downloading' || value.phase === 'starting')

export const kernelDownloadProgress = computed(() => progress.value)
export const kernelDownloading = computed(() => isLive(progress.value))
export const kernelDownloadCancelling = computed(() => cancelling.value)

const stopPolling = () => {
  if (pollTimer === undefined) return
  clearInterval(pollTimer)
  pollTimer = undefined
}

const startPolling = () => {
  if (pollTimer !== undefined) return
  pollTimer = setInterval(async () => {
    try {
      const next = await useControlApi().getKernelEnsureStatus()
      if (next.progress) progress.value = next.progress
      // 下载结束（done/failed）后 agent 会一直留着最后那份快照，不会漏读；
      // 拿到终态就收工，不必让 400ms 的轮询长期挂着。
      if (!isLive(next.progress)) {
        stopPolling()
        cancelling.value = false
        if (owned) return
        progress.value = null
      }
    } catch {
      // 轮询失败不动进度条：成败由 POST 的返回值兜底
    }
  }, PROGRESS_POLL_MS)
}

/** 设置页挂载时接上仍在途的下载；own 的 POST 结束后由它自己收尾。 */
export const resumeKernelDownload = async () => {
  if (pollTimer !== undefined) return
  try {
    const { progress: snapshot } = await useControlApi().getKernelEnsureStatus()
    if (!isLive(snapshot)) return
    progress.value = snapshot
    startPolling()
  } catch {
    // 问不到就当没有在途的下载
  }
}

/**
 * 取消在途下载。只负责发一次闸：那条 POST 还在路上，取消成功后它会带 cancelled
 * 回来，由 downloadKernel 收尾（提示 + 清进度）。所以这里不改 owned/progress。
 */
export const cancelKernelDownload = async () => {
  if (cancelling.value || !kernelDownloading.value) return
  cancelling.value = true
  try {
    const { ok } = await useControlApi().cancelKernelEnsure()
    if (ok) return
    // agent 手里没有在途下载 = 这一行是僵尸快照（那条 POST 随页面刷新丢了）。再问一次
    // 服务端真相：还在跑就继续显示，已经结束了就替没人执行的 finally 把这一行收掉。
    const { progress: snapshot } = await useControlApi().getKernelEnsureStatus()
    cancelling.value = false
    if (isLive(snapshot)) {
      progress.value = snapshot
      startPolling()
      return
    }
    stopPolling()
    owned = false
    progress.value = null
  } catch (error) {
    cancelling.value = false
    notifyRequestError(error)
  }
}

export const downloadKernel = async (options: {
  mirror: string
  version?: string
  force: boolean
}) => {
  if (owned) return
  owned = true
  // 先挂一份 0 字节的快照再开轮询，否则首帧回来之前这一行是空的，按钮转圈没人解释。
  progress.value = {
    phase: 'downloading',
    downloaded: 0,
    total: 0,
    version: options.version ?? '',
  }
  startPolling()
  try {
    const result = await useControlApi().ensureKernel(options)
    if (result.ok) {
      showNotification({ content: 'kernelDownloadSuccess', type: 'alert-success' })
      // 更新内核时 agent 先停后起，进程换了一个：三条常驻流还连着旧端口就是死流，
      // 而升级期间页面跳转已被抑制，没人替我们重连。
      if (result.started) startKernelSession()
    } else if (result.cancelled) {
      // 自己按下的取消不该报红：二进制没动、内核也没停。
      showNotification({ content: 'kernelDownloadCancelled', type: 'alert-info' })
    } else {
      showNotification({
        content: result.error || 'kernelDownloadFailed',
        type: 'alert-error',
      })
    }
  } catch (error) {
    notifyRequestError(error)
  } finally {
    owned = false
    cancelling.value = false
    stopPolling()
    progress.value = null
  }
}
