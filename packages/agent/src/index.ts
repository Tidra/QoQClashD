import { existsSync, mkdirSync } from 'node:fs'
import { isAbsolute, join } from 'node:path'
import { createControlRouter } from './http'
import { MIHOMO_VERSION, mihomoAsset } from './kernel/assets'
import { fetchKernel } from './kernel/fetch-kernel'
import { createProfileConfigEditor } from './profile-editor'
import { createProfileStore } from './profiles'
import { applyActiveRefresh } from './refresh-apply'
import { createProfileScheduler } from './scheduler'
import type { ScriptRunner } from './script'
import { createScriptRunner } from './script'
import type { PanelAuth } from './session'
import { createSessionManager } from './session'
import { createAgentStorage } from './storage'
import type { CreateSupervisorOptions } from './supervisor'
import { createSupervisor } from './supervisor'
import type {
  EnsureKernelOptions,
  EnsureKernelResult,
  KernelDownloadProgress,
  KernelManager,
  KernelState,
  SystemProxyController,
  TunController,
} from './types'

export const AGENT_VERSION = '0.0.0'

export { createControlRouter } from './http'
export type { ControlRouterDeps } from './http'
export { applyMirror, KERNEL_MIRRORS, MIHOMO_VERSION, mihomoAsset } from './kernel/assets'
export { fetchKernel, listMihomoVersions } from './kernel/fetch-kernel'
export { fetchGeoAssets, GEO_ASSET_URLS } from './kernel/geo'
export { mergeConfigs } from './merge'
export {
  createProfileConfigEditor,
  ProfileEditorConflictError,
  ProfileEditorValidationError,
} from './profile-editor'
export type {
  ProfileConfigEditor,
  ProfileConfigEditorOptions,
  ProfileEditorApplyResult,
  ProfileEditorPreview,
  ProfileEditorSnapshot,
} from './profile-editor'
export { createProfileStore } from './profiles'
export { applyActiveRefresh } from './refresh-apply'
export { createProfileScheduler } from './scheduler'
export type { ProfileRefreshResult, ProfileScheduler, ProfileSchedulerDeps } from './scheduler'
export { createScriptRunner } from './script'
export type { CreateScriptRunnerOptions, ScriptRun, ScriptRunner } from './script'
export {
  createSessionManager,
  readSessionCookie,
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
} from './session'
export type { AuthResult, PanelAuth, SessionManager } from './session'
export { createSupervisor } from './supervisor'
export type { CreateSupervisorOptions, SupervisorDeps } from './supervisor'
export { buildTunConfig, TunPreconditionError } from './tun'
export * from './types'

/** 设置页可改的内核 Clash API 端口默认值（KV 与 env 都没给时）。 */
export const DEFAULT_KERNEL_API_PORT = 9090

/** PUT /kernel/api 的请求体：只有端口。密码归 /auth/password 管。 */
export interface KernelApiPatch {
  port?: number
}

export interface KernelApiResult {
  ok: boolean
  error?: string
  externalController?: string
  port?: number
  // 内核正在跑时，改端口要重启才会写进 active.yaml。
  requiresRestart?: boolean
}

export type CreateAgentOptions = CreateSupervisorOptions & {
  profilesDir: string
  kernelDir?: string
  runtimeRoot?: string
  dataDir?: string
  agentToken?: string
  // Runs enabled 'script' profiles during composition. Defaults to a real
  // worker-backed runner; tests inject a fake to avoid spawning workers.
  scriptRunner?: ScriptRunner
  systemProxy?: SystemProxyController // OS proxy controller; enables 'system-proxy'
  kernelManager?: KernelManager // kernel version mgmt; enables 'kernel-version'
  tunController?: TunController // TUN mode controller; enables 'tun'
}

export interface AgentInfo {
  hasAgent: true
  version: string
  platform: { os: string; arch: string }
  kernel: { bundled: boolean; path: string; version?: string }
  runtime: {
    root: string
    kernel: string
    config: string
    profiles: string
    activeConfig: string
  }
  features: string[]
}

