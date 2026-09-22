import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  AGENT_VERSION,
  createAgent,
  createControlRouter,
  createProfileStore,
  createSupervisor,
  MIHOMO_VERSION,
  mihomoAsset,
} from './index'

function opts() {
  const home = mkdtempSync(join(tmpdir(), 'mcxd-agent-'))
  return {
    binaryPath: '/fake/mihomo',
    homeDir: home,
    activeConfigPath: join(home, 'active.yaml'),
    profilesDir: join(home, 'profiles'),
    // 不指定的话 createAgent 会落到 cwd/data/qoqclashd.sqlite —— 用例之间共用一
    // 张表，前一个用例写的密码会渗进后一个。
    dataDir: join(home, 'data'),
    agentToken: 'tok',
  }
}

describe('createAgent', () => {
  it('returns supervisor + profiles + router + info', () => {
    const agent = createAgent(opts())
    expect(typeof agent.supervisor.start).toBe('function')
    expect(typeof agent.profiles.list).toBe('function')
    expect(agent.router).toBeDefined()
    expect(typeof agent.info).toBe('function')
  })

  it('info() matches the §3 capability shape', () => {
    const agent = createAgent(opts())
    const info = agent.info()
    expect(info).toMatchObject({
      hasAgent: true,
      version: AGENT_VERSION,
      features: [
        'profiles',
        'logs-sse',
        'kernel-control',
        'geo-assets',
        'config-sections',
        'visual-config-editor',
      ],
    })
    expect(info.platform).toMatchObject({
      os: process.platform,
      arch: process.arch,
    })
    expect(info.kernel).toMatchObject({ bundled: true, path: '/fake/mihomo' })
  })

  it('info().features always includes geo-assets (homeDir-backed, no controller)', () => {
    const agent = createAgent(opts())
    expect(agent.info().features).toContain('geo-assets')
  })

  it('info().features always includes config-sections (active-profile YAML editing)', () => {
    const agent = createAgent(opts())
    expect(agent.info().features).toContain('config-sections')
  })

  it('info().features always includes visual-config-editor', () => {
    const agent = createAgent(opts())
    expect(agent.info().features).toContain('visual-config-editor')
    expect(agent.profileEditor).toBeDefined()
  })

  it('info().features excludes system-proxy when no controller is injected', () => {
    const agent = createAgent(opts())
    expect(agent.info().features).not.toContain('system-proxy')
    expect((agent as Record<string, unknown>).systemProxy).toBeUndefined()
  })

  it('info().features includes system-proxy when a controller is injected', () => {
    const systemProxy = {
      isEnabled: async () => false,
      enable: async () => {},
      disable: async () => {},
      setAutoProxy: async () => {},
      disableAutoProxy: async () => {},
      describe: () => ({ port: 7890, bypass: [] as string[] }),
    }
    const agent = createAgent({ ...opts(), systemProxy })
    expect(agent.info().features).toContain('system-proxy')
    expect(agent.systemProxy).toBe(systemProxy)
  })

  it('info().features excludes kernel-version when no kernelManager is injected', () => {
    const agent = createAgent(opts())
    expect(agent.info().features).not.toContain('kernel-version')
    expect((agent as Record<string, unknown>).kernelManager).toBeUndefined()
  })

  it('info().features includes kernel-version when a kernelManager is injected', () => {
    const kernelManager = {
      listVersions: async () => ({
        versions: ['v1.19.27'],
        current: 'v1.19.27',
        bundled: 'v1.19.27',
      }),
      switch: async () => {},
    }
    const agent = createAgent({ ...opts(), kernelManager })
    expect(agent.info().features).toContain('kernel-version')
    expect(agent.kernelManager).toBe(kernelManager)
  })

  it('info().features excludes tun when no controller is injected', () => {
    const agent = createAgent(opts())
    expect(agent.info().features).not.toContain('tun')
    expect((agent as Record<string, unknown>).tunController).toBeUndefined()
  })

  it('info().features includes tun when a controller is injected', () => {
    const tunController = {
      enable: async () => {},
      disable: async () => {},
      status: async () => ({ enabled: false, mode: 'sidecar' as const }),
    }
    const agent = createAgent({ ...opts(), tunController })
    expect(agent.info().features).toContain('tun')
    expect(agent.tunController).toBe(tunController)
  })

  it('supports changing the persistent runtime root and reuses it for kernel/bootstrap paths', async () => {
    const customRoot = join(tmpdir(), 'mcxd-agent-custom-root')
    const agent = createAgent(opts())

    const before = agent.info().runtime
    expect(before.root).toBeDefined()

    const result = await agent.setRuntimeRoot(customRoot)
    expect(result.ok).toBe(true)
    expect(result.root).toBe(customRoot)

    const after = agent.info().runtime
    expect(after.root).toBe(customRoot)
    expect(after.kernel).toBe(join(customRoot, 'kernel'))
    expect(after.config).toBe(join(customRoot, 'config'))
    expect(after.profiles).toBe(join(customRoot, 'profiles'))
    expect(after.activeConfig).toBe(join(customRoot, 'config', 'active.yaml'))
  })

  it('面板密码由 agent 持有：首次 login 创建并同步内核 secret', async () => {
    const agent = createAgent(opts())
    expect(agent.auth.needsSetup()).toBe(true)
    expect(await agent.auth.login('   ')).toEqual({ ok: false, error: 'password-required' })

    const created = await agent.auth.login('1234')
    expect(created).toMatchObject({ ok: true, created: true })
    expect(agent.auth.needsSetup()).toBe(false)
    expect(agent.supervisor.getControllerSecret()).toBe('1234')
    expect(await agent.storage.get('setup/panel-password')).toBe('"1234"')

    expect(await agent.auth.login('nope')).toEqual({ ok: false, error: 'invalid-password' })
    expect((await agent.auth.login('1234')).ok).toBe(true)
  })

  it('会话 cookie 跟着密码走：改密后旧 cookie 立即失效', async () => {
    const agent = createAgent(opts())
    await agent.auth.login('1234')
    const cookie = agent.sessions.issue()
    expect(agent.sessions.verify(cookie)).toBe(true)

    const wrong = await agent.auth.changePassword('nope', '5678')
    expect(wrong).toEqual({ ok: false, error: 'invalid-password' })
    expect(await agent.auth.changePassword('1234', '  ')).toEqual({
      ok: false,
      error: 'password-required',
    })

    expect(await agent.auth.changePassword('1234', '5678')).toMatchObject({ ok: true })
    expect(agent.sessions.verify(cookie)).toBe(false)
    expect(agent.sessions.verify(agent.sessions.issue())).toBe(true)
    expect(agent.supervisor.getControllerSecret()).toBe('5678')
    expect(await agent.storage.get('setup/panel-password')).toBe('"5678"')
  })

  it('init() 把 KV 里的密码灌回内存与内核', async () => {
    const options = opts()
    const agent = createAgent(options)
    await agent.auth.login('1234')

    const restarted = createAgent(options)
    expect(restarted.auth.needsSetup()).toBe(true) // init() 前还没读 KV
    await restarted.init()
    expect(restarted.auth.needsSetup()).toBe(false)
    expect(restarted.supervisor.getControllerSecret()).toBe('1234')
    expect(restarted.sessions.verify(restarted.sessions.issue())).toBe(true)
  })

  it('宿主给了 agentToken 时它即成初始密码，agent 不再放开控制面', async () => {
    const agent = createAgent({ ...opts(), agentToken: 'env-tok' })
    await agent.init()
    expect(agent.auth.needsSetup()).toBe(false)
    expect(agent.supervisor.getControllerSecret()).toBe('env-tok')
  })

  it('还没设过密码时不把 KV 的空串回灌成内核 secret，保住随机兜底', async () => {
    const agent = createAgent({ ...opts(), agentToken: undefined })
    await agent.init()
    expect(agent.auth.needsSetup()).toBe(true)
    expect(agent.supervisor.getControllerSecret().length).toBeGreaterThan(0)
  })

  it('PUT /kernel/api 只管端口', async () => {
    const agent = createAgent(opts())
    expect(await agent.updateClashApi({})).toEqual({ ok: false, error: 'port is required' })
    expect(await agent.updateClashApi({ port: 0 })).toMatchObject({ ok: false })
    expect(await agent.updateClashApi({ port: 9099 })).toMatchObject({
      ok: true,
      port: 9099,
      externalController: '127.0.0.1:9099',
      requiresRestart: false,
    })
  })

  it('re-exports the public surface', () => {
    expect(typeof createSupervisor).toBe('function')
    expect(typeof createProfileStore).toBe('function')
    expect(typeof createControlRouter).toBe('function')
    expect(typeof mihomoAsset).toBe('function')
    expect(MIHOMO_VERSION.startsWith('v')).toBe(true)
    expect(Number.isInteger(Number(MIHOMO_VERSION[1]))).toBe(true)
  })
})
