import { Buffer } from 'node:buffer'
import { mkdir, rename, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

/**
 * Canonical download sources for mihomo's default geo data. Centralized so the
 * exact URL per file is asserted in tests and easy to bump.
 *
 * geoip.dat / geosite.dat / country.mmdb all ship from meta-rules-dat's rolling
 * `latest` release, which is the source mihomo documents for its default geodata.
 */
export const GEO_ASSET_URLS = {
  'geoip.dat': 'https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geoip.dat',
  'geosite.dat': 'https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geosite.dat',
  'country.mmdb':
    'https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/country.mmdb',
} as const

export type GeoAssetFile = keyof typeof GEO_ASSET_URLS

const GEO_FILES = Object.keys(GEO_ASSET_URLS) as GeoAssetFile[]

/** 三件套一共几个文件，日志用它说「下到第几个被掐了」。 */
export const GEO_ASSET_FILE_COUNT = GEO_FILES.length

export interface FetchGeoAssetsDeps {
  fetch?: typeof fetch
  /** 取消这趟下载。掐在写盘之前，所以被取消不会留下半个 .dat。 */
  signal?: AbortSignal
  /** 每落一个文件回调一次：三件套在慢网络下要下十几分钟，调用方靠它逐个记日志行。 */
  onWritten?: (file: GeoAssetFile, bytes: number) => void
}

/**
 * Download mihomo's default geo data (geoip.dat, geosite.dat, country.mmdb) into
 * `destDir` (the kernel home dir). `fetch` is injectable for tests; a non-OK
 * response throws a clear error naming the file and status. Returns the list of
 * written file names.
 */
export async function fetchGeoAssets(
  destDir: string,
  deps: FetchGeoAssetsDeps = {},
): Promise<{ files: string[] }> {
  const doFetch = deps.fetch ?? fetch
  await mkdir(destDir, { recursive: true })

  const files: string[] = []
  for (const file of GEO_FILES) {
    const url = GEO_ASSET_URLS[file]
    const res = await doFetch(url, { signal: deps.signal })
    if (!res.ok) {
      throw new Error(`fetchGeoAssets: download failed ${res.status} for ${file} (${url})`)
    }
    const bytes = Buffer.from(await res.arrayBuffer())

    // 和规则集合一样先写临时文件再改名：下载被掐断时不能顶掉内核正在读的那份。
    const dest = join(destDir, file)
    const tmp = `${dest}.${process.pid}.tmp`
    await writeFile(tmp, bytes)
    await rename(tmp, dest)
    deps.onWritten?.(file, bytes.length)
    files.push(file)
  }
  return { files }
}
