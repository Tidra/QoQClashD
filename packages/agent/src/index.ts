import type { ScriptRunner } from './script'
import type { CreateSupervisorOptions } from './supervisor'
import type {
  KernelState,
  KernelManager,
  SystemProxyController,
  TunController,
} from './types'
import { existsSync, mkdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { createControlRouter } from './http'
import { MIHOMO_VERSION } from './kernel/assets'
import { fetchKernel } from './kernel/fetch-kernel'
import { createProfileConfigEditor } from './profile-editor'
import { createProfileStore } from './profiles'
import { applyActiveRefresh } from './refresh-apply'
import { createProfileScheduler } from './scheduler'
import { createScriptRunner } from './script'
import { createSupervisor } from './supervisor'
import { createAgentStorage } from './storage'

export const AGENT_VERSION = '0.0.0'

export { createControlRouter } from './http'
export type { ControlRouterDeps } from './http'
export { MIHOMO_VERSION, mihomoAsset } from './kernel/assets'
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
export type {
  ProfileRefreshResult,
  ProfileScheduler,
  ProfileSchedulerDeps,
} from './scheduler'
export { createScriptRunner } from './script'
export type {
  CreateScriptRunnerOptions,
  ScriptRun,
  ScriptRunner,
} from './script'
export { createSupervisor } from './supervisor'
export type { CreateSupervisorOptions, SupervisorDeps } from './supervisor'
export { buildTunConfig, TunPreconditionError } from './tun'
export * from './types'
export { createWebdavClient } from './webdav'
export type { WebdavClient, WebdavClientOptions } from './webdav'

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
  const envRoot = process.env.QOQCLASHD_HOME || process.env.METACUBEXD_HOME
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
  const storage = createAgentStorage(dataDir, {
    'setup/panel-password': opts.agentToken ?? '',
    'config/core-storage-dir': initialLayout.kernelDir,
    'config/runtime-root': persistedRoot,
  })
  let supervisor = createSupervisor({
    ...opts,
    binaryPath,
    homeDir: runtimeConfigDir,
    activeConfigPath: runtimeActiveConfigPath,
  })
  let profileEditor = createProfileConfigEditor({
    profiles,
    supervisor,
    homeDir: runtimeConfigDir,
  })

  const ensureKernel = async () => {
    if (binaryPath && existsSync(binaryPath)) {
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

    const { binPath } = await fetchKernel(
      process.platform,
      process.arch,
      runtimeKernelDir,
    )
    binaryPath = binPath
    supervisor.setBinaryPath(binPath)
    let started: KernelState
    let startError: string | undefined
    try {
      started = await supervisor.start()
    } catch (error) {
      startError = error instanceof Error ? error.message : String(error)
      started = supervisor.getState()
    }
    return {
      ok: true,
      path: binPath,
      started: started.status === 'running',
      status: started,
      ...(startError ? { error: startError } : {}),
    }
  }

  const { systemProxy, kernelManager, tunController } = opts
  const runtime = () => ({
    root: runtimeRoot,
    kernel: runtimeKernelDir,
    config: runtimeConfigDir,
    profiles: runtimeProfilesDir,
    activeConfig: runtimeActiveConfigPath,
  })
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
      'webdav-backup',
      'runtime-config',
      'config-sections',
      'visual-config-editor',
      ...(systemProxy ? ['system-proxy'] : []),
      ...(kernelManager ? ['kernel-version'] : []),
      ...(tunController ? ['tun'] : []),
    ],
  })

  let router = createControlRouter({
    supervisor,
    profiles,
    profileEditor,
    info,
    homeDir: runtimeConfigDir,
    activeConfigPath: runtimeActiveConfigPath,
    token: opts.agentToken,
    systemProxy,
    kernelManager,
    tunController,
    ensureKernel,
    storage,
  })

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
    })
    profileEditor = createProfileConfigEditor({
      profiles,
      supervisor,
      homeDir: layout.configDir,
    })
    router = createControlRouter({
      supervisor,
      profiles,
      profileEditor,
      info,
      homeDir: layout.configDir,
      activeConfigPath: layout.activeConfigPath,
      token: opts.agentToken,
      systemProxy,
      kernelManager,
      tunController,
      ensureKernel,
      setRuntimeRoot,
      storage,
    })

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
    scheduler,
    systemProxy,
    kernelManager,
    tunController,
    ensureKernel,
    setRuntimeRoot,
    storage,
  }
}
