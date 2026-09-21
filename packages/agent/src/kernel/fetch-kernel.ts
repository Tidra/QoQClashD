import { Buffer } from 'node:buffer'
import { createHash } from 'node:crypto'
import { chmod, mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { gunzipSync } from 'node:zlib'
import { MIHOMO_VERSION, applyMirror, mihomoAsset } from './assets'
import { unzipEntry as defaultUnzipEntry } from './unzip-entry'

// mihomo 的 release 不提供任何校验文件（没有 SHA256SUMS / checksums.txt，GitHub
// API 也不暴露资产摘要），所以只能自己记账：首次下载把可执行文件的 SHA-256 写进
// 内核目录的账本，之后同一资产再下载必须一致，否则视为被替换、直接拒绝。
// 这挡不住首次下载本身，但能挡住镜像站事后偷换二进制。
const LEDGER_FILE = 'kernel-sha256.json'

type DigestLedger = Record<string, string>

const sha256 = (buf: Buffer) => createHash('sha256').update(buf).digest('hex')

async function readLedger(path: string): Promise<DigestLedger> {
  try {
    const parsed = JSON.parse(await readFile(path, 'utf8')) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    const entries = Object.entries(parsed as Record<string, unknown>).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string',
    )
    return Object.fromEntries(entries)
  } catch {
    // 文件不存在或损坏都按"还没有账本"处理
    return {}
  }
}

export interface FetchKernelDeps {
  fetch?: typeof fetch
  /** mihomo release tag to download; defaults to MIHOMO_VERSION. */
  version?: string
  /** KERNEL_MIRRORS whitelist key; unknown/omitted falls back to direct. */
  mirror?: string
  /**
   * Extract a single entry from a .zip buffer. Injected in tests; the default
   * shells out to the platform's unzip and is covered by MANUAL smoke testing.
   */
  unzipEntry?: (buf: Buffer, entry: string) => Promise<Buffer>
}

export async function fetchKernel(
  os: string,
  arch: string,
  destDir: string,
  deps: FetchKernelDeps = {},
): Promise<{ binPath: string; sha256: string; verified: boolean }> {
  const doFetch = deps.fetch ?? fetch
  const unzipEntry = deps.unzipEntry ?? defaultUnzipEntry
  const asset = mihomoAsset(os, arch, deps.version ?? MIHOMO_VERSION)
  const url = applyMirror(asset.url, deps.mirror)

  const res = await doFetch(url)
  if (!res.ok) {
    throw new Error(`fetchKernel: download failed ${res.status} for ${url}`)
  }
  const downloaded = Buffer.from(await res.arrayBuffer())

  let binary: Buffer
  if (asset.ext === 'gz') {
    // .gz is a RAW single-file binary — gunzip, NEVER tar.
    binary = gunzipSync(downloaded)
  } else {
    // .zip — extract the archive's binary entry (its name differs from binName).
    binary = await unzipEntry(downloaded, asset.zipEntry ?? asset.binName)
  }

  await mkdir(destDir, { recursive: true })
  const binPath = join(destDir, asset.binName)
  const ledgerPath = join(destDir, LEDGER_FILE)
  const digest = sha256(binary)
  const ledger = await readLedger(ledgerPath)
  const known = ledger[asset.name]
  if (known && known !== digest) {
    throw new Error(
      `fetchKernel: SHA-256 与 ${LEDGER_FILE} 里记录的不一致，已拒绝写入\n` +
        `  asset:    ${asset.name}\n` +
        `  expected: ${known}\n` +
        `  actual:   ${digest}\n` +
        `  镜像站可能替换了二进制。确认无误后再删除账本条目重试。`,
    )
  }
  await writeFile(binPath, binary)
  if (process.platform !== 'win32') {
    await chmod(binPath, 0o755)
  }
  if (!known) {
    // 只有真正落盘成功才记账，避免把一次失败下载的首次摘要固化下来。
    await writeFile(ledgerPath, JSON.stringify({ ...ledger, [asset.name]: digest }, null, 2))
  }
  return { binPath, sha256: digest, verified: Boolean(known) }
}

const RELEASES_URL = 'https://api.github.com/repos/MetaCubeX/mihomo/releases'
// Keep `vX.Y...` tags; drop the rolling 'Prerelease-Alpha' and any non-version tags.

function isAsciiDigits(value: string): boolean {
  if (!value) return false
  for (const char of value) {
    if (char < '0' || char > '9') return false
  }
  return true
}

function isVersionTag(tag: string): boolean {
  if (!tag.startsWith('v')) return false
  const prereleaseIndex = tag.indexOf('-')
  const core = tag.slice(1, prereleaseIndex === -1 ? undefined : prereleaseIndex)
  const parts = core.split('.')
  return parts.length >= 2 && parts.every(isAsciiDigits)
}

interface GithubRelease {
  tag_name?: string
}

/** Compare two `v\d+.\d+.\d+...` tags numerically, descending. */
function compareTagsDesc(a: string, b: string): number {
  const parse = (t: string) =>
    t
      .slice(1)
      .replaceAll('-', '.')
      .split('.')
      .map((p) => Number.parseInt(p, 10))
  const pa = parse(a)
  const pb = parse(b)
  const len = Math.max(pa.length, pb.length)
  for (let i = 0; i < len; i++) {
    const x = pa[i] ?? 0
    const y = pb[i] ?? 0
    // Pre-release segments (NaN) sort below their release counterpart.
    if (Number.isNaN(x) && Number.isNaN(y)) continue
    if (Number.isNaN(x)) return 1
    if (Number.isNaN(y)) return -1
    if (x !== y) return y - x
  }
  return b.localeCompare(a)
}

/**
 * List installable mihomo kernel versions from GitHub releases, newest first.
 * Filters to semantic-version tags only. `fetch` is injectable for tests.
 */
export async function listMihomoVersions(
  deps: { fetch?: typeof fetch; githubToken?: string } = {},
): Promise<string[]> {
  const doFetch = deps.fetch ?? fetch
  const headers: Record<string, string> = {
    'User-Agent': 'metacubexd-agent',
    Accept: 'application/vnd.github+json',
  }
  if (deps.githubToken) {
    headers.Authorization = `Bearer ${deps.githubToken}`
  }
  const res = await doFetch(RELEASES_URL, {
    headers,
  })
  if (!res.ok) {
    throw new Error(`listMihomoVersions: failed ${res.status} for ${RELEASES_URL}`)
  }
  const releases = (await res.json()) as GithubRelease[]
  return releases
    .map((r) => r.tag_name)
    .filter((t): t is string => typeof t === 'string' && isVersionTag(t))
    .sort(compareTagsDesc)
}
