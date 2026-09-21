import { Buffer } from 'node:buffer'
import { existsSync, mkdtempSync, readFileSync, statSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MIHOMO_VERSION } from './assets'
import { fetchKernel, listMihomoVersions } from './fetch-kernel'

function tmp() {
  return mkdtempSync(join(tmpdir(), 'mcxd-fetch-'))
}

describe('fetchKernel', () => {
  afterEach(() => vi.restoreAllMocks())

  it('linux/arm64: hits the exact pinned .gz URL and gunzips the raw binary', async () => {
    const dest = tmp()
    const rawBinary = Buffer.from('\x7FELF-fake-mihomo-binary')
    const requested: string[] = []
    const fakeFetch = vi.fn(async (url: string) => {
      requested.push(url)
      return new Response(gzipSync(rawBinary), { status: 200 })
    })

    const { binPath } = await fetchKernel('linux', 'arm64', dest, {
      fetch: fakeFetch as unknown as typeof fetch,
    })

    expect(requested).toEqual([
      `https://github.com/MetaCubeX/mihomo/releases/download/${MIHOMO_VERSION}/mihomo-linux-arm64-${MIHOMO_VERSION}.gz`,
    ])
    expect(binPath).toBe(join(dest, 'mihomo'))
    // The written file is the RAW binary (gunzipped), NOT the gz bytes and NOT a tar.
    expect(readFileSync(binPath)).toEqual(rawBinary)
  })

  it('linux/amd64: uses the -compatible asset', async () => {
    const dest = tmp()
    const fakeFetch = vi.fn(async () => new Response(gzipSync(Buffer.from('bin')), { status: 200 }))
    await fetchKernel('linux', 'amd64', dest, {
      fetch: fakeFetch as unknown as typeof fetch,
    })
    expect((fakeFetch.mock.calls as unknown as [string][][])[0]![0] as unknown as string).toContain(
      `mihomo-linux-amd64-compatible-${MIHOMO_VERSION}.gz`,
    )
  })

  it('chmods the binary 0o755 on posix', async () => {
    const dest = tmp()
    const fakeFetch = vi.fn(async () => new Response(gzipSync(Buffer.from('bin')), { status: 200 }))
    const { binPath } = await fetchKernel('darwin', 'arm64', dest, {
      fetch: fakeFetch as unknown as typeof fetch,
    })
    if (process.platform !== 'win32') {
      expect(statSync(binPath).mode & 0o777).toBe(0o755)
    }
  })

  it('首次下载把摘要写进账本，同一资产再次下载算作已核对', async () => {
    const dest = tmp()
    const rawBinary = Buffer.from('same-bytes-every-time')
    const fakeFetch = vi.fn(async () => new Response(gzipSync(rawBinary), { status: 200 }))
    const opts = { fetch: fakeFetch as unknown as typeof fetch }

    const first = await fetchKernel('linux', 'arm64', dest, opts)
    expect(first.verified).toBe(false)
    const ledgerPath = join(dest, 'kernel-sha256.json')
    expect(JSON.parse(readFileSync(ledgerPath, 'utf8'))).toEqual({
      [`mihomo-linux-arm64-${MIHOMO_VERSION}.gz`]: first.sha256,
    })

    const second = await fetchKernel('linux', 'arm64', dest, opts)
    expect(second.verified).toBe(true)
    expect(second.sha256).toBe(first.sha256)
    // 摘要没变就不该重写账本
    expect(JSON.parse(readFileSync(ledgerPath, 'utf8'))).toEqual({
      [`mihomo-linux-arm64-${MIHOMO_VERSION}.gz`]: first.sha256,
    })
  })

  it('同一资产摘要变了就拒绝落盘，保留原二进制', async () => {
    const dest = tmp()
    const original = Buffer.from('genuine-mihomo')
    const swapped = Buffer.from('trojanized-binary!!')
    let served = original
    const fakeFetch = vi.fn(async () => new Response(gzipSync(served), { status: 200 }))
    const beforeWrite = vi.fn(async () => {})
    const opts = { fetch: fakeFetch as unknown as typeof fetch, beforeWrite }

    await fetchKernel('linux', 'arm64', dest, opts)
    served = swapped
    beforeWrite.mockClear()

    await expect(fetchKernel('linux', 'arm64', dest, opts)).rejects.toThrow(/SHA-256/)
    // 被替换的二进制绝不能覆盖已核对过的那份，也不给它 chmod 执行位的机会
    expect(readFileSync(join(dest, 'mihomo'))).toEqual(original)
    // 校验不通过就不该惊动正在跑的内核（beforeWrite 的唯一用途是腾出文件锁）
    expect(beforeWrite).not.toHaveBeenCalled()
  })

  it('beforeWrite 在覆盖二进制之前调用', async () => {
    const dest = tmp()
    const original = Buffer.from('running-binary')
    const raw = join(dest, 'mihomo')
    await writeFile(raw, original)
    const beforeWrite = vi.fn(async () => {
      // 钩子跑的时候旧二进制必须还在：Windows 上先停内核才谈得上覆盖
      expect(readFileSync(raw)).toEqual(original)
    })
    const fakeFetch = vi.fn(
      async () => new Response(gzipSync(Buffer.from('brand-new')), { status: 200 }),
    )

    await fetchKernel('linux', 'arm64', dest, {
      fetch: fakeFetch as unknown as typeof fetch,
      beforeWrite,
    })
    expect(beforeWrite).toHaveBeenCalledTimes(1)
    expect(readFileSync(raw)).not.toEqual(original)
  })

  it('取消发生在收流途中：拒绝、不落盘、也不惊动 beforeWrite', async () => {
    const dest = tmp()
    const abort = new AbortController()
    const beforeWrite = vi.fn(async () => {})
    const fakeFetch = vi.fn(async () => {
      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(Buffer.from('first-chunk'))
          // 之后不再推进：这趟下载只能靠取消收场
        },
      })
      return new Response(stream, { status: 200 })
    })

    const pending = fetchKernel('linux', 'arm64', dest, {
      fetch: fakeFetch as unknown as typeof fetch,
      signal: abort.signal,
      // 第一块到手即取消：模拟用户点了「取消下载」
      onProgress: () => abort.abort(),
      beforeWrite,
    })

    await expect(pending).rejects.toThrow('下载已取消')
    expect(beforeWrite).not.toHaveBeenCalled()
    expect(existsSync(join(dest, 'mihomo'))).toBe(false)
  })

  it('取消发生在解包之后、落盘之前：保留原有二进制', async () => {
    const dest = tmp()
    const original = Buffer.from('running-binary')
    await writeFile(join(dest, 'mihomo.exe'), original)
    const abort = new AbortController()
    const beforeWrite = vi.fn(async () => {})
    const fakeFetch = vi.fn(
      async () => new Response(Buffer.from('zip-archive-bytes'), { status: 200 }),
    )

    await expect(
      fetchKernel('win32', 'amd64', dest, {
        fetch: fakeFetch as unknown as typeof fetch,
        signal: abort.signal,
        unzipEntry: async () => {
          abort.abort()
          return Buffer.from('brand-new-exe')
        },
        beforeWrite,
      }),
    ).rejects.toThrow('下载已取消')
    expect(beforeWrite).not.toHaveBeenCalled()
    expect(readFileSync(join(dest, 'mihomo.exe'))).toEqual(original)
  })

  it('windows: unzips and extracts mihomo.exe via injected unzipEntry', async () => {
    const dest = tmp()
    const exeBytes = Buffer.from('MZ-fake-exe')
    const fakeFetch = vi.fn(
      async () => new Response(Buffer.from('zip-archive-bytes'), { status: 200 }),
    )
    const unzipEntry = vi.fn(async (_buf: Buffer, entry: string) => {
      // the zip entry is the un-versioned full name, not the output binName
      expect(entry).toBe('mihomo-windows-amd64-compatible.exe')
      return exeBytes
    })
    const { binPath } = await fetchKernel('win32', 'amd64', dest, {
      fetch: fakeFetch as unknown as typeof fetch,
      unzipEntry,
    })
    expect(binPath).toBe(join(dest, 'mihomo.exe'))
    expect(readFileSync(binPath)).toEqual(exeBytes)
    expect(unzipEntry).toHaveBeenCalledOnce()
  })

  it('throws on non-200 response', async () => {
    const dest = tmp()
    const fakeFetch = vi.fn(async () => new Response('not found', { status: 404 }))
    await expect(
      fetchKernel('linux', 'arm64', dest, {
        fetch: fakeFetch as unknown as typeof fetch,
      }),
    ).rejects.toThrow('404')
  })

  it('never targets a legacy -go1xx asset name', async () => {
    const dest = tmp()
    const fakeFetch = vi.fn(async () => new Response(gzipSync(Buffer.from('bin')), { status: 200 }))
    await fetchKernel('linux', 'arm64', dest, {
      fetch: fakeFetch as unknown as typeof fetch,
    })
    expect(
      (fakeFetch.mock.calls as unknown as [string][][])[0]![0] as unknown as string,
    ).not.toContain('-go')
  })

  it('uses an injected version for the download URL', async () => {
    const dest = tmp()
    const requested: string[] = []
    const fakeFetch = vi.fn(async (url: string) => {
      requested.push(url)
      return new Response(gzipSync(Buffer.from('bin')), { status: 200 })
    })
    const { binPath } = await fetchKernel('linux', 'arm64', dest, {
      fetch: fakeFetch as unknown as typeof fetch,
      version: 'v1.18.0',
    })
    expect(requested).toEqual([
      'https://github.com/MetaCubeX/mihomo/releases/download/v1.18.0/mihomo-linux-arm64-v1.18.0.gz',
    ])
    expect(binPath).toBe(join(dest, 'mihomo'))
  })

  it('defaults to MIHOMO_VERSION when no version is injected', async () => {
    const dest = tmp()
    const requested: string[] = []
    const fakeFetch = vi.fn(async (url: string) => {
      requested.push(url)
      return new Response(gzipSync(Buffer.from('bin')), { status: 200 })
    })
    await fetchKernel('linux', 'arm64', dest, {
      fetch: fakeFetch as unknown as typeof fetch,
    })
    expect(requested[0]).toContain(`/download/${MIHOMO_VERSION}/`)
  })

  it('onProgress 逐块上报累计字节与 Content-Length 总量', async () => {
    const dest = tmp()
    // 分块必须能重组成合法 gzip：fetchKernel 收到完整字节后会 gunzip。
    const body = gzipSync(Buffer.from('streamed-binary'))
    const chunks = [body.subarray(0, 4), body.subarray(4, 9), body.subarray(9)]
    const fakeFetch = vi.fn(async () => {
      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          for (const chunk of chunks) controller.enqueue(chunk)
          controller.close()
        },
      })
      return new Response(stream, {
        status: 200,
        headers: { 'content-length': String(body.length) },
      })
    })
    const progress: [number, number][] = []
    const { binPath } = await fetchKernel('linux', 'arm64', dest, {
      fetch: fakeFetch as unknown as typeof fetch,
      onProgress: (downloaded, total) => progress.push([downloaded, total]),
    })
    expect(readFileSync(binPath)).toEqual(Buffer.from('streamed-binary'))
    expect(progress).toEqual([
      [4, body.length],
      [9, body.length],
      [body.length, body.length],
    ])
  })

  it('服务端不给 Content-Length 时 total 报 0，累计字节仍然上报', async () => {
    const dest = tmp()
    const body = gzipSync(Buffer.from('no-length-binary'))
    const fakeFetch = vi.fn(async () => {
      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(body)
          controller.close()
        },
      })
      return new Response(stream, { status: 200 })
    })
    const progress: [number, number][] = []
    await fetchKernel('linux', 'arm64', dest, {
      fetch: fakeFetch as unknown as typeof fetch,
      onProgress: (downloaded, total) => progress.push([downloaded, total]),
    })
    expect(progress).toEqual([[body.length, 0]])
  })
})

