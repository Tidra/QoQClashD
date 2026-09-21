// 内置内核的运行期helper：等待状态、启动并接上会话、登录后引导。
//
// 面板只对着 agent 托管的那一个内核工作，所以这里不再有「登记后端」这一步 ——
// 内核 running 就是唯一事实，接上它只要重开会话。
// start/restartKernelAndReconnect 是「拉起内核并接上」的单一实现：设置页的运行控制按钮与
// Clash API 端口下发都走同一条路 —— 启动/重启 → 等 running → 重开会话。
import { startKernelSession } from '@/assembly/session'
import { useControlApi } from '@/composables/useControlApi'
import { ROUTE_NAME, SETTINGS_MENU_KEY } from '@/constant'
import { kernelDownloading } from '@/helper/kernelDownload'
import { getAuthStatus } from '@/helper/panelSession'
import { whenStorageReady } from '@/helper/storage'
import router from '@/router'

const KERNEL_WAIT_TIMEOUT = 15000

/** 读一次内核状态；agent 不可达返回 undefined。 */
export const getKernelStatusSafe = async () => {
  try {
    return await useControlApi().getKernelStatus()
  } catch {
    return undefined
  }
}

/** 轮询 agent 的内核状态直到 running；超时返回 false。 */
const waitKernelRunning = async () => {
  const controlApi = useControlApi()
  const deadline = Date.now() + KERNEL_WAIT_TIMEOUT
  for (;;) {
    try {
      const state = await controlApi.getKernelStatus()
      if (state.status === 'running') return true
    } catch {
      // 重启空档里 agent 可能短暂不可达，继续等到超时
    }
    if (Date.now() >= deadline) return false
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
}

/** 拉起内核（启动或重启）→ 等 running → 重开会话；没在超时内起来返回 false 交给调用方提示。 */
const bringKernelBackUp = async (command: () => Promise<unknown>) => {
  await command()
  if (!(await waitKernelRunning())) return false
  startKernelSession()
  return true
}

export const startKernelAndReconnect = () => bringKernelBackUp(() => useControlApi().startKernel())

export const restartKernelAndReconnect = () =>
  bringKernelBackUp(() => useControlApi().restartKernel())

/**
 * 共用密码改过、且内核当时在跑，就得重启一次。
 *
 * secret 是启动时写进 active.yaml 托管头的，同源代理注入的又已经是新值 —— 不重启
 * 就是面板拿着新密码去敲内核的旧锁，每一笔 API 调用都会 401。
 */
export const restartKernelForSecret = async () => {
  try {
    await restartKernelAndReconnect()
  } catch {
    // 重启失败交给会话自己的断连表现，不拦登录/改密流程
  }
}

export const KERNEL_SETTINGS_ROUTE = {
  name: ROUTE_NAME.settings,
  query: { section: SETTINGS_MENU_KEY.backend },
}

/**
 * 内核不在跑就去内核设置页，而不是弹一层「请启动内核」的窗。运行控制按钮就在那一屏。
 *
 * 升级窗口期不跳：agent 写二进制前会先把内核停掉（Windows 锁着镜像文件），这几分钟
 * 状态恒为非 running。用户正站在自己要看的地方点下载，把他弹走等于打断自己的操作。
 */
const gotoKernelSettings = () => {
  if (kernelDownloading.value) return
  router.replace(KERNEL_SETTINGS_ROUTE)
}

/**
 * 登录后接上内核：running 就开数据会话，否则直接去内核设置页。
 *
 * 冷启动（内核从没起过）与内核被停掉是同一个处置 —— 总览页对着停掉的内核只能是一片
 * 空白，与其让用户看空表，不如把他送到那个「启动」按钮前面。
 *
 * 一次页面加载只引导一回：登录页登录成功后是 location.reload()，所以「已经引导过」
 * 等于「这一轮答案已经给出去了」，重复调用只会把会话重开一遍。
 */
let bootstrapped = false
let bootstrapInFlight: Promise<void> | undefined

const runKernelBootstrap = async () => {
  await whenStorageReady()
  const authenticated = await getAuthStatus()
    .then((status) => status.authenticated)
    .catch(() => false)
  if (!authenticated) return

  bootstrapped = true
  if ((await getKernelStatusSafe())?.status === 'running') {
    startKernelSession()
    return
  }
  gotoKernelSettings()
}

export const bootstrapKernelSession = () => {
  if (bootstrapped) return Promise.resolve()
  bootstrapInFlight ??= runKernelBootstrap().finally(() => {
    bootstrapInFlight = undefined
  })
  return bootstrapInFlight
}

/**
 * 回到前台时确认内核还活着。
 *
 * 息屏 / 切走期间内核可能被停掉或随机器睡眠一起没了。三条常驻流只会对着死端口无限
 * 重连，用户需要的是启动入口而不是转圈的表格。
 */
export const resumeKernelSession = async () => {
  if ((await getKernelStatusSafe())?.status === 'running') return
  gotoKernelSettings()
}
