import { toNodeListener } from 'h3'
import { Buffer } from 'node:buffer'
import { mkdtempSync, readdirSync } from 'node:fs'
import { createServer } from 'node:http'
import type { AddressInfo } from 'node:net'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ControlRouterDeps } from './http'
import { createControlRouter } from './http'
import { ProfileEditorConflictError } from './profile-editor'
import { SubscriptionFetchError } from './profiles'
import type { PanelAuth } from './session'
import { createSessionManager } from './session'
import { TunPreconditionError } from './tun'
import type { KernelState, ProfileMeta } from './types'

function fakeState(over: Partial<KernelState> = {}): KernelState {
  return {
    status: 'stopped',
    externalController: '127.0.0.1:9090',
    ...over,
  }
}

function makeSystemProxy(enabled = false) {
  return {
    isEnabled: vi.fn(async () => enabled),
    enable: vi.fn(async () => {}),
    disable: vi.fn(async () => {}),
    setAutoProxy: vi.fn(async () => {}),
    disableAutoProxy: vi.fn(async () => {}),
    describe: vi.fn(() => ({ port: 7890, bypass: ['localhost', '127.0.0.1'] })),
  }
}

function makeDeps(token?: string) {
  const state = fakeState()
  const supervisor = {
    getState: vi.fn(() => state),
    getControllerSecret: vi.fn(() => 'sek'),
    start: vi.fn(async () => fakeState({ status: 'running', pid: 1, version: '1.19.27' })),
    stop: vi.fn(async () => fakeState({ status: 'stopped' })),
    restart: vi.fn(async () => fakeState({ status: 'running', pid: 2 })),
    validate: vi.fn(async () => ({ valid: true, message: 'ok' })),
    on: vi.fn(),
    off: vi.fn(),
    dispose: vi.fn(),
  }
  const profileList: ProfileMeta[] = [{ id: 'p1', name: 'home', type: 'local', updatedAt: 1 }]
  const profiles = {
    list: vi.fn(async () => profileList),
    read: vi.fn(async () => 'mixed-port: 7890\n'),
    create: vi.fn(async (i: { name: string }) => ({
      id: 'p2',
      name: i.name,
      type: 'local' as const,
      updatedAt: 2,
    })),
    update: vi.fn(async () => ({
      id: 'p1',
      name: 'x',
      type: 'local' as const,
      updatedAt: 3,
    })),
    delete: vi.fn(async () => {}),
    duplicate: vi.fn(async () => ({
      id: 'p3',
      name: 'home copy',
      type: 'local' as const,
      updatedAt: 4,
    })),
    importFromUrl: vi.fn(async () => ({
      id: 'p4',
      name: 'sub',
      type: 'remote' as const,
      updatedAt: 5,
    })),
    refresh: vi.fn(async (id: string) => ({
      id,
      name: 'sub',
      type: 'remote' as const,
      url: 'https://sub',
      updatedAt: 6,
      subscriptionInfo: {
        upload: 1,
        download: 2,
        total: 3,
        expire: 4,
      },
    })),
    getActiveId: vi.fn(async (): Promise<string | undefined> => undefined),
    setActive: vi.fn(async () => {}),
    rollback: vi.fn(async () => true),
    resetActive: vi.fn(async () => {}),
    getSection: vi.fn(async (): Promise<unknown> => null),
    setSection: vi.fn(async () => {}),
  }
  const info = vi.fn(() => ({
    hasAgent: true,
    version: '0.0.0',
    platform: { os: 'linux', arch: 'x64' },
    kernel: { bundled: true, path: '/bin/mihomo', version: '1.19.27' },
    features: ['profiles', 'logs-sse', 'kernel-control'],
  }))
  const kv = new Map([
    ['config/theme', '"dark"'],
    ['config/api-port', '"9090"'],
    ['nodePools', '[]'],
  ])
  const storage = {
    get: vi.fn(async (key: string) => kv.get(key) ?? null),
    set: vi.fn(async (key: string, value: string) => {
      kv.set(key, value)
    }),
    putMany: vi.fn(async (values: Record<string, string>) => {
      for (const [key, value] of Object.entries(values)) kv.set(key, value)
    }),
    list: vi.fn(async (prefix: string) =>
      Object.fromEntries([...kv].filter(([key]) => key.startsWith(prefix))),
    ),
    delete: vi.fn(async (key: string) => {
      kv.delete(key)
    }),
  }
  const homeDir = mkdtempSync(join(tmpdir(), 'mcxd-http-'))
  const activeConfigPath = join(homeDir, 'active.yaml')
  return { supervisor, profiles, info, storage, homeDir, activeConfigPath, token }
}

// extra：只给少数用例注入可选依赖（auth/sessions/updateClashApi），不掺进 makeDeps
// 的返回类型，否则那些 vi.fn() 的 mock 方法就从类型上消失了。
async function mount(deps: ReturnType<typeof makeDeps>, extra: Partial<ControlRouterDeps> = {}) {
  const app = createControlRouter({ ...deps, ...extra } as never)
  const server = createServer(toNodeListener(app))
  await new Promise<void>((r) => server.listen(0, r))
  const { port } = server.address() as AddressInfo
  return {
    base: `http://127.0.0.1:${port}`,
    close: () => new Promise<void>((r) => server.close(() => r())),
  }
}