function resolvePersistentRuntimeRoot(): string {
  const envRoot = process.env.QOQCLASHD_HOME
  if (envRoot) return envRoot

  return process.cwd()
}

function ensureRuntimeLayout(
  root: string,
  profilesDir?: string,
  configDir?: string,
  kernelDir?: string,
) {
  const resolvedKernelDir = kernelDir || join(root, 'kernel')
  const resolvedConfigDir = configDir || join(root, 'config')
  const resolvedProfilesDir = profilesDir || join(root, 'profiles')
  mkdirSync(resolvedKernelDir, { recursive: true })
  mkdirSync(resolvedConfigDir, { recursive: true })
  mkdirSync(resolvedProfilesDir, { recursive: true })
  return {
    kernelDir: resolvedKernelDir,
    configDir: resolvedConfigDir,
    profilesDir: resolvedProfilesDir,
    activeConfigPath: join(resolvedConfigDir, 'active.yaml'),
  }
}

export function createAgent(opts: CreateAgentOptions) {
  const persistedRoot = opts.runtimeRoot?.trim() || resolvePersistentRuntimeRoot()
  const initialLayout = ensureRuntimeLayout(
    persistedRoot,
    opts.profilesDir,
    opts.homeDir || join(persistedRoot, 'config'),
    opts.kernelDir,
  )

  let runtimeRoot = persistedRoot
  let runtimeKernelDir = initialLayout.kernelDir
  let runtimeConfigDir = initialLayout.configDir
  let runtimeProfilesDir = initialLayout.profilesDir
  let runtimeActiveConfigPath = initialLayout.activeConfigPath
  let binaryPath = opts.binaryPath

  const applyRuntimeRoot = (root: string) => {
    const candidateRoot = root?.trim() || persistedRoot
    const layout = ensureRuntimeLayout(
      candidateRoot,
      join(candidateRoot, 'profiles'),
      join(candidateRoot, 'config'),
    )
    runtimeRoot = candidateRoot
    runtimeKernelDir = layout.kernelDir
    runtimeConfigDir = layout.configDir
    runtimeProfilesDir = layout.profilesDir
    runtimeActiveConfigPath = layout.activeConfigPath
    return layout
  }

  let profiles = createProfileStore({
    dir: runtimeProfilesDir,
    activeConfigPath: runtimeActiveConfigPath,
    scriptRunner: opts.scriptRunner ?? createScriptRunner(),
  })
  const dataDir = opts.dataDir?.trim() || process.env.DATA_DIR || join(persistedRoot, 'data')

  // Clash API 的绑定主机来自宿主传入的 externalController，端口则设置页可改（KV 持久化）。
  // 没传地址时按本机回环 + 默认端口，保证冷启动也有一个确定的默认值。
  const splitController = (value: string) => {
    const withScheme = value.startsWith('http') ? value : `http://${value}`
    try {
      const url = new URL(withScheme)
      return { host: url.hostname || '127.0.0.1', port: Number(url.port) || undefined }
    } catch {
      return { host: '127.0.0.1', port: undefined }
    }
  }
  const envController = splitController(opts.externalController ?? '')
  const controllerAddress = (port: number) => `${envController.host}:${port}`
  let kernelApiPort = envController.port ?? DEFAULT_KERNEL_API_PORT

  const storage = createAgentStorage(dataDir, {
    'setup/panel-password': opts.agentToken ?? '',
    'config/core-storage-dir': initialLayout.kernelDir,
    'config/config-dir': initialLayout.configDir,
    'config/runtime-root': persistedRoot,
    'config/kernel-api-port': kernelApiPort,
  })
  let supervisor = createSupervisor({
    ...opts,
    binaryPath,
    homeDir: runtimeConfigDir,
    activeConfigPath: runtimeActiveConfigPath,
    externalController: controllerAddress(kernelApiPort),
  })
  let profileEditor = createProfileConfigEditor({
    profiles,
    supervisor,
    homeDir: runtimeConfigDir,
  })

  // 显式版本必须是受支持的 release tag；非法值静默回落到 MIHOMO_VERSION。
  const kernelVersionRe = /^v\d+(?:\.\d+)*(?:-[\w.]+)?$/

  // KV 里由 agent 自己写入的值统一用 JSON 编码（前端 useStorage 同约定）。
  const KV = {
    kernelDir: 'config/core-storage-dir',
    configDir: 'config/config-dir',
    installedVersion: 'config/kernel-installed-version',
    apiPort: 'config/kernel-api-port',
    // 面板登录密码 = 内核 Clash API secret，两处共用这一个值。
    panelPassword: 'setup/panel-password',
  } as const
  const readKvRawString = async (key: string) => {
    const raw = await storage.get(key)
    if (raw == null) return undefined
    try {
      const parsed: unknown = JSON.parse(raw)
      return typeof parsed === 'string' ? parsed : undefined
    } catch {
      return undefined
    }
  }
  const readKvString = async (key: string) => {
    const value = await readKvRawString(key)
    return value && value.trim() ? value : undefined
  }
  const readKvPort = async (key: string) => {
    const raw = await storage.get(key)
    if (raw == null) return undefined
    try {
      const value = Number(JSON.parse(raw))
      return Number.isInteger(value) && value >= 1 && value <= 65535 ? value : undefined
    } catch {
      return undefined
    }
  }

  // ---- 面板登录：密码只存在 agent 与 KV 里，浏览器只拿一张签名会话 cookie ----
  // 同步可读的缓存：cookie 校验发生在每个请求上，不能每次都 await 存储。
  // init() 启动时灌入，之后只有 applyPanelPassword 会改它。
  let panelPassword = ''
  const sessions = createSessionManager(() => panelPassword)

  /** 写入面板密码并推给内核（两者共用一个值）。返回内核是否需要重启才生效。 */
  const applyPanelPassword = async (next: string) => {
    panelPassword = next
    await storage.set(KV.panelPassword, JSON.stringify(next))
    supervisor.setController?.({ secret: next })
    const state = supervisor.getState()
    return state.status === 'running' || state.status === 'starting'
  }

  const auth: PanelAuth = {
    needsSetup: () => !panelPassword,
    async login(password) {
      const trimmed = password.trim()
      if (!panelPassword) {
        // 首次运行：输入即新密码，创建完直接登录。
        if (!trimmed) return { ok: false, error: 'password-required' }
        return { ok: true, created: true, requiresRestart: await applyPanelPassword(trimmed) }
      }
      if (trimmed !== panelPassword) return { ok: false, error: 'invalid-password' }
      return { ok: true }
    },
    async changePassword(current, next) {
      // 没设过密码时不承认任何「旧密码」—— 那条路径属于首次创建，走 login。
      if (!panelPassword || current.trim() !== panelPassword) {
        return { ok: false, error: 'invalid-password' }
      }
      const candidate = next.trim()
      if (!candidate) return { ok: false, error: 'password-required' }
      return { ok: true, requiresRestart: await applyPanelPassword(candidate) }
    },
  }

  // 内核下载进度：POST /kernel/ensure 要等整个下载结束，前端靠轮询这份快照画进度条。
  let kernelDownload: KernelDownloadProgress | undefined
  let ensureInFlight: Promise<EnsureKernelResult> | undefined
  // 下载要能中途取消（47 MB 走镜像站可能卡住），所以每趟在途下载握一个 AbortController。
  let downloadAbort: AbortController | undefined

  const runEnsureKernel = async (
    options: EnsureKernelOptions = {},
  ): Promise<EnsureKernelResult> => {
    const version =
      options.version && kernelVersionRe.test(options.version) ? options.version : undefined
    // force / 指定版本时即使二进制已存在也重新下载，实现“更新内核”。
    if (!options.force && !version && binaryPath && existsSync(binaryPath)) {
      supervisor.setBinaryPath(binaryPath)
      const state = supervisor.getState()
      if (state.status !== 'running') {
        const started = await supervisor.start()
        return {
          ok: true,
          path: binaryPath,
          started: started.status === 'running',
          status: started,
        }
      }
      return { ok: true, path: binaryPath, started: false, status: state }
    }

    const download: KernelDownloadProgress = {
      phase: 'downloading',
      downloaded: 0,
      total: 0,
      version: version ?? MIHOMO_VERSION,
    }
    kernelDownload = download
    const abort = new AbortController()
    downloadAbort = abort
    let binPath: string
    let sha256: string
    let verified: boolean
    try {
      const fetched = await fetchKernel(process.platform, process.arch, runtimeKernelDir, {
        ...(version ? { version } : {}),
        ...(options.mirror ? { mirror: options.mirror } : {}),
        signal: abort.signal,
        onProgress: (received, total) => {
          download.downloaded = received
          download.total = total
        },
        // Windows 锁住正在运行的镜像文件：不停内核，整包下完也只是在 writeFile 上撞
        // EBUSY，17 MB 白跑。放这里（下载之后）而不是下载之前，代理链路能多活几分钟。
        beforeWrite: async () => {
          if (supervisor.getState().status !== 'stopped') await supervisor.stop()
        },
      })
      binPath = fetched.binPath
      sha256 = fetched.sha256
      verified = fetched.verified
    } catch (error) {
      // 取消可能以两种形态抛回来（自己的 KernelDownloadCancelled、undici 的
      // AbortError），所以直接问 signal 本身。
      download.phase = abort.signal.aborted ? 'cancelled' : 'failed'
      download.error = error instanceof Error ? error.message : String(error)
      throw error
    } finally {
      downloadAbort = undefined
    }
    binaryPath = binPath
    supervisor.setBinaryPath(binPath)
    // 摘要只进日志：改接口返回结构要连带对齐同一函数里其它几个提前返回分支。
    console.log(
      `[qoqclashd] kernel ${sha256} ${verified ? '与账本一致' : '首次记录进内核目录账本'}`,
    )
    // 记录本次安装的 release tag，供设置页判断“已是最新 / 可更新”。
    await storage.set(KV.installedVersion, JSON.stringify(version ?? MIHOMO_VERSION))
    download.phase = 'starting'
    let started: KernelState
    let startError: string | undefined
    try {
      started = await supervisor.start()
    } catch (error) {
      startError = error instanceof Error ? error.message : String(error)
      started = supervisor.getState()
    }
    download.phase = 'done'
    return {
      ok: true,
      path: binPath,
      started: started.status === 'running',
      status: started,
      ...(startError ? { error: startError } : {}),
    }
  }

  const ensureKernel = (options: EnsureKernelOptions = {}) => {
    // 47 MB 的二进制不能下两遍：并发点击或重复引导都复用在途那一次。
    if (ensureInFlight) return ensureInFlight
    kernelDownload = undefined
    ensureInFlight = runEnsureKernel(options)
      .catch((error): EnsureKernelResult => {
        // 用户主动取消不是下载故障：折成 ok:false + cancelled，面板才不会弹红色报错。
        if (kernelDownload?.phase === 'cancelled') return { ok: false, cancelled: true }
        throw error
      })
      .finally(() => {
        ensureInFlight = undefined
      })
    return ensureInFlight
  }

  /** 取消进行中的内核下载；没有在途下载时返回 false。 */
  const cancelKernelDownload = () => {
    if (!downloadAbort) return false
    downloadAbort.abort()
    return true
  }

  const { systemProxy, kernelManager, tunController } = opts
  const runtime = () => ({
    root: runtimeRoot,
    kernel: runtimeKernelDir,
    config: runtimeConfigDir,
    profiles: runtimeProfilesDir,
    activeConfig: runtimeActiveConfigPath,
  })

  // Swap the in-memory layout + push it into the long-lived components (the
  // router is captured once by the server, so nothing here is ever recreated).
  const pointRuntimePaths = (patch: { kernelDir?: string; configDir?: string }) => {
    if (patch.kernelDir) {
      runtimeKernelDir = patch.kernelDir
      const candidate = join(patch.kernelDir, mihomoAsset(process.platform, process.arch).binName)
      if (existsSync(candidate)) {
        binaryPath = candidate
        supervisor.setBinaryPath(candidate)
      }
    }
    if (patch.configDir) {
      runtimeConfigDir = patch.configDir
      runtimeActiveConfigPath = join(patch.configDir, 'active.yaml')
      supervisor.setPaths({
        homeDir: patch.configDir,
        activeConfigPath: runtimeActiveConfigPath,
      })
      profiles.setActiveConfigPath(runtimeActiveConfigPath)
      profileEditor.setHomeDir(patch.configDir)
    }
  }

  const applyRuntimePaths = async (patch: { kernelDir?: string; configDir?: string }) => {
    const kernelDir = patch.kernelDir?.trim()
    const configDir = patch.configDir?.trim()
    if (!kernelDir && !configDir) {
      return { ok: false, error: 'kernelDir or configDir is required', ...runtime() }
    }
    for (const dir of [kernelDir, configDir]) {
      if (dir && !isAbsolute(dir)) {
        return { ok: false, error: 'paths must be absolute', ...runtime() }
      }
    }
    if (kernelDir) {
      mkdirSync(kernelDir, { recursive: true })
      await storage.set(KV.kernelDir, JSON.stringify(kernelDir))
    }
    if (configDir) {
      mkdirSync(configDir, { recursive: true })
      await storage.set(KV.configDir, JSON.stringify(configDir))
    }
    pointRuntimePaths({
      ...(kernelDir ? { kernelDir } : {}),
      ...(configDir ? { configDir } : {}),
    })
    return { ok: true, ...runtime() }
  }

  // 设置页保存「Clash API 端口」。写 KV 并推进 supervisor 状态，active.yaml 的托管
  // 头在下一次 spawn 才重写，所以内核正在跑时要重启才生效。
  const updateClashApi = async (patch: KernelApiPatch): Promise<KernelApiResult> => {
    if (patch.port === undefined) return { ok: false, error: 'port is required' }
    if (!Number.isInteger(patch.port) || patch.port < 1 || patch.port > 65535) {
      return { ok: false, error: 'port must be an integer between 1 and 65535' }
    }
    kernelApiPort = patch.port
    await storage.set(KV.apiPort, JSON.stringify(patch.port))
    supervisor.setController?.({ externalController: controllerAddress(patch.port) })
    const state = supervisor.getState()
    return {
      ok: true,
      externalController: state.externalController,
      port: kernelApiPort,
      requiresRestart: state.status === 'running' || state.status === 'starting',
    }
  }

  const kernelStatusExtras = async () => {
    const installedVersion = await readKvString(KV.installedVersion)
    return {
      binaryExists: existsSync(binaryPath),
      ...(installedVersion ? { installedVersion } : {}),
    }
  }

  // 启动时应用设置页持久化过的目录与 Clash API 端口/密码（server 在 listen 前 await）。
  const init = async () => {
    const [kernelDir, configDir, persistedPort, persistedSecret] = await Promise.all([
      readKvString(KV.kernelDir),
      readKvString(KV.configDir),
      readKvPort(KV.apiPort),
      readKvRawString(KV.panelPassword),
    ])
    const patch: { kernelDir?: string; configDir?: string } = {}
    if (kernelDir && kernelDir !== runtimeKernelDir) patch.kernelDir = kernelDir
    if (configDir && configDir !== runtimeConfigDir) patch.configDir = configDir
    if (patch.kernelDir) mkdirSync(patch.kernelDir, { recursive: true })
    if (patch.configDir) mkdirSync(patch.configDir, { recursive: true })
    if (patch.kernelDir || patch.configDir) pointRuntimePaths(patch)

    const controllerPatch: { externalController?: string; secret?: string } = {}
    if (persistedPort && persistedPort !== kernelApiPort) {
      kernelApiPort = persistedPort
      controllerPatch.externalController = controllerAddress(persistedPort)
    }
    // 空字符串是有意义的取值（还没设密码 → 首屏落在创建密码那一步），所以要灌进内存；
    // 但不能拿它去覆盖内核 secret，否则 supervisor 的随机兜底被清成空串，等于内核 API
    // 不设防。会话 cookie 的签名密钥读的是 panelPassword，与内核 secret 各自独立。
    panelPassword = persistedSecret ?? ''
    if (persistedSecret && persistedSecret !== supervisor.getControllerSecret()) {
      controllerPatch.secret = persistedSecret
    }
    supervisor.setController?.(controllerPatch)
  }

  const info = (): AgentInfo => ({
    hasAgent: true,
    version: AGENT_VERSION,
    platform: { os: process.platform, arch: process.arch },
    kernel: {
      bundled: true,
      path: binaryPath,
      version: supervisor.getState().version ?? MIHOMO_VERSION,
    },
    runtime: runtime(),
    features: [
      'profiles',
      'logs-sse',
      'kernel-control',
      'geo-assets',
      'config-sections',
      'visual-config-editor',
      ...(systemProxy ? ['system-proxy'] : []),
      ...(kernelManager ? ['kernel-version'] : []),
      ...(tunController ? ['tun'] : []),
    ],
  })

  // 只有一个 router 依赖表：换运行目录时要重建 router，两处必须给同一份依赖，
  // 所以收进工厂（原先 setRuntimeRoot 里另写了一份，漏了几个可选依赖）。
  const buildRouter = () =>
    createControlRouter({
      supervisor,
      profiles,
      profileEditor,
      info,
      // Getters, not snapshots: applyRuntimePaths relocates these while the
      // router instance stays alive (the server captures it once).
      get homeDir() {
        return runtimeConfigDir
      },
      get activeConfigPath() {
        return runtimeActiveConfigPath
      },
      token: opts.agentToken,
      systemProxy,
      kernelManager,
      tunController,
      ensureKernel,
      kernelDownloadStatus: () => kernelDownload ?? null,
      cancelKernelDownload,
      applyRuntimePaths,
      updateClashApi,
      kernelStatusExtras,
      auth,
      sessions,
      storage,
      // 工厂里的引用要延后求值：setRuntimeRoot 声明在这之后。
      setRuntimeRoot: (root: string) => setRuntimeRoot(root),
    })

  let router = buildRouter()

  const scheduler = createProfileScheduler({
    profiles,
    onResult: (r) => {
      if (!r.ok) return
      void applyActiveRefresh(profiles, supervisor, r.id).catch(() => {})
    },
  })

  const setRuntimeRoot = async (root: string) => {
    const layout = applyRuntimeRoot(root)
    profiles = createProfileStore({
      dir: layout.profilesDir,
      activeConfigPath: layout.activeConfigPath,
      scriptRunner: opts.scriptRunner ?? createScriptRunner(),
    })
    supervisor = createSupervisor({
      ...opts,
      binaryPath,
      homeDir: layout.configDir,
      activeConfigPath: layout.activeConfigPath,
      // 端口/密码归设置页托管，换运行目录重建 supervisor 时不能退回 env 默认值。
      externalController: controllerAddress(kernelApiPort),
      secret: supervisor.getControllerSecret(),
    })
    profileEditor = createProfileConfigEditor({
      profiles,
      supervisor,
      homeDir: layout.configDir,
    })
    router = buildRouter()

    return {
      ok: true,
      root: runtimeRoot,
      kernel: runtimeKernelDir,
      config: runtimeConfigDir,
      profiles: runtimeProfilesDir,
      activeConfig: runtimeActiveConfigPath,
    }
  }

  return {
    supervisor,
    profiles,
    profileEditor,
    router,
    info,
    init,
    scheduler,
    systemProxy,
    kernelManager,
    tunController,
    ensureKernel,
    updateClashApi,
    setRuntimeRoot,
    storage,
    // 同源的 /api/mihomo 代理要过同一张会话 cookie 才放行（server 侧读它）。
    sessions,
    auth,
  }
}
