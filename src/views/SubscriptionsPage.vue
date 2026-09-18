<template>
  <div class="flex h-full flex-col overflow-auto" :style="padding">
    <NodePageHeader>
      <template #search>
        <TextInput v-model="subscriptionSearch" :placeholder="`${$t('search')} | Regex`" clearable class="w-32 max-w-80 flex-1" />
      </template>
      <button type="button" class="btn btn-circle btn-sm" :disabled="!subscriptions.length" :title="$t('subscriptionRefreshAll')" @click="refreshAll">
        <ArrowPathIcon class="h-4 w-4" />
      </button>
      <button type="button" class="btn btn-primary btn-sm" @click="openCreateDialog">
        <PlusIcon class="h-4 w-4" />
        {{ $t('subscriptionAdd') }}
      </button>
    </NodePageHeader>
    <div class="base-container m-3 min-h-0 flex-1 overflow-auto backdrop-blur-none!">
      <div class="table-glass min-h-full min-w-min pb-6">
        <table class="table table-sm">
          <thead class="bg-base-100 border-base-300/60 sticky top-0 z-30 border-b backdrop-blur-none!">
            <tr>
              <th class="min-w-24">{{ $t('subscriptionName') }}</th>
              <th class="min-w-32">{{ $t('subscriptionUrl') }}</th>
              <th class="w-16 whitespace-nowrap">{{ $t('subscriptionStatus') }}</th>
              <th class="w-24 whitespace-nowrap">{{ $t('subscriptionAutoUpdate') }}</th>
              <th class="w-36 whitespace-nowrap">{{ $t('subscriptionUpdatedAt') }}</th>
              <th class="sticky right-0 z-40 bg-base-100 text-right w-40">{{ $t('actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!filteredSubscriptions.length">
              <td colspan="6" class="text-base-content/50 h-90">
                <div class="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
                  <ArrowPathIcon class="h-10 w-10 opacity-60" />
                  <div class="space-y-1">
                    <div class="text-base">{{ $t('subscriptionEmpty') }}</div>
                  </div>
                  <button type="button" class="btn btn-primary btn-sm" @click="openCreateDialog">
                    <PlusIcon class="h-4 w-4" />
                    {{ $t('subscriptionAdd') }}
                  </button>
                </div>
              </td>
            </tr>
            <tr v-for="(item, subIndex) in filteredSubscriptions" :key="item.id" class="hover group" :class="subIndex % 2 === 0 && 'table-row-stripe'">
              <td class="max-w-32 truncate">{{ item.name || 'Untitled subscription' }}</td>
              <td class="max-w-56 truncate">{{ item.url }}</td>
              <td class="whitespace-nowrap">
                <span v-if="subscriptionStatus[item.id] === 'pending'" class="badge badge-xs badge-ghost gap-1">
                  <span class="loading loading-spinner loading-xs"></span>{{ $t('subscriptionRefreshing') }}
                </span>
                <span v-else-if="subscriptionStatus[item.id] === 'error'" class="badge badge-xs badge-error badge-outline" :title="subscriptionError[item.id]">
                  {{ $t('offline') }}
                </span>
                <span v-else class="badge badge-xs" :class="item.enabled ? 'badge-success' : 'badge-ghost'">{{ item.enabled ? $t('online') : $t('offline') }}</span>
              </td>
              <td class="whitespace-nowrap">
                <span v-if="item.autoUpdate" class="badge badge-xs badge-info outline">{{ $t('subscriptionEveryNMinutes', { minutes: item.updateInterval ?? 1440 }) }}</span>
                <span v-else class="text-base-content/40">—</span>
              </td>
              <td class="whitespace-nowrap text-xs">{{ item.updatedAt ? formatDate(item.updatedAt) : $t('subscriptionNeverUpdated') }}</td>
              <td class="pinned-td sticky right-0 z-10 group-hover:bg-base-200! text-right whitespace-nowrap">
                <button type="button" class="btn btn-ghost btn-xs h-6 min-h-6 w-6 p-0" :disabled="!item.enabled || subscriptionStatus[item.id] === 'pending'" :title="$t('subscriptionRefresh')" @click="refreshOne(item.id)">
                  <ArrowPathIcon class="h-3.5 w-3.5" />
                </button>
                <button type="button" class="btn btn-ghost btn-xs" @click="toggleSubscription(item.id)">{{ item.enabled ? $t('offline') : $t('online') }}</button>
                <button type="button" class="btn btn-ghost btn-xs h-6 min-h-6 w-6 p-0" :title="$t('edit')" @click="openEditDialog(item)"><PencilIcon class="h-3.5 w-3.5" /></button>
                <button type="button" class="btn btn-ghost btn-xs h-6 min-h-6 w-6 p-0 text-error" :title="$t('delete')" @click="removeSubscriptionById(item.id)"><TrashIcon class="h-3.5 w-3.5" /></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 订阅 编辑/新建 弹窗：与节点编辑弹窗同款 DialogWrapper + settings-grid -->
    <DialogWrapper
      v-model="dialogOpen"
      :title="editingId ? $t('subscriptionEditTitle') : $t('subscriptionAddTitle')"
      box-class="max-w-xl"
      :show-close-button="false"
    >
      <div class="settings-grid node-form-grid">
        <div class="setting-item node-span-2">
          <div class="setting-item-label">{{ $t('subscriptionName') }}</div>
          <input v-model="form.name" type="text" class="input input-sm w-full max-w-64" placeholder="My subscription" />
        </div>
        <div class="setting-item node-span-2">
          <div class="setting-item-label">{{ $t('subscriptionUrl') }}</div>
          <input v-model="form.url" type="url" class="input input-sm w-full max-w-64" placeholder="https://example.com/sub.yaml" />
        </div>
        <div class="setting-item">
          <div class="setting-item-label">{{ $t('subscriptionEnabled') }}</div>
          <input v-model="form.enabled" type="checkbox" class="toggle" />
        </div>
        <div class="setting-item">
          <div class="setting-item-label">{{ $t('subscriptionAutoUpdate') }}</div>
          <input v-model="form.autoUpdate" type="checkbox" class="toggle" />
        </div>
        <div v-if="form.autoUpdate" class="setting-item node-span-2">
          <div class="setting-item-label">{{ $t('subscriptionUpdateInterval') }} (min)</div>
          <input v-model.number="form.updateInterval" type="number" min="1" step="1" class="input input-sm w-24" />
        </div>
      </div>
      <!-- 操作行 -->
      <div class="flex items-center justify-end gap-2 border-t border-base-300/60 p-4 pt-3">
        <button type="button" class="btn btn-sm btn-ghost" @click="dialogOpen = false">{{ $t('cancel') }}</button>
        <button
          type="button"
          class="btn btn-sm btn-primary"
          :disabled="!hasValidUrl"
          @click="saveSubscription"
        >
          {{ $t('save') }}
        </button>
      </div>
    </DialogWrapper>
  </div>
</template>

<script setup lang="ts">
import { usePaddingForViews } from '@/composables/paddingViews'
import { showNotification } from '@/helper/notification'
import {
  addSubscription,
  refreshAllSubscriptions,
  refreshSubscriptionWithImport,
  removeSubscription,
  subscriptionError,
  subscriptionList,
  subscriptionStatus,
  toggleSubscription,
  updateSubscription,
} from '@/store/subscriptions'
import type { SubscriptionItem } from '@/store/subscriptions'
import { ArrowPathIcon, PencilIcon, PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'
import NodePageHeader from '@/components/proxies/NodePageHeader.vue'
import DialogWrapper from '@/components/common/DialogWrapper.vue'
import TextInput from '@/components/common/TextInput.vue'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { padding } = usePaddingForViews({ offsetTop: 0, offsetBottom: 0 })
const dialogOpen = ref(false)
const editingId = ref<string | null>(null)
const form = ref({ name: '', url: '', enabled: true, autoUpdate: false, updateInterval: 1440 })

const subscriptions = computed(() => subscriptionList.value)
const subscriptionSearch = ref('')
const filteredSubscriptions = computed(() => {
  const keyword = subscriptionSearch.value.trim().toLowerCase()
  if (!keyword) return subscriptions.value
  return subscriptions.value.filter((item) =>
    [item.name, item.url].some((value) => value.toLowerCase().includes(keyword)),
  )
})

const hasValidUrl = computed(() => /^https?:\/\//.test(form.value.url.trim()))

const openCreateDialog = () => {
  editingId.value = null
  form.value = { name: '', url: '', enabled: true, autoUpdate: false, updateInterval: 1440 }
  dialogOpen.value = true
}

const openEditDialog = (item: SubscriptionItem) => {
  editingId.value = item.id
  form.value = {
    name: item.name,
    url: item.url,
    enabled: item.enabled,
    autoUpdate: item.autoUpdate,
    updateInterval: item.updateInterval ?? 1440,
  }
  dialogOpen.value = true
}

const formatDate = (value?: string) => {
  if (!value) return ''
  return new Date(value).toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

const saveSubscription = () => {
  const url = form.value.url.trim()
  if (!url || !hasValidUrl.value) {
    showNotification({ content: 'invalidURL', type: 'alert-error' })
    return
  }

  const payload = {
    name: form.value.name.trim() || 'Subscription',
    url,
    enabled: form.value.enabled,
    autoUpdate: form.value.autoUpdate,
    updateInterval: form.value.autoUpdate
      ? Math.max(1, Math.floor(Number(form.value.updateInterval) || 1440))
      : undefined,
  }

  if (editingId.value) {
    updateSubscription(editingId.value, payload)
  } else {
    addSubscription(payload)
  }

  showNotification({ content: 'subscriptionSaveSuccess', type: 'alert-success' })
  dialogOpen.value = false
}

const removeSubscriptionById = async (id: string) => {
  const { showConfirmDialog } = await import('@/helper/confirmDialog')
  const result = await showConfirmDialog({
    message: t('subscriptionDeleteConfirm'),
    confirmButtonClass: 'btn-error',
  })
  if (!result.confirmed) return
  removeSubscription(id)
}

const refreshOne = async (id: string) => {
  const result = await refreshSubscriptionWithImport(id)
  if (result.ok) {
    showNotification({
      content: t('subscriptionRefreshSuccessWithCount', { count: result.imported }),
      type: 'alert-success',
    })
  }
}

const refreshAll = async () => {
  await refreshAllSubscriptions()
}
</script>