describe('createControlRouter — info + kernel + auth', () => {
  let srv: Awaited<ReturnType<typeof mount>>
  afterEach(async () => srv?.close())

  it('gET /api/control/health is public 200', async () => {
    srv = await mount(makeDeps('tok'))
    const res = await fetch(`${srv.base}/api/control/health`)
    expect(res.status).toBe(200)
  })

  it('gET /api/control/info returns the capability shape', async () => {
    srv = await mount(makeDeps())
    const res = await fetch(`${srv.base}/api/control/info`)
    expect(res.status).toBe(200)
    const body = (await res.json()) as Record<string, unknown>
    expect(body.hasAgent).toBe(true)
    expect(body.features).toContain('kernel-control')
    expect(body.platform).toMatchObject({ os: 'linux', arch: 'x64' })
  })

  it('protected route returns 401 without Bearer when token set', async () => {
    srv = await mount(makeDeps('tok'))
    const res = await fetch(`${srv.base}/api/control/kernel/status`)
    expect(res.status).toBe(401)
  })

  it('protected route returns 200 with correct Bearer', async () => {
    srv = await mount(makeDeps('tok'))
    const res = await fetch(`${srv.base}/api/control/kernel/status`, {
      headers: { Authorization: 'Bearer tok' },
    })
    expect(res.status).toBe(200)
    expect(((await res.json()) as Record<string, unknown>).status).toBe('stopped')
  })

  it('wrong Bearer returns 401', async () => {
    srv = await mount(makeDeps('tok'))
    const res = await fetch(`${srv.base}/api/control/kernel/status`, {
      headers: { Authorization: 'Bearer nope' },
    })
    expect(res.status).toBe(401)
  })

  it('no token configured (in-process) skips auth', async () => {
    srv = await mount(makeDeps())
    const res = await fetch(`${srv.base}/api/control/kernel/status`)
    expect(res.status).toBe(200)
  })

  it('gET kernel/status reports secretSet, never the plaintext secret', async () => {
    srv = await mount(makeDeps())
    const res = await fetch(`${srv.base}/api/control/kernel/status`)
    const body = (await res.json()) as Record<string, unknown>
    expect(body.secretSet).toBe(true)
    expect('secret' in body).toBe(false)
  })

  it('gET storage/kv?prefix= returns just that prefix', async () => {
    srv = await mount(makeDeps())
    const res = await fetch(`${srv.base}/api/control/storage/kv?prefix=config/`)
    expect(await res.json()).toEqual({
      entries: { 'config/theme': '"dark"', 'config/api-port': '"9090"' },
    })
  })

  it('gET storage/kv?prefix= with an empty prefix returns the whole database', async () => {
    srv = await mount(makeDeps())
    // 导出走的就是这一条：prefix 只要出现就走列表分支，空串不能被当成缺参数。
    const res = await fetch(`${srv.base}/api/control/storage/kv?prefix=`)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      entries: { 'config/theme': '"dark"', 'config/api-port': '"9090"', nodePools: '[]' },
    })
  })

  it('pUT storage/kv entries writes the whole batch in one call', async () => {
    const deps = makeDeps()
    srv = await mount(deps)
    const res = await fetch(`${srv.base}/api/control/storage/kv`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        entries: { 'config/theme': '"light"', 'config/new-key': '"1"' },
      }),
    })
    expect(res.status).toBe(200)
    expect(deps.storage.putMany).toHaveBeenCalledWith({
      'config/theme': '"light"',
      'config/new-key': '"1"',
    })
  })

  it('pUT storage/kv rejects a batch with no string values', async () => {
    const deps = makeDeps()
    srv = await mount(deps)
    const res = await fetch(`${srv.base}/api/control/storage/kv`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ entries: { 'config/theme': 42 } }),
    })
    expect(res.status).toBe(400)
    expect(deps.storage.putMany).not.toHaveBeenCalled()
  })

  // 面板密码 = 内核 Clash API secret，浏览器只该签发会话、永不该读写它。
  it('gET storage/kv never leaks credential keys', async () => {
    const deps = makeDeps()
    await deps.storage.set('setup/panel-password', '"1234"')
    srv = await mount(deps)
    const all = await fetch(`${srv.base}/api/control/storage/kv?prefix=`)
    expect(Object.keys((await all.json()).entries)).not.toContain('setup/panel-password')
    const single = await fetch(`${srv.base}/api/control/storage/kv?key=setup%2Fpanel-password`)
    expect((await single.json()).value).toBeNull()
  })

  it('pUT storage/kv refuses batches that carry credentials', async () => {
    const deps = makeDeps()
    srv = await mount(deps)
    const res = await fetch(`${srv.base}/api/control/storage/kv`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        entries: { 'config/theme': '"light"', 'setup/panel-password': '"evil"' },
      }),
    })
    expect(res.status).toBe(400)
    // 整批一起拒：只偷偷剔掉凭证键会把「导入没生效」变成静默的半截写入。
    expect(deps.storage.putMany).not.toHaveBeenCalled()
  })

  it('pUT storage/kv refuses a single credential key', async () => {
    const deps = makeDeps()
    srv = await mount(deps)
    const res = await fetch(`${srv.base}/api/control/storage/kv`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ key: 'setup/panel-password', value: '"evil"' }),
    })
    expect(res.status).toBe(400)
    expect(deps.storage.set).not.toHaveBeenCalled()
  })

  it('dELETE storage/kv refuses to drop the panel password', async () => {
    const deps = makeDeps()
    srv = await mount(deps)
    const res = await fetch(`${srv.base}/api/control/storage/kv?key=setup%2Fpanel-password`, {
      method: 'DELETE',
    })
    expect(res.status).toBe(400)
    expect(deps.storage.delete).not.toHaveBeenCalled()
  })

  it('pOST kernel start/stop/restart return KernelState', async () => {
    const deps = makeDeps()
    srv = await mount(deps)
    const start = await fetch(`${srv.base}/api/control/kernel/start`, {
      method: 'POST',
    })
    expect(((await start.json()) as Record<string, unknown>).status).toBe('running')
    expect(deps.supervisor.start).toHaveBeenCalledOnce()

    const stop = await fetch(`${srv.base}/api/control/kernel/stop`, {
      method: 'POST',
    })
    expect(((await stop.json()) as Record<string, unknown>).status).toBe('stopped')

    const restart = await fetch(`${srv.base}/api/control/kernel/restart`, {
      method: 'POST',
    })
    expect(((await restart.json()) as Record<string, unknown>).status).toBe('running')
  })
})

