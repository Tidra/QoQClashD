import { Buffer } from 'node:buffer'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import { fetchRuleSet } from './rulesets'

function tmp() {
  return mkdtempSync(join(tmpdir(), 'mcxd-ruleset-'))
}

const provider = {
  name: 'proxy',
  type: 'http',
  format: 'yaml',
  url: 'https://example.com/proxy.yaml',
  path: './ruleset/proxy.yaml',
}

describe('fetchRuleSet', () => {
  it('downloads the named provider onto its drafted path under homeDir', async () => {
    const home = tmp()
    const requested: string[] = []
    const fakeFetch = vi.fn(async (url: string) => {
      requested.push(url)
      return new Response(Buffer.from('rules-from-upstream'), { status: 200 })
    })

    const result = await fetchRuleSet({
      providers: [provider],
      name: 'proxy',
      homeDir: home,
      fetch: fakeFetch as unknown as typeof fetch,
    })

    expect(result).toEqual({
      name: 'proxy',
      path: join(home, 'ruleset', 'proxy.yaml'),
      bytes: 'rules-from-upstream'.length,
    })
    expect(requested).toEqual([provider.url])
    expect(readFileSync(result.path, 'utf8')).toBe('rules-from-upstream')
    // 临时文件改名后就该消失，不该在 ruleset 目录里留残渣。
    expect(existsSync(`${result.path}.${process.pid}.tmp`)).toBe(false)
  })

  it('accepts an absolute path as long as it stays inside homeDir', async () => {
    const home = tmp()
    const dest = join(home, 'abs.yaml')
    const { path } = await fetchRuleSet({
      providers: [{ ...provider, path: dest }],
      name: 'proxy',
      homeDir: home,
      fetch: vi.fn(async () => new Response(Buffer.from('ok'), { status: 200 })),
    })
    expect(path).toBe(dest)
    expect(readFileSync(dest, 'utf8')).toBe('ok')
  })

  it('refuses paths that escape the kernel home dir', async () => {
    const home = tmp()
    const fakeFetch = vi.fn(async () => new Response(Buffer.from('ok'), { status: 200 }))

    for (const path of ['../outside.yaml', '/etc/passwd', join(tmpdir(), 'elsewhere.yaml')]) {
      const error = await fetchRuleSet({
        providers: [{ ...provider, path }],
        name: 'proxy',
        homeDir: home,
        fetch: fakeFetch as unknown as typeof fetch,
      }).catch((reason: unknown) => reason)
      expect((error as Error).message).toContain('escapes the kernel home dir')
    }
    // 校验在下载之前，一次 fetch 都不该发出去。
    expect(fakeFetch).not.toHaveBeenCalled()
  })

  it('refuses providers the panel cannot download by itself', async () => {
    const home = tmp()
    const fakeFetch = vi.fn(async () => new Response(Buffer.from('ok'), { status: 200 }))
    const cases: { next: Record<string, unknown>; message: string }[] = [
      { next: { type: 'file' }, message: 'has no http url' },
      { next: { type: 'inline' }, message: 'has no http url' },
      { next: { url: '   ' }, message: 'has no http url' },
      { next: { path: '' }, message: 'has no local path' },
    ]

    for (const item of cases) {
      const error = await fetchRuleSet({
        providers: [{ ...provider, ...item.next }],
        name: 'proxy',
        homeDir: home,
        fetch: fakeFetch as unknown as typeof fetch,
      }).catch((reason: unknown) => reason)
      expect((error as Error).message).toContain(item.message)
    }
    expect(fakeFetch).not.toHaveBeenCalled()
  })

  it('names the provider when it is not in the draft list', async () => {
    const error = await fetchRuleSet({
      providers: [provider],
      name: 'missing',
      homeDir: tmp(),
      fetch: vi.fn(async () => new Response(Buffer.from('ok'), { status: 200 })),
    }).catch((reason: unknown) => reason)
    expect((error as Error).message).toContain('rule-set "missing" not found')
  })

  it('treats a non-array draft as empty instead of crashing', async () => {
    const error = await fetchRuleSet({
      providers: null,
      name: 'proxy',
      homeDir: tmp(),
      fetch: vi.fn(async () => new Response(Buffer.from('ok'), { status: 200 })),
    }).catch((reason: unknown) => reason)
    expect((error as Error).message).toContain('not found')
  })

  it('keeps the previous file untouched when the download fails', async () => {
    const home = tmp()
    const dest = join(home, 'ruleset', 'proxy.yaml')
    mkdirSync(dirname(dest), { recursive: true })
    writeFileSync(dest, 'old rules')

    const error = await fetchRuleSet({
      providers: [provider],
      name: 'proxy',
      homeDir: home,
      fetch: vi.fn(async () => new Response('nope', { status: 503 })),
    }).catch((reason: unknown) => reason)

    expect((error as Error).message).toContain('503')
    expect((error as Error).message).toContain('"proxy"')
    expect(readFileSync(dest, 'utf8')).toBe('old rules')
  })
})
