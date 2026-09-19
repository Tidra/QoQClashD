export const MIHOMO_VERSION = process.env.MIHOMO_VERSION ?? 'v1.19.27'

const OS_MAP: Record<string, 'linux' | 'darwin' | 'windows'> = {
  linux: 'linux',
  darwin: 'darwin',
  win32: 'windows',
  windows: 'windows',
}

const ARCH_MAP: Record<string, 'amd64' | 'arm64'> = {
  x64: 'amd64',
  amd64: 'amd64',
  arm64: 'arm64',
}

/**
 * GitHub release 加速前缀白名单：key 为仓库选择项，value 为拼在原始下载链接
 * 前的代理前缀（空串 = 直连 GitHub）。只允许这些固定前缀，避免下载 URL 被
 * 任意注入。
 */
export const KERNEL_MIRRORS: Record<string, string> = {
  direct: '',
  'gh-proxy': 'https://gh-proxy.com/',
  ghfast: 'https://ghfast.top/',
  ghproxy: 'https://mirror.ghproxy.com/',
}

export function applyMirror(url: string, mirror?: string): string {
  if (!mirror || mirror === 'direct') return url
  const prefix = KERNEL_MIRRORS[mirror]
  return prefix ? `${prefix}${url}` : url
}

export interface MihomoAsset {
  name: string
  url: string
  ext: 'gz' | 'zip'
  binName: 'mihomo' | 'mihomo.exe'
  /**
   * The entry to extract from a `.zip` (Windows). It is the UN-versioned full
   * name inside the archive (e.g. `mihomo-windows-amd64-compatible.exe`), which
   * differs from the output `binName` (`mihomo.exe`). Undefined for `.gz`.
   */
  zipEntry?: string
}

export function mihomoAsset(
  os: string,
  arch: string,
  version: string = MIHOMO_VERSION,
): MihomoAsset {
  const o = OS_MAP[os]
  if (!o) throw new Error(`unsupported os: ${os}`)
  const a = ARCH_MAP[arch]
  if (!a) throw new Error(`unsupported arch: ${arch}`)

  const ext = o === 'windows' ? 'zip' : 'gz'
  const variant = a === 'amd64' ? '-compatible' : ''
  const name = `mihomo-${o}-${a}${variant}-${version}.${ext}`
  return {
    name,
    url: `https://github.com/MetaCubeX/mihomo/releases/download/${version}/${name}`,
    ext,
    binName: o === 'windows' ? 'mihomo.exe' : 'mihomo',
    zipEntry: ext === 'zip' ? `mihomo-${o}-${a}${variant}.exe` : undefined,
  }
}