describe('createControlRouter — profiles + SSE', () => {
  let srv: Awaited<ReturnType<typeof mount>>
  afterEach(async () => srv?.close())

  it('gET /api/control/profiles returns ProfileMeta[]', async () => {
    srv = await mount(makeDeps())
    const res = await fetch(`${srv.base}/api/control/profiles`)
    expect(res.status).toBe(200)
    const body = (await res.json()) as unknown[]
    expect(Array.isArray(body)).toBe(true)
    expect(body[0]).toMatchObject({ id: 'p1', name: 'home' })
  })

  it('pOST /api/control/profiles creates from {name, content?}', async () => {
    const deps = makeDeps()
    srv = await mount(deps)
    const res = await fetch(`${srv.base}/api/control/profiles`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'new', content: 'a: 1\n' }),
    })
    expect(res.status).toBe(200)
    expect(deps.profiles.create).toHaveBeenCalledWith({
      name: 'new',
      content: 'a: 1\n',
    })
    expect(((await res.json()) as Record<string, unknown>).name).toBe('new')
  })

  it('pOST /api/control/profiles passes through type for merge profiles', async () => {
    const deps = makeDeps()
    srv = await mount(deps)
    const res = await fetch(`${srv.base}/api/control/profiles`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: 'overlay',
        content: 'a: 1\n',
        type: 'merge',
      }),
    })
    expect(res.status).toBe(200)
    expect(deps.profiles.create).toHaveBeenCalledWith({
      name: 'overlay',
      content: 'a: 1\n',
      type: 'merge',
    })
  })

  it('pUT /api/control/profiles/:id passes through enabled', async () => {
    const deps = makeDeps()
    srv = await mount(deps)
    const res = await fetch(`${srv.base}/api/control/profiles/p1`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ enabled: false }),
    })
    expect(res.status).toBe(200)
    expect(deps.profiles.update).toHaveBeenCalledWith('p1', { enabled: false })
  })

  it('gET /api/control/profiles/:id returns { meta, content }', async () => {
    srv = await mount(makeDeps())
    const res = await fetch(`${srv.base}/api/control/profiles/p1`)
    const body = (await res.json()) as Record<string, unknown>
    expect(body.meta).toMatchObject({ id: 'p1' })
    expect(body.content).toBe('mixed-port: 7890\n')
  })

  it('pUT /api/control/profiles/:id updates', async () => {
    const deps = makeDeps()
    srv = await mount(deps)
    const res = await fetch(`${srv.base}/api/control/profiles/p1`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'renamed' }),
    })
    expect(res.status).toBe(200)
    expect(deps.profiles.update).toHaveBeenCalledWith('p1', { name: 'renamed' })
  })

  it('rejects direct edits to managed visual overlays', async () => {
    const deps = makeDeps()
    deps.profiles.list.mockResolvedValue([
      {
        id: 'p1',
        name: 'managed',
        type: 'merge',
        managedBy: 'visual-editor',
        baseProfileId: 'base',
        updatedAt: 1,
      },
    ])
    srv = await mount(deps)
    const res = await fetch(`${srv.base}/api/control/profiles/p1`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ content: 'broken: true\n' }),
    })
    expect(res.status).toBe(403)
    expect(deps.profiles.update).not.toHaveBeenCalled()
  })

  it('dELETE /api/control/profiles/:id returns 204', async () => {
    const deps = makeDeps()
    srv = await mount(deps)
    const res = await fetch(`${srv.base}/api/control/profiles/p1`, {
      method: 'DELETE',
    })
    expect(res.status).toBe(204)
    expect(deps.profiles.delete).toHaveBeenCalledWith('p1')
  })

  it('pOST /api/control/profiles/:id/duplicate returns ProfileMeta', async () => {
    srv = await mount(makeDeps())
    const res = await fetch(`${srv.base}/api/control/profiles/p1/duplicate`, {
      method: 'POST',
    })
    expect(((await res.json()) as Record<string, unknown>).id).toBe('p3')
  })

  it('pOST /api/control/profiles/import imports from { url, name? }', async () => {
    const deps = makeDeps()
    srv = await mount(deps)
    const res = await fetch(`${srv.base}/api/control/profiles/import`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ url: 'https://sub', name: 'sub' }),
    })
    expect(((await res.json()) as Record<string, unknown>).type).toBe('remote')
    expect(deps.profiles.importFromUrl).toHaveBeenCalledWith('https://sub', 'sub')
  })

  it('pOST /api/control/profiles/import preserves an upstream 429 response (#2138)', async () => {
    const deps = makeDeps()
    deps.profiles.importFromUrl.mockRejectedValue(new SubscriptionFetchError(429))
    srv = await mount(deps)
    const res = await fetch(`${srv.base}/api/control/profiles/import`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ url: 'https://sub.example/limited' }),
    })

    expect(res.status).toBe(429)
    expect(await res.json()).toMatchObject({
      statusCode: 429,
      data: {
        error: 'Subscription provider returned HTTP 429',
        upstreamStatus: 429,
      },
    })
  })

  it('pOST /api/control/profiles/:id/refresh returns the updated meta', async () => {
    const deps = makeDeps()
    srv = await mount(deps)
    const res = await fetch(`${srv.base}/api/control/profiles/p1/refresh`, {
      method: 'POST',
    })
    expect(res.status).toBe(200)
    expect(deps.profiles.refresh).toHaveBeenCalledWith('p1')
    const body = (await res.json()) as Record<string, unknown>
    expect(body.id).toBe('p1')
    expect(body.type).toBe('remote')
    expect(body.updatedAt).toBe(6)
  })

  it('pOST /api/control/profiles/:id/refresh is a pure re-fetch (no apply)', async () => {
    const deps = makeDeps()
    deps.profiles.getActiveId = vi.fn(async () => 'p1')
    srv = await mount(deps)
    const res = await fetch(`${srv.base}/api/control/profiles/p1/refresh`, {
      method: 'POST',
    })
    expect(res.status).toBe(200)
    expect(deps.profiles.refresh).toHaveBeenCalledWith('p1')
    // Pure refresh never touches the running config — apply is a separate action.
    expect(deps.profiles.setActive).not.toHaveBeenCalled()
    expect(deps.supervisor.restart).not.toHaveBeenCalled()
  })

  it('pOST /profiles/:id/refresh-and-activate refreshes, activates (validates), and restarts (#2108)', async () => {
    const deps = makeDeps()
    srv = await mount(deps)
    const res = await fetch(`${srv.base}/api/control/profiles/p1/refresh-and-activate`, {
      method: 'POST',
    })
    expect(res.status).toBe(200)
    expect(deps.profiles.refresh).toHaveBeenCalledWith('p1')
    expect(deps.profiles.setActive).toHaveBeenCalledWith('p1')
    expect(deps.supervisor.validate).toHaveBeenCalledWith(deps.activeConfigPath)
    expect(deps.supervisor.restart).toHaveBeenCalledOnce()
    const body = (await res.json()) as {
      meta: { id: string; type: string }
      kernel: { status: string }
    }
    expect(body.meta.id).toBe('p1')
    expect(body.meta.type).toBe('remote')
    expect(body.kernel.status).toBe('running')
  })

  it('pOST /profiles/:id/refresh-and-activate returns 400 + restores prior when validation fails (#2109)', async () => {
    const deps = makeDeps()
    deps.profiles.getActiveId = vi.fn(async () => 'old')
    deps.supervisor.validate = vi.fn(async () => ({
      valid: false,
      message: 'parse error near line 3',
    }))
    srv = await mount(deps)
    const res = await fetch(`${srv.base}/api/control/profiles/p1/refresh-and-activate`, {
      method: 'POST',
    })
    expect(res.status).toBe(400)
    // New (bad) candidate composed, then prior profile restored.
    expect(deps.profiles.setActive).toHaveBeenCalledWith('p1')
    expect(deps.profiles.setActive).toHaveBeenCalledWith('old')
    expect(deps.supervisor.restart).not.toHaveBeenCalled()
  })

  it('pUT /api/control/profiles/:id passes through updateInterval (#2107)', async () => {
    const deps = makeDeps()
    srv = await mount(deps)
    const res = await fetch(`${srv.base}/api/control/profiles/p1`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ updateInterval: 60 }),
    })
    expect(res.status).toBe(200)
    expect(deps.profiles.update).toHaveBeenCalledWith('p1', {
      updateInterval: 60,
    })
  })

  it('pOST /api/control/kernel/rollback restores the backup + restarts (#2109)', async () => {
    const deps = makeDeps()
    srv = await mount(deps)
    const res = await fetch(`${srv.base}/api/control/kernel/rollback`, {
      method: 'POST',
    })
    expect(res.status).toBe(200)
    expect(deps.profiles.rollback).toHaveBeenCalled()
    expect(deps.supervisor.restart).toHaveBeenCalled()
  })

  it('pOST /api/control/kernel/rollback 404s when no backup exists (#2109)', async () => {
    const deps = makeDeps()
    deps.profiles.rollback = vi.fn(async () => false)
    srv = await mount(deps)
    const res = await fetch(`${srv.base}/api/control/kernel/rollback`, {
      method: 'POST',
    })
    expect(res.status).toBe(404)
    expect(deps.supervisor.restart).not.toHaveBeenCalled()
  })

  it('pOST /api/control/kernel/recover resets to minimal + restarts (#2109)', async () => {
    const deps = makeDeps()
    srv = await mount(deps)
    const res = await fetch(`${srv.base}/api/control/kernel/recover`, {
      method: 'POST',
    })
    expect(res.status).toBe(200)
    expect(deps.profiles.resetActive).toHaveBeenCalled()
    expect(deps.supervisor.restart).toHaveBeenCalled()
  })

  it('pOST /api/control/profiles/:id/activate validates the composed config before restarting (#2109)', async () => {
    const deps = makeDeps()
    srv = await mount(deps)
    const res = await fetch(`${srv.base}/api/control/profiles/p1/activate`, {
      method: 'POST',
    })
    expect(deps.profiles.setActive).toHaveBeenCalledWith('p1')
    expect(deps.supervisor.validate).toHaveBeenCalledWith(deps.activeConfigPath)
    expect(deps.supervisor.restart).toHaveBeenCalledOnce()
    expect(((await res.json()) as Record<string, unknown>).status).toBe('running')
  })

  it('pOST /api/control/profiles/:id/activate returns 400 + restores prior active when validation fails (#2109)', async () => {
    const deps = makeDeps()
    deps.profiles.getActiveId = vi.fn(async () => 'old')
    deps.supervisor.validate = vi.fn(async () => ({
      valid: false,
      message: 'parse error near line 3',
    }))
    srv = await mount(deps)
    const res = await fetch(`${srv.base}/api/control/profiles/p1/activate`, {
      method: 'POST',
    })
    expect(res.status).toBe(400)
    expect(await res.json()).toMatchObject({
      statusMessage: 'profile validation failed',
      data: { error: 'parse error near line 3' },
    })
    expect(deps.profiles.setActive).toHaveBeenCalledWith('p1')
    // Prior profile restored so the bad candidate does not persist.
    expect(deps.profiles.setActive).toHaveBeenCalledWith('old')
    expect(deps.supervisor.restart).not.toHaveBeenCalled()
  })

  it('pOST /api/control/profiles/:id/validate materializes a temp candidate then returns { valid, message }', async () => {
    const deps = makeDeps()
    srv = await mount(deps)
    const res = await fetch(`${srv.base}/api/control/profiles/p1/validate`, {
      method: 'POST',
    })
    const body = await res.json()
    expect(body).toEqual({ valid: true, message: 'ok' })
    // It reads the profile by id and validates a real candidate PATH, never the bare id.
    expect(deps.profiles.read).toHaveBeenCalledWith('p1')
    const validatedPath = (
      deps.supervisor.validate.mock.calls as unknown as [string][][]
    )[0]![0] as unknown as string
    expect(validatedPath).toBe(join(deps.homeDir, '.validate-p1.yaml'))
    expect(validatedPath).not.toBe('p1')
  })

  it('exposes visual profile editor open/preview/apply/reset routes', async () => {
    const deps = makeDeps()
    const snapshot = {
      profile: { id: 'p1', name: 'home', type: 'local' as const, updatedAt: 1 },
      active: false,
      revision: 'rev',
      editableYaml: 'mode: rule\n',
      composedYaml: 'mode: rule\n',
      schemaVersion: 'schema',
      composition: [],
      diagnostics: [],
      conflicts: [],
    }
    const profileEditor = {
      open: vi.fn(async () => snapshot),
      preview: vi.fn(async () => ({
        ...snapshot,
        patch: { version: 1 as const, baseRevision: 'rev', operations: [] },
      })),
      apply: vi.fn(async () => ({
        profile: snapshot.profile,
        activeId: 'p1',
        revision: 'rev',
        kernel: fakeState({ status: 'running' }),
      })),
      resetManagedOverlay: vi.fn(async () => undefined),
    }
    srv = await mount({ ...deps, profileEditor } as never)
    expect(await fetch(`${srv.base}/api/control/profiles/p1/editor`).then((r) => r.status)).toBe(
      200,
    )
    const body = {
      patch: { version: 1, baseRevision: 'rev', operations: [] },
    }
    expect(
      await fetch(`${srv.base}/api/control/profiles/p1/editor/preview`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      }).then((r) => r.status),
    ).toBe(200)
    expect(
      await fetch(`${srv.base}/api/control/profiles/p1/editor`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      }).then((r) => r.status),
    ).toBe(200)
    expect(
      await fetch(`${srv.base}/api/control/profiles/p1/editor/overlay`, {
        method: 'DELETE',
      }).then((r) => r.status),
    ).toBe(200)
    expect(
      await fetch(`${srv.base}/api/control/profiles/p1/editor/preview`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({}),
      }).then((r) => r.status),
    ).toBe(400)
  })

  it('maps visual editor conflicts to HTTP 409', async () => {
    const deps = makeDeps()
    const conflict = {
      operation: {
        op: 'set' as const,
        target: { path: ['mode'] },
        expectedHash: 'old',
        value: 'global' as const,
      },
      path: ['mode'],
      reason: 'changed' as const,
      current: 'direct' as const,
    }
    const profileEditor = {
      open: vi.fn(async () => {
        throw new ProfileEditorConflictError([conflict])
      }),
      preview: vi.fn(),
      apply: vi.fn(),
      resetManagedOverlay: vi.fn(),
    }
    srv = await mount({ ...deps, profileEditor } as never)
    const res = await fetch(`${srv.base}/api/control/profiles/p1/editor`)
    expect(res.status).toBe(409)
    expect((await res.json()) as object).toMatchObject({
      data: { conflicts: [expect.objectContaining({ reason: 'changed' })] },
    })
  })

  it('gET /api/control/kernel/logs streams text/event-stream and pushes a state event', async () => {
    const deps = makeDeps()
    // Capture the registered 'log' callback so we can drive a fake log line.
    let logCb: ((l: { stream: string; line: string; ts: number }) => void) | undefined
    deps.supervisor.on = vi.fn((event: string, cb: never) => {
      if (event === 'log') logCb = cb as never
    }) as never
    srv = await mount(deps)

    const res = await fetch(`${srv.base}/api/control/kernel/logs`)
    expect(res.headers.get('content-type')).toContain('text/event-stream')

    const reader = res.body!.getReader()
    const dec = new TextDecoder()
    // First chunk should be the seeded state event.
    const first = await reader.read()
    const seeded = dec.decode(first.value)
    expect(seeded).toContain('"type":"state"')

    // Drive a log line through the captured callback and read the next chunk.
    logCb?.({ stream: 'stdout', line: 'hello-from-kernel', ts: 1 })
    const next = await reader.read()
    expect(dec.decode(next.value)).toContain('hello-from-kernel')

    await reader.cancel()
  })
})

