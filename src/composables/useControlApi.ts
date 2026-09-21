import { markUnauthorized } from '@/helper/unauthorized'
import type {
  ControlInfo,
  GeoUpdateResult,
  KernelState,
  KernelVersions,
  ProfileDetail,
  ProfileEditorPreview,
  ProfileEditorSnapshot,
  ProfileMeta,
  SystemProxyState,
  TunStatus,
  ValidateResult,
} from '@/types/control'
import type { ConfigPatchV1 } from '@metacubexd/config-editor'
import ky from 'ky'

// Profile validation can trigger Mihomo's first-run GEO database download.
// Keep ordinary control requests on the client's 15s default. These finite
// budgets outlive the agent's 300s validator, 5s reap grace, kernel lifecycle,
// and (for refresh+apply) bounded subscription fetch (#2118, #2121).
const PROFILE_SUBSCRIPTION_TIMEOUT = 45_000
const PROFILE_VALIDATE_TIMEOUT = 330_000
const PROFILE_ACTIVATE_TIMEOUT = 360_000
const PROFILE_REFRESH_AND_ACTIVATE_TIMEOUT = 390_000
// Kernel downloads run through the agent over (mirrored) GitHub release URLs;
// a slow mirror needs a generous finite budget, and the release listing hits
// api.github.com server-side.
const KERNEL_ENSURE_TIMEOUT = 390_000
const KERNEL_RELEASES_TIMEOUT = 60_000

export interface EnsureKernelBody {
  /** KERNEL_MIRRORS whitelist key, e.g. 'direct' | 'gh-proxy'. */
  mirror?: string
  /** mihomo release tag, e.g. 'v1.19.27'. */
  version?: string
  /** true = re-download even if the binary already exists. */
  force?: boolean
}

export interface KernelReleases {
  ok: boolean
  versions: string[]
  mirrors: string[]
  error?: string
}

// 面板与 agent 同源部署，控制接口没有第二种地址可挑。鉴权走服务端签发的会话
// cookie（见 helper/panelSession），浏览器不再持有 token 或密码。
const CONTROL_BASE = `${
  typeof window !== 'undefined' && window.location?.origin ? window.location.origin : ''
}/api/control`