describe('listMihomoVersions', () => {
  afterEach(() => vi.restoreAllMocks())

  function releasesPayload() {
    return [
      { tag_name: 'Prerelease-Alpha' },
      { tag_name: 'v1.19.27' },
      { tag_name: 'v1.18.0' },
      { tag_name: 'v1.19.2' },
      { tag_name: 'v1.19.10' },
      { tag_name: 'latest' },
      { tag_name: 'v1.20.0-beta.1' },
    ]
  }

  it('parses, filters non-version tags, and sorts descending', async () => {
    const requested: string[] = []
    const fakeFetch = vi.fn(async (url: string) => {
      requested.push(url)
      return new Response(JSON.stringify(releasesPayload()), { status: 200 })
    })

    const versions = await listMihomoVersions({
      fetch: fakeFetch as unknown as typeof fetch,
    })

    expect(requested).toEqual(['https://api.github.com/repos/MetaCubeX/mihomo/releases'])
    // Only semantic-version tags, newest first.
    expect(versions).toEqual(['v1.20.0-beta.1', 'v1.19.27', 'v1.19.10', 'v1.19.2', 'v1.18.0'])
    // Drops the rolling prerelease + non-version tags.
    expect(versions).not.toContain('Prerelease-Alpha')
    expect(versions).not.toContain('latest')
  })

  it('sends a User-Agent header (GitHub API requires it)', async () => {
    let seenHeaders: Record<string, string> = {}
    const fakeFetch = vi.fn(async (_url: string, init?: RequestInit) => {
      seenHeaders = (init?.headers ?? {}) as Record<string, string>
      return new Response(JSON.stringify(releasesPayload()), { status: 200 })
    })
    await listMihomoVersions({ fetch: fakeFetch as unknown as typeof fetch })
    expect(seenHeaders['User-Agent']).toBeTruthy()
  })

  it('authenticates GitHub release requests when a token is configured (#2135)', async () => {
    let seenHeaders: Record<string, string> = {}
    const fakeFetch = vi.fn(async (_url: string, init?: RequestInit) => {
      seenHeaders = (init?.headers ?? {}) as Record<string, string>
      return new Response(JSON.stringify(releasesPayload()), { status: 200 })
    })

    await listMihomoVersions({
      fetch: fakeFetch as unknown as typeof fetch,
      githubToken: 'github-token',
    })

    expect(seenHeaders).toMatchObject({
      Accept: 'application/vnd.github+json',
      Authorization: 'Bearer github-token',
    })
  })

  it('throws on a non-200 response', async () => {
    const fakeFetch = vi.fn(async () => new Response('rate limited', { status: 403 }))
    await expect(
      listMihomoVersions({ fetch: fakeFetch as unknown as typeof fetch }),
    ).rejects.toThrow('403')
  })
})