describe('createControlRouter — system proxy', () => {
  let srv: Awaited<ReturnType<typeof mount>>
  afterEach(async () => srv?.close())

  it('gET /api/control/sysproxy reflects isEnabled() + describe()', async () => {
    const deps = { ...makeDeps(), systemProxy: makeSystemProxy(true) }
    srv = await mount(deps as never)
    const res = await fetch(`${srv.base}/api/control/sysproxy`)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      enabled: true,
      port: 7890,
      bypass: ['localhost', '127.0.0.1'],
    })
    expect(deps.systemProxy.isEnabled).toHaveBeenCalledOnce()
    expect(deps.systemProxy.describe).toHaveBeenCalled()
  })

  it('pOST /api/control/sysproxy {enabled:true, bypass} calls enable(bypass)', async () => {
    const deps = { ...makeDeps(), systemProxy: makeSystemProxy(false) }
    srv = await mount(deps as never)
    const res = await fetch(`${srv.base}/api/control/sysproxy`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ enabled: true, bypass: ['example.com'] }),
    })
    expect(res.status).toBe(200)
    expect(deps.systemProxy.enable).toHaveBeenCalledWith(['example.com'])
    expect(deps.systemProxy.disable).not.toHaveBeenCalled()
    // Response mirrors the GET shape (enabled + describe()).
    expect(await res.json()).toEqual({
      enabled: false,
      port: 7890,
      bypass: ['localhost', '127.0.0.1'],
    })
  })

  it('pOST /api/control/sysproxy {mode:pac, enabled:true, pacUrl} calls setAutoProxy', async () => {
    const deps = { ...makeDeps(), systemProxy: makeSystemProxy(false) }
    srv = await mount(deps as never)
    const res = await fetch(`${srv.base}/api/control/sysproxy`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        mode: 'pac',
        enabled: true,
        pacUrl: 'http://127.0.0.1:7890/proxy.pac',
      }),
    })
    expect(res.status).toBe(200)
    expect(deps.systemProxy.setAutoProxy).toHaveBeenCalledWith('http://127.0.0.1:7890/proxy.pac')
    expect(deps.systemProxy.enable).not.toHaveBeenCalled()
    expect(deps.systemProxy.disableAutoProxy).not.toHaveBeenCalled()
  })

  it('pOST /api/control/sysproxy {mode:pac, enabled:false} calls disableAutoProxy', async () => {
    const deps = { ...makeDeps(), systemProxy: makeSystemProxy(false) }
    srv = await mount(deps as never)
    const res = await fetch(`${srv.base}/api/control/sysproxy`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ mode: 'pac', enabled: false }),
    })
    expect(res.status).toBe(200)
    expect(deps.systemProxy.disableAutoProxy).toHaveBeenCalledOnce()
    expect(deps.systemProxy.disable).not.toHaveBeenCalled()
    expect(deps.systemProxy.setAutoProxy).not.toHaveBeenCalled()
  })

  it('pOST /api/control/sysproxy {mode:pac, enabled:true} without pacUrl is a 400', async () => {
    const deps = { ...makeDeps(), systemProxy: makeSystemProxy(false) }
    srv = await mount(deps as never)
    const res = await fetch(`${srv.base}/api/control/sysproxy`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ mode: 'pac', enabled: true }),
    })
    expect(res.status).toBe(400)
    expect(deps.systemProxy.setAutoProxy).not.toHaveBeenCalled()
  })

  it('pOST /api/control/sysproxy {enabled:false} calls disable()', async () => {
    const deps = { ...makeDeps(), systemProxy: makeSystemProxy(true) }
    srv = await mount(deps as never)
    const res = await fetch(`${srv.base}/api/control/sysproxy`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ enabled: false }),
    })
    expect(res.status).toBe(200)
    expect(deps.systemProxy.disable).toHaveBeenCalledOnce()
    expect(deps.systemProxy.enable).not.toHaveBeenCalled()
  })

  it('gET /api/control/sysproxy is 404 JSON when no controller is injected', async () => {
    srv = await mount(makeDeps())
    const res = await fetch(`${srv.base}/api/control/sysproxy`)
    expect(res.status).toBe(404)
    expect(await res.json()).toEqual({ error: 'system-proxy unavailable' })
  })

  it('pOST /api/control/sysproxy is 404 JSON when no controller is injected', async () => {
    srv = await mount(makeDeps())
    const res = await fetch(`${srv.base}/api/control/sysproxy`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ enabled: true }),
    })
    expect(res.status).toBe(404)
    expect(await res.json()).toEqual({ error: 'system-proxy unavailable' })
  })
})

