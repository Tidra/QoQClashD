import { describe, expect, expectTypeOf, it } from 'vitest'
import type {
  KernelState,
  KernelStatus,
  MihomoSupervisor,
  ProfileMeta,
  ProfileStore,
  ProfileType,
  SupervisorOptions,
} from './types'

describe('types', () => {
  it('kernelStatus is the 5-member union', () => {
    const all: KernelStatus[] = ['stopped', 'starting', 'running', 'stopping', 'errored']
    expect(all).toHaveLength(5)
  })

  it('kernelState requires status/externalController, never the api secret', () => {
    const s: KernelState = {
      status: 'running',
      pid: 1234,
      startedAt: Date.now(),
      version: '1.19.27',
      externalController: '127.0.0.1:9090',
      lastExitCode: null,
      lastError: undefined,
    }
    expect(s.externalController).toBe('127.0.0.1:9090')
    // 密码刻意不进可序列化状态：state 会被控制接口和 SSE 帧原样下发。
    expectTypeOf<'secret' extends keyof KernelState ? true : false>().toEqualTypeOf<false>()
    expectTypeOf<MihomoSupervisor['getControllerSecret']>().returns.toEqualTypeOf<string>()
  })

  it('supervisorOptions has required binary/home/active paths', () => {
    const o: SupervisorOptions = {
      binaryPath: '/bin/mihomo',
      homeDir: '/home',
      activeConfigPath: '/home/active.yaml',
    }
    expect(o.startTimeoutMs).toBeUndefined()
  })

  it('profileType union and ProfileMeta shape', () => {
    const t: ProfileType[] = ['local', 'remote']
    const m: ProfileMeta = {
      id: 'p1',
      name: 'home',
      type: 'remote',
      url: 'https://x',
      userAgent: 'clash.meta',
      updatedAt: 1,
      subscriptionInfo: { upload: 1, download: 2, total: 3, expire: 4 },
    }
    expect(t).toContain('local')
    expect(m.subscriptionInfo?.total).toBe(3)
  })

  it('mihomoSupervisor / ProfileStore method signatures', () => {
    expectTypeOf<MihomoSupervisor['start']>().returns.toEqualTypeOf<Promise<KernelState>>()
    expectTypeOf<MihomoSupervisor['validate']>().parameters.toEqualTypeOf<[string]>()
    expectTypeOf<ProfileStore['importFromUrl']>().returns.toEqualTypeOf<Promise<ProfileMeta>>()
    expectTypeOf<ProfileStore['getActiveId']>().returns.toEqualTypeOf<Promise<string | undefined>>()
  })
})
