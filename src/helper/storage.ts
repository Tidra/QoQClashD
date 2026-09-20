import type { StorageLike, UseStorageOptions } from '@vueuse/core'
import { useStorage as useVueUseStorage } from '@vueuse/core'
import type { MaybeRefOrGetter, Ref } from 'vue'
import { ref, toValue, watch } from 'vue'
import { whenSessionReady } from './sessionGate'
import { markUnauthorized } from './unauthorized'

const isSessionStorage = (storage?: StorageLike) => storage === sessionStorage
const cloneDefault = <T>(value: T): T => {
  if (value === undefined || value === null) return value
  return structuredClone(value)
}

// 会话 cookie 由浏览器自动带上（同源），这里只负责把 401 报出去。
const jsonHeaders = { 'Content-Type': 'application/json' }

const reportUnauthorized = (response: Response) => {
  if (response.status === 401) markUnauthorized()
}

async function readServerValue<T>(key: string): Promise<T | undefined> {
  await whenSessionReady()
  // 必须 no-store：后端 KV 响应不带任何缓存头，浏览器会启发式缓存 GET 结果。
  // 刷新后读到旧快照、种子修补再把旧快照回写，会静默清掉服务器上真实数据。
  const response = await fetch(`/api/control/storage/kv?key=${encodeURIComponent(key)}`, {
    cache: 'no-store',
  })
  if (!response.ok) {
    reportUnauthorized(response)
    throw new Error(`storage read failed: HTTP ${response.status}`)
  }
  const body = (await response.json()) as { value: string | null }
  return body.value === null ? undefined : (JSON.parse(body.value) as T)
}

async function writeServerValue(key: string, value: unknown) {
  await whenSessionReady()
  const response = await fetch('/api/control/storage/kv', {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify({ key, value: JSON.stringify(value) }),
  })
  if (!response.ok) throw new Error(`storage write failed: HTTP ${response.status}`)
}

/** 一次取整段 KV(值为存储原样的 JSON 字符串),避免按键逐个发请求。 */
export const readKvEntries = async (prefix: string): Promise<Record<string, string>> => {
  await whenSessionReady()
  const response = await fetch(`/api/control/storage/kv?prefix=${encodeURIComponent(prefix)}`, {
    cache: 'no-store',
  })
  if (!response.ok) throw new Error(`storage list failed: HTTP ${response.status}`)
  const body = (await response.json()) as { entries?: Record<string, string> }
  return body.entries ?? {}
}

/** 一次写一整段 KV:只落点名的键,不隐式清空其它键。 */
export const writeKvEntries = async (entries: Record<string, string>) => {
  await whenSessionReady()
  const response = await fetch('/api/control/storage/kv', {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify({ entries }),
  })
  if (!response.ok) throw new Error(`storage bulk write failed: HTTP ${response.status}`)
}

// 水合门控：useStorage 的初始值是默认值，服务器数据要等异步 GET 返回。
// 计数器归零时 resolve，读取失败同样视为完成，保证 await 永不悬挂。
let pendingHydrations = 0
let readyPromise: Promise<void> = Promise.resolve()
let markReady: (() => void) | undefined

const beginHydration = () => {
  pendingHydrations += 1
  if (pendingHydrations === 1) {
    readyPromise = new Promise<void>((resolve) => {
      markReady = resolve
    })
  }
}

const endHydration = () => {
  pendingHydrations = Math.max(0, pendingHydrations - 1)
  if (pendingHydrations === 0) {
    markReady?.()
    markReady = undefined
  }
}

/** 等待当前已创建的全部存储项完成首次服务器读取（读取失败也会 resolve） */
export const whenStorageReady = () => readyPromise

export function useStorage<T>(
  key: MaybeRefOrGetter<string>,
  defaults: MaybeRefOrGetter<T>,
  storage?: StorageLike,
  options?: UseStorageOptions<T>,
) {
  if (isSessionStorage(storage)) {
    return useVueUseStorage(key, defaults, storage, options)
  }

  const currentKey = toValue(key)
  const state = ref(cloneDefault(toValue(defaults))) as Ref<T>
  const loading = ref(true)
  // 水合期间发生的本地修改（种子注入、HMR 后重放等）不能被迟到的服务器旧值覆盖，
  // 且水合结束后要回写服务器，否则修改会两头丢失。
  let localDirty = false
  // 服务器到底读成功没有：失败时服务器状态未知，任何回写都可能覆盖真实数据。
  let readSucceeded = false
  // 最近一次与服务器一致序列化值：跳过内容相同的回显写入（水合回写、克隆赋值等）
  let lastSynced: string | undefined
  beginHydration()
  void readServerValue<T>(currentKey)
    .then((value) => {
      readSucceeded = true
      if (value === undefined) return
      lastSynced = JSON.stringify(value)
      if (!localDirty) state.value = value
    })
    .catch((error) => {
      console.warn(`[storage] ${currentKey} is unavailable`, error)
    })
    .finally(() => {
      loading.value = false
      if (localDirty) {
        if (!readSucceeded) {
          console.error(`[storage] ${currentKey} 未取到服务器值，本地修改不回写，避免覆盖存量数据`)
        } else {
          lastSynced = JSON.stringify(state.value)
          void writeServerValue(currentKey, state.value).catch((error) => {
            console.error(`[storage] failed to persist ${currentKey}`, error)
          })
        }
      }
      endHydration()
    })

  watch(
    state,
    (value) => {
      if (loading.value || !readSucceeded) {
        localDirty = true
        return
      }
      const serialized = JSON.stringify(value)
      if (serialized === lastSynced) return
      lastSynced = serialized
      void writeServerValue(currentKey, value).catch((error) => {
        console.error(`[storage] failed to persist ${currentKey}`, error)
      })
    },
    { deep: true },
  )

  // 暴露 loading 标志：调用方可用 `ref.loading` 判断异步拉取是否完成
  Object.defineProperty(state, 'loading', {
    get: () => loading.value,
    configurable: true,
    enumerable: false,
  })

  return state
}