function makeKernelManager() {
  return {
    listVersions: vi.fn(async () => ({
      versions: ['v1.19.27', 'v1.19.0'],
      current: 'v1.19.27',
      bundled: 'v1.19.27',
    })),
    switch: vi.fn(async () => {}),
  }
}

function makeTunController(
  status: { enabled: boolean; mode: 'sidecar' | 'tun'; stack?: string } = {
    enabled: false,
    mode: 'sidecar',
  },
) {
  return {
    enable: vi.fn(async () => {}),
    disable: vi.fn(async () => {}),
    status: vi.fn(async () => status),
    uninstall: vi.fn(async () => {}),
  }
}

describe('createControlRouter — geo assets', () => {
  let srv: Awaited<ReturnType<typeof mount>>
  afterEach(async () => srv?.close())

  it('pOST /api/control/geo/update downloads the 3 files into homeDir and returns { ok, files }', async () => {
    const requested: string[] = []
    const geoFetch = vi.fn(async (url: string) => {
      requested.push(url)
      return new Response(Buffer.from(`bytes:${url}`), { status: 200 })
    })
    const deps = {
      ...makeDeps(),
      geoFetch: geoFetch as unknown as typeof fetch,
    }
    srv = await mount(deps as never)
    const res = await fetch(`${srv.base}/api/control/geo/update`, {
      method: 'POST',
    })
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      ok: true,
      files: ['geoip.dat', 'geosite.dat', 'country.mmdb'],
    })
    // It fetched three assets and wrote them under homeDir.
    expect(requested).toHaveLength(3)
    const written = readdirSync(deps.homeDir)
    expect(written).toEqual(expect.arrayContaining(['geoip.dat', 'geosite.dat', 'country.mmdb']))
  })
})

