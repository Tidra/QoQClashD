// Mirror of @metacubexd/agent KernelStatus / KernelState (SHARED CONTRACTS).
// 面板独立构建，不 import agent 包，所以控制 API 的响应类型在这里各留一份。
export type KernelStatus = 'stopped' | 'starting' | 'running' | 'stopping' | 'errored'

export interface KernelState {
  status: KernelStatus
  pid?: number
  startedAt?: number // uptimeMs = Date.now() - startedAt
  version?: string
  externalController: string
  lastExitCode?: number | null
  lastError?: string
  // Merged by the agent from its layout/KV: whether the kernel binary file
  // exists on disk, and the last release tag installed via kernel/ensure.
  binaryExists?: boolean
  installedVersion?: string
  // 只有 /kernel/status 带这个：agent 把 Clash API 密码留在服务端闭包里，
  // 状态对象会被每个控制接口和 SSE 帧序列化下发，放进去等于明文回浏览器。
  secretSet?: boolean
}

export type ProfileType = 'local' | 'remote' | 'merge' | 'script'

/** 与 agent types.ts 的 KernelDownloadProgress 对齐：/kernel/ensure/status 的响应体。 */
export interface KernelDownloadProgress {
  phase: 'downloading' | 'starting' | 'done' | 'failed' | 'cancelled'
  downloaded: number
  total: number
  version: string
  error?: string
}

// 没有在途下载时也要回一个对象体：裸 null 会被 agent 侧的 h3 变成 204 空响应。
export interface KernelDownloadStatus {
  progress: KernelDownloadProgress | null
}

export interface ProfileSubscriptionInfo {
  upload: number
  download: number
  total: number
  expire: number
}

export interface ProfileMeta {
  id: string
  name: string
  type: ProfileType
  // merge/script-only: a disabled merge overlay (or script transform) is skipped
  // when composing the active config. Treat undefined as enabled (the
  // overlay/transform is applied). SHARED CONTRACTS.
  enabled?: boolean
  url?: string
  userAgent?: string
  // minutes; remote-only. Drives the AIO server's auto-update scheduler (0 or
  // undefined => auto-update off). SHARED CONTRACTS.
  updateInterval?: number
  baseProfileId?: string
  managedBy?: 'visual-editor'
  editorStatus?: 'clean' | 'conflicted'
  updatedAt: number
  subscriptionInfo?: ProfileSubscriptionInfo
  // Derived (not stored): true on the base profile the agent recorded as the
  // active one in state.json. Lets the profiles page persistently mark the
  // active card instead of losing the badge on reload (#2148).
  active?: boolean
}

// GET /api/control/info
export type ControlFeature =
  | 'profiles'
  | 'logs-sse'
  | 'kernel-control'
  | 'system-proxy'
  | 'kernel-version'
  | 'geo-assets'
  | 'config-sections'
  | 'visual-config-editor'
  | 'tun'

export interface ProfileEditorSnapshot {
  profile: ProfileMeta
  active: boolean
  revision: string
  editableYaml: string
  composedYaml: string
  schemaVersion: string
  composition: ProfileMeta[]
  diagnostics: Array<{
    path: Array<string | number>
    code: string
    message: string
    severity: 'error' | 'warning'
  }>
  conflicts: Array<{
    operation: import('@metacubexd/config-editor').ConfigPatchOperation
    path: Array<string | number>
    reason: 'changed' | 'missing' | 'duplicate' | 'invalid-target'
    current?: unknown
  }>
}

export interface ProfileEditorPreview extends ProfileEditorSnapshot {
  patch: import('@metacubexd/config-editor').ConfigPatchV1
}
export interface ControlInfo {
  hasAgent: boolean
  version: string
  platform: { os: string; arch: string }
  kernel: { bundled: boolean; path: string; version?: string }
  runtime?: {
    root: string
    kernel: string
    config: string
    profiles: string
    activeConfig: string
  }
  features: ControlFeature[]
}

// GET /api/control/profiles/:id
export interface ProfileDetail {
  meta: ProfileMeta
  content: string
}

// POST /api/control/profiles/:id/validate
export interface ValidateResult {
  valid: boolean
  message: string
}

// GET/POST /api/control/sysproxy (capability-gated 'system-proxy').
// The GET reflects the controller's isEnabled() + describe(); the POST body is
// { enabled, bypass? } and the response echoes the same shape (SHARED CONTRACTS).
export interface SystemProxyState {
  enabled: boolean
  port: number
  bypass: string[]
}

// GET /api/control/kernel/versions (capability-gated 'kernel-version').
// Mirror of @metacubexd/agent KernelManager.listVersions() (SHARED CONTRACTS).
export interface KernelVersions {
  versions: string[]
  current?: string
  bundled: string
}

// POST /api/control/geo/update (capability-gated 'geo-assets'). Downloads the
// geoip/geosite/mmdb databases into the kernel home dir (SHARED CONTRACTS).
export interface GeoUpdateResult {
  ok: boolean
  files: string[]
}

// GET/POST /api/control/tun (capability-gated 'tun'). Mirror of @metacubexd/agent
// TunController.status() (SHARED CONTRACTS). `mode` distinguishes the default
// in-process sidecar (no TUN) from the privileged helper-spawned TUN runtime.
// GET reflects the current state; POST body is { enabled, stack? } and the
// response echoes this same shape. Toggling installs/elevates the helper +
// (re)starts the kernel, so callers should treat it as a slow operation.
export interface TunStatus {
  enabled: boolean
  mode: 'sidecar' | 'tun'
  stack?: string
}