export function useControlApi() {
  // ky v2: use `prefix` (prefixUrl was renamed in v2). All method paths below
  // are passed WITHOUT a leading slash so ky joins them cleanly.
  const client = ky.create({
    prefix: CONTROL_BASE,
    timeout: 15000,
    hooks: {
      afterResponse: [
        ({ response }) => {
          if (response.status === 401) markUnauthorized()
        },
      ],
    },
  })

  return {
    base: CONTROL_BASE,
    getInfo: () => client.get('info').json<ControlInfo>(),
    getRuntimeInfo: () =>
      client.get('runtime').json<{
        root: string
        kernel: string
        config: string
        profiles: string
        activeConfig: string
      }>(),
    setRuntimeRoot: (root: string) =>
      client.post('runtime/root', { json: { root } }).json<{
        ok: boolean
        root: string
        kernel: string
        config: string
        profiles: string
        activeConfig: string
      }>(),
    // Relocate kernel storage / config dirs at runtime (absolute paths). Takes
    // effect on the NEXT kernel start; echoes the new runtime layout.
    setRuntimePaths: (body: { kernelDir?: string; configDir?: string }) =>
      client.put('runtime/paths', { json: body }).json<{
        ok: boolean
        error?: string
        root: string
        kernel: string
        config: string
        profiles: string
        activeConfig: string
      }>(),
    getKernelStatus: () => client.get('kernel/status').json<KernelState>(),
    startKernel: () => client.post('kernel/start').json<KernelState>(),
    stopKernel: () => client.post('kernel/stop').json<KernelState>(),
    restartKernel: () => client.post('kernel/restart').json<KernelState>(),
    // Download (or re-download with force) + start the kernel binary in the
    // agent's kernel dir. Body is optional: omitted = ensure-defaults (direct
    // URL, pinned version, no-op when the binary exists).
    ensureKernel: (body?: EnsureKernelBody) =>
      client
        .post('kernel/ensure', {
          json: body ?? {},
          timeout: KERNEL_ENSURE_TIMEOUT,
        })
        .json<{
          ok: boolean
          path?: string
          started?: boolean
          status?: KernelState
          error?: string
        }>(),
    // Installable mihomo release tags (newest first) + whitelisted mirrors.
    getKernelReleases: () =>
      client.get('kernel/releases', { timeout: KERNEL_RELEASES_TIMEOUT }).json<KernelReleases>(),
    // 内核 Clash API 端口。持久化在 agent 侧；内核正在跑时 requiresRestart=true，
    // 要重启才会写进 active.yaml。密码不下发到浏览器，改密走 /auth/password。
    updateKernelApi: (body: { port?: number }) =>
      client.put('kernel/api', { json: body }).json<{
        ok: boolean
        error?: string
        externalController?: string
        port?: number
        requiresRestart?: boolean
      }>(),
    // Restore the last-known-good active config (.bak from the previous
    // activate) and restart — escape hatch for a config that bricks the kernel
    // (#2109). 404s when no backup exists.
    rollbackKernel: () => client.post('kernel/rollback').json<KernelState>(),
    // Reset to a minimal (header-only) config + restart on mihomo defaults.
    // Last-resort recovery when even the backup is bad (#2109).
    recoverKernel: () => client.post('kernel/recover').json<KernelState>(),

    listProfiles: () => client.get('profiles').json<ProfileMeta[]>(),
    // `type: 'merge'` mints a YAML overlay profile (composed onto the active
    // base); `type: 'script'` mints a JS transform run after merges; omitting
    // type defaults to a plain local profile (SHARED CONTRACTS).
    createProfile: (body: {
      name: string
      content?: string
      type?: 'local' | 'merge' | 'script'
    }) => client.post('profiles', { json: body }).json<ProfileMeta>(),
    getProfile: (id: string) => client.get(`profiles/${id}`).json<ProfileDetail>(),
    updateProfile: (
      id: string,
      body: {
        name?: string
        content?: string
        enabled?: boolean
        // minutes; remote-only. 0 disables auto-update.
        updateInterval?: number
      },
    ) => client.put(`profiles/${id}`, { json: body }).json<ProfileMeta>(),
    // DELETE returns 204 No Content — there is no body to parse. Chaining
    // .json() on an empty 204 throws "Unexpected end of JSON input" and makes a
    // successful delete look like a failure (#2110).
    deleteProfile: async (id: string) => {
      await client.delete(`profiles/${id}`)
    },
    duplicateProfile: (id: string, name?: string) =>
      client.post(`profiles/${id}/duplicate`, { json: { name } }).json<ProfileMeta>(),
    importProfile: (url: string, name?: string) =>
      client
        .post('profiles/import', {
          json: { url, name },
          timeout: PROFILE_SUBSCRIPTION_TIMEOUT,
        })
        .json<ProfileMeta>(),
    // Server-side subscription fetch proxy (browser-direct fetch is CORS
    // blocked). Returns raw content only; nothing is persisted.
    fetchSubscriptionContent: (url: string) =>
      client
        .post('subscriptions/fetch', {
          json: { url },
          timeout: PROFILE_SUBSCRIPTION_TIMEOUT,
        })
        .json<{ ok: boolean; content: string }>(),
    activateProfile: (id: string) =>
      client
        .post(`profiles/${id}/activate`, {
          timeout: PROFILE_ACTIVATE_TIMEOUT,
        })
        .json<KernelState>(),
    // Re-fetch a REMOTE subscription in place (agent overwrites content +
    // subscriptionInfo + updatedAt, keeping the same id). Pure refresh — it does
    // NOT touch the running config; use refreshAndActivateProfile to apply.
    refreshProfile: (id: string) =>
      client
        .post(`profiles/${id}/refresh`, {
          timeout: PROFILE_SUBSCRIPTION_TIMEOUT,
        })
        .json<ProfileMeta>(),
    // Combined refresh + apply: re-fetch, compose into active.yaml, validate,
    // and restart. The action users expect from "refresh and make it take
    // effect" (#2108). Returns the refreshed meta and the resulting state.
    refreshAndActivateProfile: (id: string) =>
      client
        .post(`profiles/${id}/refresh-and-activate`, {
          timeout: PROFILE_REFRESH_AND_ACTIVATE_TIMEOUT,
        })
        .json<{ meta: ProfileMeta; kernel: KernelState }>(),
    validateProfile: (id: string) =>
      client
        .post(`profiles/${id}/validate`, {
          timeout: PROFILE_VALIDATE_TIMEOUT,
        })
        .json<ValidateResult>(),

    getProfileEditor: (id: string) =>
      client.get(`profiles/${id}/editor`).json<ProfileEditorSnapshot>(),
    previewProfileEditor: (id: string, patch: ConfigPatchV1) =>
      client
        .post(`profiles/${id}/editor/preview`, { json: { patch } })
        .json<ProfileEditorPreview>(),
    applyProfileEditor: (id: string, patch: ConfigPatchV1) =>
      client
        .put(`profiles/${id}/editor`, {
          json: { patch },
          timeout: PROFILE_ACTIVATE_TIMEOUT,
        })
        .json<{
          profile: ProfileMeta
          activeId: string
          revision: string
          kernel: KernelState
        }>(),
    resetProfileEditorOverlay: (id: string) =>
      client
        .delete(`profiles/${id}/editor/overlay`, {
          timeout: PROFILE_ACTIVATE_TIMEOUT,
        })
        .json<KernelState | { ok: true }>(),

    // System proxy (capability-gated 'system-proxy'). GET reflects the current
    // OS proxy state; POST { enabled, bypass? } toggles it and echoes the state.
    getSysProxy: () => client.get('sysproxy').json<SystemProxyState>(),
    setSysProxy: (body: { enabled: boolean; bypass?: string[] }) =>
      client.post('sysproxy', { json: body }).json<SystemProxyState>(),

    // Kernel version management (capability-gated 'kernel-version'). GET lists
    // the downloaded + bundled versions and the active one; POST { version }
    // downloads/persists/live-swaps it (the kernel restarts) and echoes { ok }.
    getKernelVersions: () => client.get('kernel/versions').json<KernelVersions>(),
    switchKernel: (version: string) =>
      client.post('kernel/switch', { json: { version } }).json<{ ok: true }>(),

    // Geo assets (capability-gated 'geo-assets'). POST downloads the geoip/
    // geosite/mmdb databases into the kernel home dir and echoes { ok, files }.
    updateGeoAssets: () => client.post('geo/update').json<GeoUpdateResult>(),

    // Active profile SOURCE (GET /config): the last-applied profile yaml without
    // the supervisor-injected runtime keys — the right baseline to diff the
    // panel draft against. Resolves to '' when no profile is active.
    getActiveConfig: () => client.get('config').text(),

    // Config sections (capability-gated 'config-sections'). GET reads ONE parsed
    // top-level key of the active profile (e.g. rules, dns, sniffer) — resolves
    // to null when absent / no active profile. PUT { key, value } replaces that
    // section, re-activates the profile and restarts the kernel ONCE (so a GUI
    // editor batches every local edit into a single save). PUT echoes the
    // restarted KernelState. SHARED CONTRACTS.
    getConfigSection: <T = unknown>(key: string) =>
      client.get('config/section', { searchParams: { key } }).json<T>(),
    // `restart: false` persists the section to the active profile without
    // restarting the kernel — used when the change was already hot-applied via
    // PATCH /configs and only needs to survive the next restart (#2070).
    setConfigSection: (body: { key: string; value: unknown; restart?: boolean }) =>
      client.put('config/section', { json: body }).json<KernelState>(),

    // TUN mode (capability-gated 'tun'). GET reflects the current sidecar/tun
    // state; POST { enabled, stack? } toggles it and echoes the same TunStatus.
    // Enabling installs/elevates the privileged helper and privileged-restarts
    // mihomo (slow); disabling tears TUN down and returns to the sidecar — it
    // doubles as the "recover network" escape hatch (SHARED CONTRACTS).
    getTun: () => client.get('tun').json<TunStatus>(),
    setTun: (body: { enabled: boolean; stack?: string }) =>
      client.post('tun', { json: body }).json<TunStatus>(),
    // Remove the privileged helper service entirely (tears TUN down to the
    // sidecar first if active). Echoes the post-uninstall TunStatus.
    uninstallTun: () => client.post('tun/uninstall').json<TunStatus>(),
  }
}
