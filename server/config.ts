import { resolve } from 'node:path'

export interface RuntimeConfig {
  host: string
  port: number
  runtimeRoot: string
  dataDir: string
  configDir: string
  profilesDir: string
  coreStorageDir: string
  apiHost: string
  apiSecret: string
  agentToken: string
  binaryPath: string
}

const numberEnv = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 && parsed <= 65535 ? parsed : fallback
}

const resolveFromRoot = (root: string, value: string | undefined, fallback: string) =>
  resolve(root, value || fallback)

export function loadRuntimeConfig(): RuntimeConfig {
  const runtimeRoot = resolve(
    process.env.QOQCLASHD_HOME || process.env.METACUBEXD_HOME || process.cwd(),
  )
  const coreStorageDir = resolveFromRoot(runtimeRoot, process.env.CORE_STORAGE_DIR, 'kernel')
  const dataDir = resolveFromRoot(runtimeRoot, process.env.DATA_DIR, 'data')
  const configDir = resolve(dataDir, 'config')
  const profilesDir = resolve(dataDir, 'profiles')

  return {
    host: process.env.PANEL_HOST || '127.0.0.1',
    port: numberEnv(process.env.PANEL_PORT, 5173),
    runtimeRoot,
    dataDir,
    configDir,
    profilesDir,
    coreStorageDir,
    apiHost: process.env.API_HOST || 'http://127.0.0.1:9090',
    apiSecret: process.env.API_SECRET || '',
    agentToken: process.env.CONTROL_TOKEN || process.env.API_SECRET || '',
    binaryPath:
      process.env.MIHOMO_BINARY ||
      resolve(coreStorageDir, process.platform === 'win32' ? 'mihomo.exe' : 'mihomo'),
  }
}

export function normalizeExternalController(apiHost: string): string {
  try {
    const url = new URL(apiHost)
    return `${url.hostname}:${url.port || '9090'}`
  } catch {
    return apiHost.replace(/^https?:\/\//, '').replace(/\/+$/, '') || '127.0.0.1:9090'
  }
}