describe('createControlRouter — kernel version management', () => {
  let srv: Awaited<ReturnType<typeof mount>>
  afterEach(async () => srv?.close())

  it('gET /api/control/kernel/versions returns listVersions()', async () => {
    const deps = { ...makeDeps(), kernelManager: makeKernelManager() }
    srv = await mount(deps as never)
    const res = await fetch(`${srv.base}/api/control/kernel/versions`)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      versions: ['v1.19.27', 'v1.19.0'],
      current: 'v1.19.27',
      bundled: 'v1.19.27',
    })
    expect(deps.kernelManager.listVersions).toHaveBeenCalledOnce()
  })

  it('pOST /api/control/kernel/switch { version } calls switch then returns { ok: true }', async () => {
    const deps = { ...makeDeps(), kernelManager: makeKernelManager() }
    srv = await mount(deps as never)
    const res = await fetch(`${srv.base}/api/control/kernel/switch`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ version: 'v1.19.0' }),
    })
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
    expect(deps.kernelManager.switch).toHaveBeenCalledWith('v1.19.0')
  })

  it('gET /api/control/kernel/versions is 404 JSON when no kernelManager is injected', async () => {
    srv = await mount(makeDeps())
    const res = await fetch(`${srv.base}/api/control/kernel/versions`)
    expect(res.status).toBe(404)
    expect(await res.json()).toEqual({ error: 'kernel-version unavailable' })
  })

  it('pOST /api/control/kernel/switch is 404 JSON when no kernelManager is injected', async () => {
    srv = await mount(makeDeps())
    const res = await fetch(`${srv.base}/api/control/kernel/switch`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ version: 'v1.19.0' }),
    })
    expect(res.status).toBe(404)
    expect(await res.json()).toEqual({ error: 'kernel-version unavailable' })
  })
})

describe('createControlRouter — tun', () => {
  let srv: Awaited<ReturnType<typeof mount>>
  afterEach(async () => srv?.close())

  it('gET /api/control/tun reflects tunController.status()', async () => {
    const deps = {
      ...makeDeps(),
      tunController: makeTunController({
        enabled: true,
        mode: 'tun',
        stack: 'gvisor',
      }),
    }
    srv = await mount(deps as never)
    const res = await fetch(`${srv.base}/api/control/tun`)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      enabled: true,
      mode: 'tun',
      stack: 'gvisor',
    })
    expect(deps.tunController.status).toHaveBeenCalledOnce()
  })

  it('pOST /api/control/tun {enabled:true, stack} calls enable({stack}) then returns status()', async () => {
    const deps = {
      ...makeDeps(),
      tunController: makeTunController({
        enabled: true,
        mode: 'tun',
        stack: 'mixed',
      }),
    }
    srv = await mount(deps as never)
    const res = await fetch(`${srv.base}/api/control/tun`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ enabled: true, stack: 'mixed' }),
    })
    expect(res.status).toBe(200)
    expect(deps.tunController.enable).toHaveBeenCalledWith({ stack: 'mixed' })
    expect(deps.tunController.disable).not.toHaveBeenCalled()
    // Response mirrors the GET shape (status()).
    expect(await res.json()).toEqual({
      enabled: true,
      mode: 'tun',
      stack: 'mixed',
    })
  })

  it('pOST /api/control/tun maps a TunPreconditionError to a clean handled 4xx (not an unhandled 500)', async () => {
    const controller = makeTunController({ enabled: false, mode: 'sidecar' })
    controller.enable = vi.fn(async () => {
      throw new TunPreconditionError('tun: no active profile to edit')
    })
    const deps = { ...makeDeps(), tunController: controller }
    srv = await mount(deps as never)
    const res = await fetch(`${srv.base}/api/control/tun`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ enabled: true, stack: 'mixed' }),
    })
    // 409 Conflict (the default precondition status), carrying the reason — NOT
    // a 500 H3 [unhandled] error.
    expect(res.status).toBe(409)
    expect((await res.json()) as Record<string, unknown>).toMatchObject({
      data: { error: 'tun: no active profile to edit' },
    })
  })

  it('pOST /api/control/tun lets a genuine enable failure propagate as a 500', async () => {
    const controller = makeTunController({ enabled: false, mode: 'sidecar' })
    controller.enable = vi.fn(async () => {
      throw new Error('elevation denied')
    })
    const deps = { ...makeDeps(), tunController: controller }
    srv = await mount(deps as never)
    const res = await fetch(`${srv.base}/api/control/tun`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ enabled: true, stack: 'mixed' }),
    })
    expect(res.status).toBe(500)
  })

  it('pOST /api/control/tun {enabled:false} calls disable() then returns status()', async () => {
    const deps = {
      ...makeDeps(),
      tunController: makeTunController({ enabled: false, mode: 'sidecar' }),
    }
    srv = await mount(deps as never)
    const res = await fetch(`${srv.base}/api/control/tun`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ enabled: false }),
    })
    expect(res.status).toBe(200)
    expect(deps.tunController.disable).toHaveBeenCalledOnce()
    expect(deps.tunController.enable).not.toHaveBeenCalled()
    expect(await res.json()).toEqual({ enabled: false, mode: 'sidecar' })
  })

  it('pOST /api/control/tun/uninstall calls uninstall() then returns status()', async () => {
    const deps = {
      ...makeDeps(),
      tunController: makeTunController({ enabled: false, mode: 'sidecar' }),
    }
    srv = await mount(deps as never)
    const res = await fetch(`${srv.base}/api/control/tun/uninstall`, {
      method: 'POST',
    })
    expect(res.status).toBe(200)
    expect(deps.tunController.uninstall).toHaveBeenCalledOnce()
    expect(await res.json()).toEqual({ enabled: false, mode: 'sidecar' })
  })

  it('pOST /api/control/tun/uninstall is 404 JSON when the controller lacks uninstall', async () => {
    const controller = makeTunController({ enabled: false, mode: 'sidecar' })
    // A controller WITHOUT the uninstall capability (older/partial impl).
    delete (controller as { uninstall?: unknown }).uninstall
    const deps = { ...makeDeps(), tunController: controller }
    srv = await mount(deps as never)
    const res = await fetch(`${srv.base}/api/control/tun/uninstall`, {
      method: 'POST',
    })
    expect(res.status).toBe(404)
    expect(await res.json()).toEqual({ error: 'tun unavailable' })
  })

  it('gET /api/control/tun is 404 JSON when no controller is injected', async () => {
    srv = await mount(makeDeps())
    const res = await fetch(`${srv.base}/api/control/tun`)
    expect(res.status).toBe(404)
    expect(await res.json()).toEqual({ error: 'tun unavailable' })
  })

  it('pOST /api/control/tun/uninstall is 404 JSON when no controller is injected', async () => {
    srv = await mount(makeDeps())
    const res = await fetch(`${srv.base}/api/control/tun/uninstall`, {
      method: 'POST',
    })
    expect(res.status).toBe(404)
    expect(await res.json()).toEqual({ error: 'tun unavailable' })
  })

  it('pOST /api/control/tun is 404 JSON when no controller is injected', async () => {
    srv = await mount(makeDeps())
    const res = await fetch(`${srv.base}/api/control/tun`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ enabled: true, stack: 'gvisor' }),
    })
    expect(res.status).toBe(404)
    expect(await res.json()).toEqual({ error: 'tun unavailable' })
  })
})

