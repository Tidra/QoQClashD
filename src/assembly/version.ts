// 组装层 · 版本与升级。
// 版本字符串是 core 轴(assembly/backend.ts)的唯一来源:这里探测完成后写入 core,
// 每次重开会话时先重置为 'unknown',避免沿用上一次探测的结论。
import { fetchClashVersion, restartCoreAPI, upgradeCoreAPI } from '@/api/clash'
import HonkLogo from '@/assets/images/honk.svg'
import MetacubexLogo from '@/assets/images/metacubex.jpg'
import { MIHOMO, MIHOMO_CHANNEL } from '@/constant'
import { autoUpgradeCore, checkUpgradeCore } from '@/store/settings'
import { computed, ref } from 'vue'
import { can, core, Core, resetCore } from './backend'

export const version = ref()
export const isCoreUpdateAvailable = ref(false)

// honk 的 /version 返回 "honk <semver>"(见 honk-core/src/clash_api.rs 的 version handler)。
const detectCore = (versionString: string): Core => {
  if (!versionString) return Core.Unknown
  if (/\bhonk\b/i.test(versionString)) return Core.Honk
  return Core.Mihomo
}

// 内核品牌的展示信息(logo / 官网链接)。纯展示,不是能力门控,故允许 view 使用。
export const coreBrand = computed(() => {
  switch (core.value) {
    case Core.Honk:
      return { logo: HonkLogo, url: 'https://github.com/Glassyiris/honk' }
    default:
      return {
        logo: MetacubexLogo,
        url: MIHOMO_CHANNEL[mihomo.value?.[0] ?? MIHOMO.Meta].url,
      }
  }
})

export const mihomo = computed<[MIHOMO, string] | undefined>(() => {
  if (core.value !== Core.Mihomo) return undefined

  const match = /(alpha-smart|alpha|beta|meta)-?(\w+)/.exec(version.value)
  switch (match?.[1]) {
    case 'alpha':
      return [MIHOMO.Alpha, match[2] ?? version.value]
    case 'alpha-smart':
      return [MIHOMO.Smart, match[2] ?? version.value]
    case 'meta':
      return [MIHOMO.Meta, match[2] ?? version.value]
    default:
      return [MIHOMO.Meta, version.value]
  }
})

export const fetchVersionAPI = () => fetchClashVersion()

const probeKernelVersion = async () => {
  const { data } = await fetchVersionAPI()

  version.value = data?.version || ''
  core.value = detectCore(version.value)

  if (!can('coreUpdateCheck') || !checkUpgradeCore.value) return

  isCoreUpdateAvailable.value = await checkCoreUpdateAvailable()

  if (isCoreUpdateAvailable.value && autoUpgradeCore.value) {
    // 自动升级不是用户点的,失败静默
    upgradeCoreAPI('auto').catch(() => {})
  }
}

// 把上一次的探测结论清干净。每次重开会话前先清,再由 probeKernel 重新填。
export const resetKernelProbe = () => {
  resetCore()
  version.value = ''
  isCoreUpdateAvailable.value = false
}

// 由 assembly/session 在每次会话开始时调用:先清,再重新探测。
// 探测不 await —— 调用方要的是「立即返回」,失败也不该打断数据流的重建。
export const probeKernel = () => {
  resetKernelProbe()
  return probeKernelVersion().catch(() => {})
}

const CACHE_DURATION = 1000 * 60 * 60

interface CacheEntry<T> {
  timestamp: number
  version: string
  data: T
}

async function fetchWithLocalCache<T>(url: string, version: string): Promise<T> {
  const cacheKey = 'cache/' + url
  const cacheRaw = localStorage.getItem(cacheKey)

  if (cacheRaw) {
    try {
      const cache: CacheEntry<T> = JSON.parse(cacheRaw)
      const now = Date.now()

      if (now - cache.timestamp < CACHE_DURATION && cache.version === version) {
        return cache.data
      } else {
        localStorage.removeItem(cacheKey)
      }
    } catch (e) {
      console.warn('Failed to parse cache for', url, e)
    }
  }

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Fetch failed: ${response.status} ${response.statusText}`)
  }

  const data: T = await response.json()
  const newCache: CacheEntry<T> = {
    timestamp: Date.now(),
    version,
    data,
  }

  localStorage.setItem(cacheKey, JSON.stringify(newCache))
  return data
}

const check = async (url: string, versionNumber: string) => {
  const { assets } = await fetchWithLocalCache<{ assets: { name: string }[] }>(url, versionNumber)
  const alreadyLatest = assets.some(({ name }) => name.includes(versionNumber))

  return !alreadyLatest
}

const checkCoreUpdateAvailable = async () => {
  return await check(
    MIHOMO_CHANNEL[mihomo.value?.[0] ?? MIHOMO.Meta].check_update_url,
    mihomo.value?.[1] ?? version.value,
  )
}

// 内核维护动作(Clash 专属,无后端分支),经版本域门面暴露给 view。
export { restartCoreAPI, upgradeCoreAPI }
