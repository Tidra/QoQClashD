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
  void readServerValue<T>(currentKey)
    .then((value) => {
      if (value !== undefined) state.value = value
    })
    .catch((error) => {
      console.warn(`[storage] ${currentKey} is unavailable`, error)
    })
    .finally(() => {
      loading.value = false
    })

  watch(
    state,
    (value) => {
      if (loading.value) return
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