describe('createControlRouter — runtime config viewer', () => {
  let srv: Awaited<ReturnType<typeof mount>>
  afterEach(async () => srv?.close())

  it('gET /api/control/config/runtime returns the activeConfigPath file as text/yaml', async () => {
    const runtimeYaml = 'mixed-port: 7890\nexternal-controller: 127.0.0.1:9090\nsecret: sek\n'
    const readFile = vi.fn(async () => runtimeYaml)
    const deps = {
      ...makeDeps(),
      activeConfigPath: '/home/active.yaml',
      readFile: readFile as unknown as typeof import('node:fs/promises').readFile,
    }
    srv = await mount(deps as never)
    const res = await fetch(`${srv.base}/api/control/config/runtime`)
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toContain('text/yaml')
    expect(await res.text()).toBe(runtimeYaml)
    // Reads the actual activeConfigPath file (not the active profile source).
    expect(readFile).toHaveBeenCalledWith('/home/active.yaml', 'utf8')
  })

  it('gET /api/control/config/runtime returns empty string when the file does not exist', async () => {
    const readFile = vi.fn(async () => {
      const err = new Error('ENOENT') as NodeJS.ErrnoException
      err.code = 'ENOENT'
      throw err
    })
    const deps = {
      ...makeDeps(),
      activeConfigPath: '/home/missing.yaml',
      readFile: readFile as unknown as typeof import('node:fs/promises').readFile,
    }
    srv = await mount(deps as never)
    const res = await fetch(`${srv.base}/api/control/config/runtime`)
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('')
  })

  it('gET /api/control/config (active profile source) still works alongside runtime', async () => {
    const deps = makeDeps()
    deps.profiles.getActiveId = vi.fn(async () => 'p1')
    srv = await mount(deps)
    const res = await fetch(`${srv.base}/api/control/config`)
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('mixed-port: 7890\n')
  })
})

describe('createControlRouter — config sections', () => {
  let srv: Awaited<ReturnType<typeof mount>>
  afterEach(async () => srv?.close())

  it('gET /api/control/config/section?key= returns the active profile section', async () => {
    const deps = makeDeps()
    deps.profiles.getActiveId = vi.fn(async () => 'p1')
    deps.profiles.getSection = vi.fn(async () => ['MATCH,DIRECT'])
    srv = await mount(deps)
    const res = await fetch(`${srv.base}/api/control/config/section?key=rules`)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual(['MATCH,DIRECT'])
    expect(deps.profiles.getSection).toHaveBeenCalledWith('p1', 'rules')
  })

  it('gET /api/control/config/section returns null when there is no active profile', async () => {
    const deps = makeDeps()
    deps.profiles.getActiveId = vi.fn(async () => undefined)
    srv = await mount(deps)
    const res = await fetch(`${srv.base}/api/control/config/section?key=rules`)
    expect(res.status).toBe(200)
    expect(await res.json()).toBeNull()
    expect(deps.profiles.getSection).not.toHaveBeenCalled()
  })

  it('pUT /api/control/config/section sets the section then re-activates + restarts', async () => {
    const deps = makeDeps()
    deps.profiles.getActiveId = vi.fn(async () => 'p1')
    srv = await mount(deps)
    const res = await fetch(`${srv.base}/api/control/config/section`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ key: 'rules', value: ['MATCH,REJECT'] }),
    })
    expect(res.status).toBe(200)
    expect(deps.profiles.setSection).toHaveBeenCalledWith('p1', 'rules', ['MATCH,REJECT'])
    expect(deps.profiles.setActive).toHaveBeenCalledWith('p1')
    expect(deps.supervisor.restart).toHaveBeenCalledOnce()
    expect(((await res.json()) as Record<string, unknown>).status).toBe('running')
  })

  it('pUT /api/control/config/section with restart:false persists WITHOUT restarting', async () => {
    const deps = makeDeps()
    deps.profiles.getActiveId = vi.fn(async () => 'p1')
    srv = await mount(deps)
    const res = await fetch(`${srv.base}/api/control/config/section`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ key: 'allow-lan', value: true, restart: false }),
    })
    expect(res.status).toBe(200)
    expect(deps.profiles.setSection).toHaveBeenCalledWith('p1', 'allow-lan', true)
    expect(deps.profiles.setActive).toHaveBeenCalledWith('p1')
    // The field was already hot-applied by the client's PATCH /configs — no
    // restart, so live connections survive while the change is persisted.
    expect(deps.supervisor.restart).not.toHaveBeenCalled()
    expect(deps.supervisor.getState).toHaveBeenCalled()
  })

  it('pUT /api/control/config/section passes a null value through (delete)', async () => {
    const deps = makeDeps()
    deps.profiles.getActiveId = vi.fn(async () => 'p1')
    srv = await mount(deps)
    const res = await fetch(`${srv.base}/api/control/config/section`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ key: 'dns', value: null }),
    })
    expect(res.status).toBe(200)
    expect(deps.profiles.setSection).toHaveBeenCalledWith('p1', 'dns', null)
    expect(deps.profiles.setActive).toHaveBeenCalledWith('p1')
  })

  it('pUT /api/control/config/section returns 409 when there is no active profile', async () => {
    const deps = makeDeps()
    deps.profiles.getActiveId = vi.fn(async () => undefined)
    srv = await mount(deps)
    const res = await fetch(`${srv.base}/api/control/config/section`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ key: 'rules', value: [] }),
    })
    expect(res.status).toBe(409)
    expect(await res.json()).toEqual({ error: 'no active profile' })
    expect(deps.profiles.setSection).not.toHaveBeenCalled()
    expect(deps.supervisor.restart).not.toHaveBeenCalled()
  })
})

