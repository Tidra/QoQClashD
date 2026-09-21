import type { ConfigPatchV1 } from '@metacubexd/config-editor'
import type { App, H3Event } from 'h3'
import {
  createApp,
  createError,
  createEventStream,
  createRouter,
  defineEventHandler,
  getCookie,
  getHeader,
  getQuery,
  getRouterParam,
  readBody,
  sendNoContent,
  setCookie,
  setResponseHeader,
  setResponseStatus,
} from 'h3'
import { rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { KERNEL_MIRRORS } from './kernel/assets'
import { listMihomoVersions } from './kernel/fetch-kernel'
import { fetchGeoAssets } from './kernel/geo'
import { ConfigPatchConflictError } from './merge'
import type { ProfileConfigEditor } from './profile-editor'
import { ProfileEditorConflictError, ProfileEditorValidationError } from './profile-editor'
import { SubscriptionFetchError } from './profiles'
import type { PanelAuth, SessionManager } from './session'
import { CREDENTIAL_KV_KEYS, SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from './session'
import type { AgentStorage } from './storage'
import { TunPreconditionError } from './tun'
import type {
  EnsureKernelOptions,
  EnsureKernelResult,
  KernelDownloadProgress,
  KernelLogLine,
  KernelManager,
  KernelState,
  MihomoSupervisor,
  ProfileStore,
  SystemProxyController,
  TunController,
} from './types'

async function withSubscriptionHttpError<T>(action: () => Promise<T>): Promise<T> {
  try {
    return await action()
  } catch (error) {
    if (error instanceof SubscriptionFetchError) {
      const message = `Subscription provider returned HTTP ${error.upstreamStatus}`
      throw createError({
        statusCode: error.upstreamStatus,
        statusMessage: message,
        data: { error: message, upstreamStatus: error.upstreamStatus },
      })
    }
    throw error
  }
}

// 凭证键只能由 agent 自己签发（面板密码同时也是内核 API secret）。写入/删除路由一律
// 拒绝，否则导入一份带 setup/panel-password 的 JSON 就能把面板密码改掉。
function assertNonCredentialKeys(keys: string[]) {
  const blocked = keys.filter((key) => CREDENTIAL_KV_KEYS.has(key))
  if (!blocked.length) return
  throw createError({
    statusCode: 400,
    statusMessage: `credential keys are not writable: ${blocked.join(', ')}`,
  })
}

export interface ControlRouterDeps {
  supervisor: MihomoSupervisor
  profiles: ProfileStore
  profileEditor?: ProfileConfigEditor // capability-gated visual profile editor
  info: () => unknown
  // Read at REQUEST time (deps.homeDir), never destructured: applyRuntimePaths
  // relocates these while the router instance stays alive.
  homeDir: string // writable dir for materializing validate candidate files
  activeConfigPath: string // file the kernel runs with -f (supervisor-injected at spawn)
  token?: string
  systemProxy?: SystemProxyController // OS proxy controller; capability-gated
  kernelManager?: KernelManager // kernel version mgmt; capability-gated
  tunController?: TunController // TUN mode controller; capability-gated
  ensureKernel?: (options?: EnsureKernelOptions) => Promise<EnsureKernelResult>
  // 进行中的内核下载快照；POST /kernel/ensure 要等整个下载结束，进度靠轮询这里。
  kernelDownloadStatus?: () => KernelDownloadProgress | null
  /** 取消在途的内核下载；没有在途下载时返回 false。 */
  cancelKernelDownload?: () => boolean
  setRuntimeRoot?: (root: string) => Promise<{
    ok: boolean
    root: string
    kernel: string
    config: string
    profiles: string
    activeConfig: string
  }>
  // Relocate the kernel binary dir and/or the config (home/active.yaml) dir at
  // runtime; persists the choice and echoes the new runtime layout.
  applyRuntimePaths?: (patch: { kernelDir?: string; configDir?: string }) => Promise<{
    ok: boolean
    error?: string
    root: string
    kernel: string
    config: string
    profiles: string
    activeConfig: string
  }>
  // Persist + apply the Clash API port. Optional: hosts that pin the controller
  // (desktop builds) simply omit the route. 密码不在这里改 —— 面板/内核共用密码
  // 归 /auth/password 管（见 deps.auth），明文永不过浏览器。
  updateClashApi?: (patch: { port?: number }) => Promise<{
    ok: boolean
    error?: string
    externalController?: string
    port?: number
    requiresRestart?: boolean
  }>
  // 面板登录会话。auth 与 sessions 是一对：两个都注入才开会话鉴权（只给一个说明
  // 宿主接错了）；都不给时视为进程内宿主（桌面/测试），不设网络鉴权面。
  auth?: PanelAuth
  sessions?: SessionManager
  // Merged into GET /kernel/status: whether the binary file exists on disk and
  // which release tag was last installed (both live in the agent, not the
  // supervisor state).
  kernelStatusExtras?: () => Promise<{
    binaryExists: boolean
    installedVersion?: string
  }>
  geoFetch?: typeof fetch // override for tests; defaults to global fetch
  storage?: AgentStorage
}

const PREFIX = '/api/control'

export function createControlRouter(deps: ControlRouterDeps): App {
  const app = createApp()
  const router = createRouter()
  const {
    supervisor,
    profiles,
    profileEditor,
    info,
    systemProxy,
    kernelManager,
    tunController,
    geoFetch,
  } = deps

  // ---- Auth middleware: applied to every route except public ones. ----
  // 会话 cookie 优先，其次才是宿主注入的静态 token（桌面/CLI 客户端）。两者都没
  // 配时不能默认放行：放行与否取决于这个宿主有没有开面板鉴权。
  const { auth, sessions } = deps
  const authEnabled = !!auth && !!sessions

  function isPublic(path: string): boolean {
    if (path === `${PREFIX}/health` || path === `${PREFIX}/info`) return true
    // 登录页要在拿到会话之前问「要不要设密码」，所以状态与登录本身必须敞开。
    return authEnabled && (path === `${PREFIX}/auth/status` || path === `${PREFIX}/auth/login`)
  }

  function authorized(event: H3Event): boolean {
    if (sessions?.verify(getCookie(event, SESSION_COOKIE))) return true
    const token = deps.token
    if (token) {
      // 静态 Bearer 只走请求头：面板全程用会话 cookie，把 token 放进 query 只会
      // 让它出现在访问日志里。
      return getHeader(event, 'authorization') === `Bearer ${token}`
    }
    return !authEnabled
  }

  app.use(
    defineEventHandler((event) => {
      const path = (event.path ?? '').split('?')[0] ?? ''
      if (!path.startsWith(PREFIX)) return
      if (isPublic(path)) return
      if (!authorized(event)) {
        setResponseStatus(event, 401)
        return { error: 'unauthorized' }
      }
    }),
  )

  // ---- Panel auth (session cookie) ----
  // 密码只有 agent 持有：/auth/status 报 needsSetup，/auth/login 校验并签发 7 天
  // 会话 cookie，全程不下发明文。
  if (auth && sessions) {
    // 登录成功即发 cookie；反向代理终止 TLS 时靠 X-Forwarded-Proto 判 https。
    const issueSession = (event: H3Event) => {
      const value = sessions.issue()
      if (!value) return
      setCookie(event, SESSION_COOKIE, value, {
        maxAge: SESSION_MAX_AGE_SECONDS,
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: getHeader(event, 'x-forwarded-proto') === 'https',
      })
    }

    router.get(
      `${PREFIX}/auth/status`,
      defineEventHandler((event) => ({
        needsSetup: auth.needsSetup(),
        authenticated: sessions.verify(getCookie(event, SESSION_COOKIE)),
      })),
    )
    router.post(
      `${PREFIX}/auth/login`,
      defineEventHandler(async (event) => {
        const body = (await readBody(event).catch(() => ({}))) as { password?: unknown }
        const result = await auth.login(typeof body?.password === 'string' ? body.password : '')
        // 密码错也回 200 + { ok:false }：控制接口的业务失败一律用这个形状，
        // 前端不必为了读 error 去解析 ky 抛出的 HTTPError。
        if (result.ok) issueSession(event)
        return result
      }),
    )
    router.post(
      `${PREFIX}/auth/logout`,
      defineEventHandler((event) => {
        setCookie(event, SESSION_COOKIE, '', { maxAge: 0, path: '/', httpOnly: true })
        return { ok: true }
      }),
    )
    // 改密 = 换签名密钥，之前签发的 cookie 全部作废，所以给当前浏览器补发一张。
    router.put(
      `${PREFIX}/auth/password`,
      defineEventHandler(async (event) => {
        const body = (await readBody(event).catch(() => ({}))) as {
          currentPassword?: unknown
          newPassword?: unknown
        }
        const result = await auth.changePassword(
          typeof body?.currentPassword === 'string' ? body.currentPassword : '',
          typeof body?.newPassword === 'string' ? body.newPassword : '',
        )
        if (result.ok) issueSession(event)
        return result
      }),
    )
  }

  // ---- Health + info ----
  router.get(
    `${PREFIX}/health`,
    defineEventHandler(() => ({ ok: true })),
  )
  router.get(
    `${PREFIX}/info`,
    defineEventHandler(() => info()),
  )
  router.get(
    `${PREFIX}/runtime`,
    defineEventHandler(() => (info() as { runtime: unknown }).runtime),
  )
  router.get(
    `${PREFIX}/storage/kv`,
    defineEventHandler(async (event) => {
      if (!deps.storage) return { value: null }
      const query = getQuery(event)
      // 导出用 prefix 一次取整段，避免前端为几十个键发几十个请求。prefix 只要出现
      // 就走列表分支（空串即全库），不能再拿真值判断，否则全库导出会被当成缺参数。
      if (query.prefix !== undefined) {
        const entries = await deps.storage.list(String(query.prefix))
        // 密码在服务端就被挡下：即使前端的导出过滤哪天漏了，全库读也拿不到明文凭证。
        for (const key of CREDENTIAL_KV_KEYS) delete entries[key]
        return { entries }
      }
      const key = String(query.key || '')
      if (!key) throw createError({ statusCode: 400, statusMessage: 'key or prefix is required' })
      if (CREDENTIAL_KV_KEYS.has(key)) return { value: null }
      return { value: await deps.storage.get(key) }
    }),
  )
  router.put(
    `${PREFIX}/storage/kv`,
    defineEventHandler(async (event) => {
      if (!deps.storage)
        throw createError({ statusCode: 503, statusMessage: 'storage unavailable' })
      const body = (await readBody(event)) as {
        key?: string
        value?: string
        entries?: Record<string, string>
      }
      // 导入设置：一整段一次写，只碰点名的键，不隐式清空其它键。
      if (body.entries) {
        assertNonCredentialKeys(Object.keys(body.entries))
        const entries = Object.fromEntries(
          Object.entries(body.entries).filter(([, value]) => typeof value === 'string'),
        )
        if (Object.keys(entries).length === 0) {
          throw createError({ statusCode: 400, statusMessage: 'entries must hold string values' })
        }
        await deps.storage.putMany(entries)
        return { ok: true, written: Object.keys(entries).length }
      }
      if (!body.key || typeof body.value !== 'string') {
        throw createError({ statusCode: 400, statusMessage: 'key and value are required' })
      }
      assertNonCredentialKeys([body.key])
      await deps.storage.set(body.key, body.value)
      return { ok: true }
    }),
  )
  router.delete(
    `${PREFIX}/storage/kv`,
    defineEventHandler(async (event) => {
      if (!deps.storage)
        throw createError({ statusCode: 503, statusMessage: 'storage unavailable' })
      const key = String(getQuery(event).key || '')
      if (!key) throw createError({ statusCode: 400, statusMessage: 'key is required' })
      assertNonCredentialKeys([key])
      await deps.storage.delete(key)
      return { ok: true }
    }),
  )
  router.post(
    `${PREFIX}/runtime/root`,
    defineEventHandler(async (event) => {
      const body = (await readBody(event)) as { root?: string }
      if (!deps.setRuntimeRoot) {
        return {
          ok: false,
          error: 'runtime root configuration is unavailable',
        }
      }
      return deps.setRuntimeRoot(body.root || '')
    }),
  )
  // Relocate kernel storage / config dirs from the settings page. Paths take
  // effect on the NEXT kernel start (the live process keeps its own paths).
  router.put(
    `${PREFIX}/runtime/paths`,
    defineEventHandler(async (event) => {
      if (!deps.applyRuntimePaths) {
        return {
          ok: false,
          error: 'runtime path configuration is unavailable',
        }
      }
      const body = (await readBody(event).catch(() => ({}))) as {
        kernelDir?: string
        configDir?: string
      }
      const patch: { kernelDir?: string; configDir?: string } = {}
      if (typeof body?.kernelDir === 'string') patch.kernelDir = body.kernelDir
      if (typeof body?.configDir === 'string') patch.configDir = body.configDir
      return deps.applyRuntimePaths(patch)
    }),
  )

  // ---- Kernel ----
  router.get(
    `${PREFIX}/kernel/status`,
    defineEventHandler(async () => ({
      ...supervisor.getState(),
      // state 里没有明文密码（见 MihomoSupervisor.getControllerSecret），浏览器只
      // 需要知道「有没有设密码」来决定占位符文案。
      secretSet: supervisor.getControllerSecret().length > 0,
      ...(await deps.kernelStatusExtras?.()),
    })),
  )
  router.post(
    `${PREFIX}/kernel/start`,
    defineEventHandler(() => supervisor.start()),
  )
  router.post(
    `${PREFIX}/kernel/stop`,
    defineEventHandler(() => supervisor.stop()),
  )
  router.post(
    `${PREFIX}/kernel/restart`,
    defineEventHandler(() => supervisor.restart()),
  )
  router.post(
    `${PREFIX}/kernel/ensure`,
    defineEventHandler(async (event) => {
      if (!deps.ensureKernel) {
        return {
          ok: false,
          error: 'kernel bootstrap is unavailable',
        }
      }
      const body = (await readBody(event).catch(() => ({}))) as EnsureKernelOptions
      // 下载失败不要让 h3 抛成 500：面板只拿得到「HTTP 500」，镜像站断流、TOFU
      // 摘要不符这些真正的原因全丢在响应体里。统一折进 ok:false，沿用同一条提示通路。
      try {
        return await deps.ensureKernel({
          ...(typeof body?.mirror === 'string' ? { mirror: body.mirror } : {}),
          ...(typeof body?.version === 'string' ? { version: body.version } : {}),
          ...(body?.force === true ? { force: true } : {}),
        })
      } catch (error) {
        return { ok: false, error: error instanceof Error ? error.message : String(error) }
      }
    }),
  )
  router.get(
    `${PREFIX}/kernel/ensure/status`,
    defineEventHandler(() => ({ progress: deps.kernelDownloadStatus?.() ?? null })),
  )
  router.post(
    `${PREFIX}/kernel/ensure/cancel`,
    defineEventHandler(() => ({ ok: deps.cancelKernelDownload?.() === true })),
  )
  // Available mihomo release tags (newest first) + whitelisted download
  // mirrors, for the settings-page kernel manager. Network failures degrade to
  // an empty list rather than a 500 so the UI keeps its pinned default.
  router.get(
    `${PREFIX}/kernel/releases`,
    defineEventHandler(async () => {
      const mirrors = Object.keys(KERNEL_MIRRORS)
      try {
        const versions = await listMihomoVersions({ fetch: geoFetch })
        return { ok: true, versions, mirrors }
      } catch (error) {
        return {
          ok: false,
          versions: [],
          mirrors,
          error: error instanceof Error ? error.message : String(error),
        }
      }
    }),
  )
  // 设置页改「Clash API 端口」。改完要不要重启内核由 requiresRestart 说明 ——
  // active.yaml 的托管头是 spawn 时注入的。密码走 /auth/password。
  router.put(
    `${PREFIX}/kernel/api`,
    defineEventHandler(async (event) => {
      if (!deps.updateClashApi) {
        return { ok: false, error: 'kernel api is not manageable on this host' }
      }
      const body = (await readBody(event).catch(() => ({}))) as { port?: unknown }
      if (typeof body?.port !== 'number') {
        throw createError({ statusCode: 400, statusMessage: 'port is required' })
      }
      return deps.updateClashApi({ port: body.port })
    }),
  )
  // Restore the last-known-good active config (the .bak snapshot written by the
  // previous setActive) and restart. Escape hatch for a config that bricks the
  // kernel on boot/restart — a single bad subscription must not lock users out
  // (#2109). 404 when no backup exists.
  router.post(
    `${PREFIX}/kernel/rollback`,
    defineEventHandler(async (event) => {
      const restored = await profiles.rollback()
      if (!restored) {
        setResponseStatus(event, 404)
        return { error: 'no backup config to roll back to' }
      }
      return supervisor.restart()
    }),
  )
  // Reset the active config to a minimal (header-only) file, drop activeId, and
  // restart on mihomo defaults. Last-resort recovery when even the backup is bad
  // — the dashboard reconnects and the user can re-import a profile (#2109).
  router.post(
    `${PREFIX}/kernel/recover`,
    defineEventHandler(async () => {
      await profiles.resetActive()
      return supervisor.restart()
    }),
  )

  // ---- Kernel logs (SSE) ----
  router.get(
    `${PREFIX}/kernel/logs`,
    defineEventHandler((event) => {
      const stream = createEventStream(event)
      const onLog = (l: KernelLogLine) => stream.push(JSON.stringify({ type: 'log', ...l }))
      const onState = (s: KernelState) => stream.push(JSON.stringify({ type: 'state', ...s }))
      supervisor.on('log', onLog)
      supervisor.on('state', onState)
      // Detach on disconnect. Without this, every EventSource reconnect
      // (navigation, kernel restart, network blip, HMR) permanently adds two
      // more closures to the supervisor's callback sets — an unbounded leak on
      // the hottest path, fanning push() out to long-dead streams forever.
      stream.onClosed(() => {
        supervisor.off('log', onLog)
        supervisor.off('state', onState)
      })
      // Seed with current state so a late subscriber knows where things stand.
      stream.push(JSON.stringify({ type: 'state', ...supervisor.getState() }))
      return stream.send()
    }),
  )

  // Validate a freshly composed active config BEFORE restarting, so an invalid
  // candidate cannot replace the running config and brick the kernel across
  // restarts (#2109). On failure, restore the prior state (previous active id,
  // or the last-known-good .bak snapshot written by setActive when there was no
  // prior active profile) and surface the validator's message as a clean 400.
  async function safeActivate(id: string): Promise<KernelState> {
    const previousActiveId = await profiles.getActiveId()
    try {
      await profiles.setActive(id)
    } catch (error) {
      if (error instanceof ConfigPatchConflictError) {
        throw createError({
          statusCode: 409,
          statusMessage: 'profile editor conflict',
          data: { error: error.message, conflicts: error.conflicts },
        })
      }
      throw error
    }
    const validation = await supervisor.validate(deps.activeConfigPath)
    if (validation.valid) return supervisor.restart()
    if (previousActiveId && previousActiveId !== id) {
      // Re-compose the previously-active profile (best-effort — a failure here
      // must not mask the original validation error).
      await profiles.setActive(previousActiveId).catch(() => {})
    } else {
      // No prior profile to fall back to (first activation) or re-activating the
      // same id: restore the pre-activation file from the .bak snapshot.
      await profiles.rollback().catch(() => {})
    }
    throw createError({
      statusCode: 400,
      statusMessage: 'profile validation failed',
      data: { error: validation.message },
    })
  }

  // ---- Profiles ----
  // Attach an `active` flag to each entry so the UI can persistently mark the
  // currently-active base profile (the store tracks activeId in state.json but
  // the raw list never exposed it, so the badge vanished after every reload
  // (#2148)). Derived here — never persisted into index.json.
  router.get(
    `${PREFIX}/profiles`,
    defineEventHandler(async () => {
      const [list, activeId] = await Promise.all([profiles.list(), profiles.getActiveId()])
      return list.map((p) => ({ ...p, active: p.id === activeId }))
    }),
  )
  router.post(
    `${PREFIX}/profiles`,
    defineEventHandler(async (event) => {
      const body = (await readBody(event)) as {
        name: string
        content?: string
        type?: 'local' | 'merge' | 'script'
      }
      return profiles.create(body)
    }),
  )
  router.get(
    `${PREFIX}/profiles/:id`,
    defineEventHandler(async (event) => {
      const id = getRouterParam(event, 'id')!
      const [meta, content] = await Promise.all([
        profiles.list().then((l) => l.find((m) => m.id === id)),
        profiles.read(id),
      ])
      return { meta, content }
    }),
  )
  router.put(
    `${PREFIX}/profiles/:id`,
    defineEventHandler(async (event) => {
      const id = getRouterParam(event, 'id')!
      const body = (await readBody(event)) as {
        name?: string
        content?: string
        enabled?: boolean
        // minutes; remote-only. 0 disables auto-update; omit leaves it untouched.
        updateInterval?: number
      }
      const meta = (await profiles.list()).find((item) => item.id === id)
      if (meta?.managedBy === 'visual-editor') {
        throw createError({
          statusCode: 403,
          statusMessage: 'managed visual editor overlays are read-only',
        })
      }
      return profiles.update(id, body)
    }),
  )
  router.delete(
    `${PREFIX}/profiles/:id`,
    defineEventHandler(async (event) => {
      const id = getRouterParam(event, 'id')!
      await profiles.delete(id)
      return sendNoContent(event)
    }),
  )
  router.post(
    `${PREFIX}/profiles/:id/duplicate`,
    defineEventHandler(async (event) => {
      const id = getRouterParam(event, 'id')!
      const body = (await readBody(event).catch(() => ({}))) as {
        name?: string
      }
      return profiles.duplicate(id, body?.name)
    }),
  )
  router.post(
    `${PREFIX}/profiles/import`,
    defineEventHandler(async (event) => {
      const body = (await readBody(event)) as { url: string; name?: string }
      return withSubscriptionHttpError(() => profiles.importFromUrl(body.url, body.name))
    }),
  )
  // Server-side subscription fetch proxy: the browser cannot fetch most
  // providers directly (no CORS headers), so the panel's subscription tab pulls
  // through here. Returns raw content only — nothing is persisted.
  router.post(
    `${PREFIX}/subscriptions/fetch`,
    defineEventHandler(async (event) => {
      const body = (await readBody(event)) as { url?: string }
      const url = body?.url ?? ''
      if (!/^https?:\/\//i.test(url)) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid subscription url',
          data: { error: 'url must be an absolute http(s) URL' },
        })
      }
      const content = await withSubscriptionHttpError(() => profiles.fetchContent(url))
      return { ok: true, content }
    }),
  )
  router.post(
    `${PREFIX}/profiles/:id/refresh`,
    defineEventHandler(async (event) => {
      const id = getRouterParam(event, 'id')!
      // Pure refresh: re-fetch the remote subscription in place and return the
      // updated meta. This does NOT touch the running config — pair it with
      // activate, or use /refresh-and-activate for a combined apply (#2108).
      return withSubscriptionHttpError(() => profiles.refresh(id))
    }),
  )
  // Combined refresh + apply: re-fetch the subscription, compose it into
  // active.yaml, validate, and restart — the action users expect from "refresh
  // my subscription and make it take effect" (#2108). Returns both the refreshed
  // meta and the resulting KernelState. Kept separate from /refresh so the pure
  // re-fetch path keeps its stable ProfileMeta response shape.
  router.post(
    `${PREFIX}/profiles/:id/refresh-and-activate`,
    defineEventHandler(async (event) => {
      const id = getRouterParam(event, 'id')!
      const meta = await withSubscriptionHttpError(() => profiles.refresh(id))
      const kernel = await safeActivate(id)
      return { meta, kernel }
    }),
  )
  router.post(
    `${PREFIX}/profiles/:id/activate`,
    defineEventHandler(async (event) => {
      const id = getRouterParam(event, 'id')!
      return safeActivate(id)
    }),
  )
  router.post(
    `${PREFIX}/profiles/:id/validate`,
    defineEventHandler(async (event) => {
      const id = getRouterParam(event, 'id')!
      const content = await profiles.read(id)
      // Materialize a temp candidate file so `mihomo -t -f <path>` runs against a
      // real config (the route carries no body — the id is the source of truth).
      const candidate = join(deps.homeDir, `.validate-${id}.yaml`)
      await writeFile(candidate, content)
      try {
        return await supervisor.validate(candidate)
      } finally {
        await rm(candidate, { force: true })
      }
    }),
  )

  // ---- Visual profile editor (Agent only) ----
  if (profileEditor) {
    const readEditorPatch = async (event: H3Event): Promise<ConfigPatchV1> => {
      const body = (await readBody(event)) as { patch?: ConfigPatchV1 }
      if (body.patch?.version !== 1 || !Array.isArray(body.patch.operations)) {
        throw createError({
          statusCode: 400,
          statusMessage: 'invalid visual editor patch',
        })
      }
      return body.patch
    }
    const withEditorError = async <T>(action: () => Promise<T>): Promise<T> => {
      try {
        return await action()
      } catch (error) {
        if (error instanceof ProfileEditorConflictError) {
          throw createError({
            statusCode: 409,
            statusMessage: 'profile editor conflict',
            data: { error: error.message, conflicts: error.conflicts },
          })
        }
        if (error instanceof ProfileEditorValidationError) {
          throw createError({
            statusCode: 400,
            statusMessage: 'profile editor validation failed',
            data: {
              error: error.message,
              diagnostics: error.diagnostics,
              validatorMessage: error.validatorMessage,
            },
          })
        }
        throw error
      }
    }

    router.get(
      `${PREFIX}/profiles/:id/editor`,
      defineEventHandler((event) => {
        const id = getRouterParam(event, 'id')!
        return withEditorError(() => profileEditor.open(id))
      }),
    )
    router.post(
      `${PREFIX}/profiles/:id/editor/preview`,
      defineEventHandler(async (event) => {
        const id = getRouterParam(event, 'id')!
        const patch = await readEditorPatch(event)
        return withEditorError(() => profileEditor.preview(id, patch))
      }),
    )
    router.put(
      `${PREFIX}/profiles/:id/editor`,
      defineEventHandler(async (event) => {
        const id = getRouterParam(event, 'id')!
        const patch = await readEditorPatch(event)
        return withEditorError(() => profileEditor.apply(id, patch))
      }),
    )
    router.delete(
      `${PREFIX}/profiles/:id/editor/overlay`,
      defineEventHandler(async (event) => {
        const id = getRouterParam(event, 'id')!
        const kernel = await withEditorError(() => profileEditor.resetManagedOverlay(id))
        return kernel ?? { ok: true }
      }),
    )
  }

  // ---- Active config ----
  router.get(
    `${PREFIX}/config`,
    defineEventHandler(async (event) => {
      const activeId = await profiles.getActiveId()
      setResponseHeader(event, 'content-type', 'text/yaml')
      return activeId ? profiles.read(activeId) : ''
    }),
  )
  router.put(
    `${PREFIX}/config`,
    defineEventHandler(async (event) => {
      const activeId = await profiles.getActiveId()
      if (!activeId) {
        setResponseStatus(event, 409)
        return { error: 'no active profile' }
      }
      const body = (await readBody(event)) as { content: string }
      await profiles.update(activeId, { content: body.content })
      await profiles.setActive(activeId)
      return supervisor.restart()
    }),
  )

  // GET /config 返回 profile 源文本。曾经并存的 GET /config/runtime 返回内核实际
  // 加载的 active.yaml，而 supervisor 会往里注入 `secret:`（= 面板密码），等于把
  // 密码发给任何登录态请求，所以该路由连同 'runtime-config' 能力一起删掉了。
  // ---- Config sections (top-level key read/write on the active profile) ----
  // GET reads one parsed section (null when absent / no active profile). PUT
  // replaces that section on the active profile content, then re-activates
  // (re-composes + writes activeConfigPath) and restarts the kernel.
  router.get(
    `${PREFIX}/config/section`,
    defineEventHandler(async (event) => {
      const key = String(getQuery(event).key ?? '')
      const activeId = await profiles.getActiveId()
      const value = activeId ? await profiles.getSection(activeId, key) : null
      // Serialize explicitly so an absent section / no-active-profile still
      // yields a JSON `null` body (h3 would 204 a bare null return).
      setResponseHeader(event, 'content-type', 'application/json')
      return JSON.stringify(value ?? null)
    }),
  )
  router.put(
    `${PREFIX}/config/section`,
    defineEventHandler(async (event) => {
      const activeId = await profiles.getActiveId()
      if (!activeId) {
        setResponseStatus(event, 409)
        return { error: 'no active profile' }
      }
      const body = (await readBody(event)) as {
        key: string
        value: unknown
        // `false` writes the section back to the active profile WITHOUT
        // restarting the kernel — used by the general-config card, which already
        // hot-applies each field via PATCH /configs and only needs the change
        // persisted so it survives the next restart (#2070). Defaults to true:
        // the rule/network editors restart once per save.
        restart?: boolean
      }
      await profiles.setSection(activeId, body.key, body.value)
      await profiles.setActive(activeId)
      if (body.restart === false) return supervisor.getState()
      return supervisor.restart()
    }),
  )

  // ---- Geo assets (always available — backed by homeDir + fetch) ----
  router.post(
    `${PREFIX}/geo/update`,
    defineEventHandler(async () => {
      const { files } = await fetchGeoAssets(deps.homeDir, { fetch: geoFetch })
      return { ok: true, files }
    }),
  )

  // ---- System proxy (capability-gated) ----
  if (systemProxy) {
    router.get(
      `${PREFIX}/sysproxy`,
      defineEventHandler(async () => ({
        enabled: await systemProxy.isEnabled(),
        ...systemProxy.describe(),
      })),
    )
    router.post(
      `${PREFIX}/sysproxy`,
      defineEventHandler(async (event) => {
        const body = (await readBody(event)) as {
          enabled: boolean
          bypass?: string[]
          // 'fixed' (default) = manual host:port proxy; 'pac' = auto-config URL.
          mode?: 'fixed' | 'pac'
          pacUrl?: string
        }
        // Record an explicitly applied bypass list as the new default FIRST, so
        // it sticks even when this apply lands while the proxy is off (the
        // disable() branch takes no list — without this the edit evaporated).
        if (body.bypass && body.bypass.length > 0) {
          systemProxy.setDefaultBypass?.(body.bypass)
        }
        if (body.mode === 'pac') {
          if (body.enabled) {
            if (!body.pacUrl) {
              setResponseStatus(event, 400)
              return { error: 'pacUrl required for pac mode' }
            }
            await systemProxy.setAutoProxy(body.pacUrl)
          } else {
            await systemProxy.disableAutoProxy()
          }
        } else if (body.enabled) {
          await systemProxy.enable(body.bypass)
        } else {
          await systemProxy.disable()
        }
        return {
          enabled: await systemProxy.isEnabled(),
          ...systemProxy.describe(),
        }
      }),
    )
  } else {
    // No controller injected — respond with a clean 404 JSON for both verbs so the
    // shared UI can detect the missing capability without a router-default 404 shape.
    const unavailable = defineEventHandler((event) => {
      setResponseStatus(event, 404)
      return { error: 'system-proxy unavailable' }
    })
    router.get(`${PREFIX}/sysproxy`, unavailable)
    router.post(`${PREFIX}/sysproxy`, unavailable)
  }

  // ---- Kernel version management (capability-gated) ----
  if (kernelManager) {
    router.get(
      `${PREFIX}/kernel/versions`,
      defineEventHandler(() => kernelManager.listVersions()),
    )
    router.post(
      `${PREFIX}/kernel/switch`,
      defineEventHandler(async (event) => {
        const body = (await readBody(event)) as { version: string }
        await kernelManager.switch(body.version)
        return { ok: true }
      }),
    )
  } else {
    // No manager injected — clean 404 JSON for both routes so the shared UI can
    // detect the missing capability without a router-default 404 shape.
    const unavailable = defineEventHandler((event) => {
      setResponseStatus(event, 404)
      return { error: 'kernel-version unavailable' }
    })
    router.get(`${PREFIX}/kernel/versions`, unavailable)
    router.post(`${PREFIX}/kernel/switch`, unavailable)
  }

  // ---- TUN mode (capability-gated) ----
  // Clean 404 JSON so the shared UI can detect a missing capability/route without
  // a router-default 404 shape (used for an absent controller AND for an
  // uninstall route the controller doesn't support).
  const tunUnavailable = defineEventHandler((event) => {
    setResponseStatus(event, 404)
    return { error: 'tun unavailable' }
  })
  if (tunController) {
    const { uninstall } = tunController
    router.get(
      `${PREFIX}/tun`,
      defineEventHandler(() => tunController.status()),
    )
    router.post(
      `${PREFIX}/tun`,
      defineEventHandler(async (event) => {
        const body = (await readBody(event)) as {
          enabled: boolean
          stack?: string
        }
        try {
          if (body.enabled) {
            await tunController.enable({ stack: body.stack ?? '' })
          } else {
            await tunController.disable()
          }
        } catch (err) {
          // A precondition failure (e.g. enabling TUN with no active profile) is
          // user-actionable, not a server fault — return a clean, HANDLED 4xx
          // carrying the reason instead of letting H3 log it as an [unhandled]
          // 500. Genuine failures (elevation denied, kernel crash) keep
          // propagating untouched so they stay loud.
          if (err instanceof TunPreconditionError) {
            throw createError({
              statusCode: err.statusCode,
              statusMessage: err.message,
              data: { error: err.message },
            })
          }
          throw err
        }
        return tunController.status()
      }),
    )
    // Remove the privileged helper service entirely. Only registered when the
    // controller supports it (desktop wires installer.uninstall); otherwise the
    // route 404s so the UI can hide the action.
    router.post(
      `${PREFIX}/tun/uninstall`,
      uninstall
        ? defineEventHandler(async () => {
            await uninstall()
            return tunController.status()
          })
        : tunUnavailable,
    )
  } else {
    router.get(`${PREFIX}/tun`, tunUnavailable)
    router.post(`${PREFIX}/tun`, tunUnavailable)
    router.post(`${PREFIX}/tun/uninstall`, tunUnavailable)
  }

  app.use(router)
  return app
}
