import { API_SECRET } from '@/config/env'
import type { StorageLike, UseStorageOptions } from '@vueuse/core'
import type { MaybeRefOrGetter } from 'vue'
import { ref, toValue, watch } from 'vue'
import { useStorage as useVueUseStorage } from '@vueuse/core'

const isSessionStorage = (storage?: StorageLike) => storage === sessionStorage
const cloneDefault = <T>(value: T): T => {
  if (value === undefined || value === null) return value
  return structuredClone(value)
}

const headers = () => ({
  'Content-Type': 'application/json',
  ...(API_SECRET ? { Authorization: `Bearer ${API_SECRET}` } : {}),
})

async function readServerValue<T>(key: string): Promise<T | undefined> {
  const response = await fetch(`/api/control/storage/kv?key=${encodeURIComponent(key)}`, {
    headers: headers(),
  })
  if (!response.ok) throw new Error(`storage read failed: HTTP ${response.status}`)
  const body = (await response.json()) as { value: string | null }
  return body.value === null ? undefined : (JSON.parse(body.value) as T)
}

async function writeServerValue(key: string, value: unknown) {
  const response = await fetch('/api/control/storage/kv', {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify({ key, value: JSON.stringify(value) }),
  })
  if (!response.ok) throw new Error(`storage write failed: HTTP ${response.status}`)
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
  const state = ref(cloneDefault(toValue(defaults))) as { value: T }
  const loading = ref(true)
  // 水合期间发生的本地修改（种子注入、HMR 后重放等）不能被迟到的服务器旧值覆盖，
  // 且水合结束后要回写服务器，否则修改会两头丢失。
  let localDirty = false
  // 最近一次与服务器一致序列化值：跳过内容相同的回显写入（水合回写、克隆赋值等）
  let lastSynced: string | undefined
  beginHydration()
  void readServerValue<T>(currentKey)
    .then((value) => {
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
        lastSynced = JSON.stringify(state.value)
        void writeServerValue(currentKey, state.value).catch((error) => {
          console.error(`[storage] failed to persist ${currentKey}`, error)
        })
      }
      endHydration()
    })

  watch(
    state,
    (value) => {
      if (loading.value) {
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

export function useDbStorage<T>(
  key: MaybeRefOrGetter<string>,
  defaults: MaybeRefOrGetter<T>,
  options?: UseStorageOptions<T>,
) {
  return useStorage(key, defaults, undefined, options)
}