// ---- Panel auth: session cookie wiring ----
// 密码语义在 index.test.ts 里测真实的 agent.auth；这里只验路由与 cookie 的接法，
// 所以给一个能改密码的假 auth，配上真实的签名 SessionManager。
function makeAuthFixture(initial = '') {
  let password = initial
  const sessions = createSessionManager(() => password)
  const auth: PanelAuth = {
    needsSetup: () => !password,
    async login(input) {
      const trimmed = input.trim()
      if (!password) {
        if (!trimmed) return { ok: false, error: 'password-required' as const }
        password = trimmed
        return { ok: true, created: true }
      }
      if (trimmed !== password) return { ok: false, error: 'invalid-password' as const }
      return { ok: true }
    },
    async changePassword(current, next) {
      if (!password || current.trim() !== password) {
        return { ok: false, error: 'invalid-password' as const }
      }
      if (!next.trim()) return { ok: false, error: 'password-required' as const }
      password = next.trim()
      return { ok: true, requiresRestart: true }
    },
  }
  return { auth, sessions }
}

function setCookies(res: Response): string[] {
  return (res.headers as Headers & { getSetCookie?: () => string[] }).getSetCookie?.() ?? []
}

function sessionCookie(res: Response): string {
  const name = 'qoqclashd_session='
  const raw = setCookies(res).find((c) => c.startsWith(name)) ?? ''
  return decodeURIComponent(raw.split(';')[0].slice(name.length))
}

describe('createControlRouter — panel auth', () => {
  // 一个用例可能起两台（换密码那台跑完就没人关了），所以登记表统一在这里收。
  const servers: Awaited<ReturnType<typeof mount>>[] = []
  const serve = async (deps: ReturnType<typeof makeDeps>, extra?: Partial<ControlRouterDeps>) => {
    const instance = await mount(deps, extra)
    servers.push(instance)
    return instance
  }
  afterEach(async () => {
    while (servers.length) await servers.pop()?.close()
  })

  const login = (base: string, password: string) =>
    fetch(`${base}/api/control/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password }),
    })

  it('aWT h /auth/status is public and reports needsSetup', async () => {
    const srv = await serve(makeDeps(), makeAuthFixture())
    const res = await fetch(`${srv.base}/api/control/auth/status`)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ needsSetup: true, authenticated: false })
  })

  it('protected routes 401 without a session even when no token is set', async () => {
    const srv = await serve(makeDeps(), makeAuthFixture('1234'))
    const res = await fetch(`${srv.base}/api/control/kernel/status`)
    expect(res.status).toBe(401)
  })

  it('first login creates the password, issues an httpOnly 7-day cookie, and unlocks routes', async () => {
    const srv = await serve(makeDeps(), makeAuthFixture())
    const res = await login(srv.base, '1234')
    expect(await res.json()).toEqual({ ok: true, created: true })
    const cookie = setCookies(res)[0] ?? ''
    expect(cookie).toContain('Max-Age=604800')
    expect(cookie).toContain('HttpOnly')
    expect(cookie).toContain('SameSite=Lax')

    const value = sessionCookie(res)
    expect(value).not.toBe('')
    const status = await fetch(`${srv.base}/api/control/kernel/status`, {
      headers: { cookie: `qoqclashd_session=${value}` },
    })
    expect(status.status).toBe(200)
  })

  it('lOG POST /auth/login with a wrong password says so without issuing a cookie', async () => {
    const srv = await serve(makeDeps(), makeAuthFixture('1234'))
    const res = await login(srv.base, 'nope')
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: false, error: 'invalid-password' })
    expect(setCookies(res)).toEqual([])
  })

  it('sETTING a new password rotates the key: the old cookie stops working, the response carries a new one', async () => {
    const fixture = makeAuthFixture('1234')
    const srv = await serve(makeDeps(), fixture)
    const old = sessionCookie(await login(srv.base, '1234'))

    const bad = await fetch(`${srv.base}/api/control/auth/password`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json', cookie: `qoqclashd_session=${old}` },
      body: JSON.stringify({ currentPassword: 'nope', newPassword: '5678' }),
    })
    expect(await bad.json()).toEqual({ ok: false, error: 'invalid-password' })

    const changed = await fetch(`${srv.base}/api/control/auth/password`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json', cookie: `qoqclashd_session=${old}` },
      body: JSON.stringify({ currentPassword: '1234', newPassword: '5678' }),
    })
    expect(await changed.json()).toEqual({ ok: true, requiresRestart: true })
    const fresh = sessionCookie(changed)
    expect(fresh).not.toBe(old)

    expect(
      (
        await fetch(`${srv.base}/api/control/kernel/status`, {
          headers: { cookie: `qoqclashd_session=${old}` },
        })
      ).status,
    ).toBe(401)
    expect(
      (
        await fetch(`${srv.base}/api/control/kernel/status`, {
          headers: { cookie: `qoqclashd_session=${fresh}` },
        })
      ).status,
    ).toBe(200)
  })

  it('lOGOUT expires the cookie and /auth/password itself requires a session', async () => {
    const srv = await serve(makeDeps(), makeAuthFixture('1234'))
    const value = sessionCookie(await login(srv.base, '1234'))

    const noSession = await fetch(`${srv.base}/api/control/auth/password`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ currentPassword: '1234', newPassword: '5678' }),
    })
    expect(noSession.status).toBe(401)

    const out = await fetch(`${srv.base}/api/control/auth/logout`, {
      method: 'POST',
      headers: { cookie: `qoqclashd_session=${value}` },
    })
    expect(out.status).toBe(200)
    expect(setCookies(out).some((c) => c.includes('Max-Age=0'))).toBe(true)
  })

  it('PUT /kernel/api 只认端口，不再接受 secret', async () => {
    const updateClashApi = vi.fn(async () => ({ ok: true, port: 9099 }))
    const srv = await serve(makeDeps(), { ...makeAuthFixture('1234'), updateClashApi })
    const value = sessionCookie(await login(srv.base, '1234'))
    const headers = { 'content-type': 'application/json', cookie: `qoqclashd_session=${value}` }

    const secretOnly = await fetch(`${srv.base}/api/control/kernel/api`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ secret: 'nope' }),
    })
    expect(secretOnly.status).toBe(400)
    expect(updateClashApi).not.toHaveBeenCalled()

    const port = await fetch(`${srv.base}/api/control/kernel/api`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ port: 9099 }),
    })
    expect(port.status).toBe(200)
    expect(updateClashApi).toHaveBeenCalledWith({ port: 9099 })
  })
})
