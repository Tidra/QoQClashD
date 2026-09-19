<template>
  <div
    class="flex h-full flex-col overflow-auto"
    :style="padding"
  >
    <NodePageHeader>
      <template #search>
        <TextInput
          v-model="subscriptionSearch"
          :placeholder="`${$t('search')} | Regex`"
          clearable
          class="w-32 max-w-80 flex-1"
        />
      </template>
      <button
        type="button"
        class="btn btn-circle btn-sm"
        :disabled="!subscriptions.length"
        :title="$t('subscriptionRefreshAll')"
        @click="refreshAll"
      >
        <ArrowPathIcon class="h-4 w-4" />
      </button>
      <button
        type="button"
        class="btn btn-primary btn-sm"
        @click="openCreateDialog"
      >
        <PlusIcon class="h-4 w-4" />
        {{ $t('subscriptionAdd') }}
      </button>
    </NodePageHeader>
    <div class="base-container m-3 min-h-0 flex-1 overflow-auto backdrop-blur-none!">
      <div class="table-glass min-h-full min-w-min pb-6">
        <table class="table-sm table">
          <thead
            class="bg-base-100 border-base-300/60 sticky top-0 z-30 border-b backdrop-blur-none!"
          >
            <tr>
              <th class="min-w-24">{{ $t('subscriptionName') }}</th>
              <th class="min-w-32">{{ $t('subscriptionUrl') }}</th>
              <th class="w-16 whitespace-nowrap">{{ $t('subscriptionStatus') }}</th>
              <th class="w-24 whitespace-nowrap">{{ $t('subscriptionAutoUpdate') }}</th>
              <th class="w-36 whitespace-nowrap">{{ $t('subscriptionUpdatedAt') }}</th>
              <th class="bg-base-100 sticky right-0 z-40 w-40 text-right">{{ $t('actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!filteredSubscriptions.length">
              <td
                colspan="6"
                class="text-base-content/50 h-90"
              >
                <div
                  class="flex h-full flex-col items-center justify-center gap-3 px-6 text-center"
                >
                  <ArrowPathIcon class="h-10 w-10 opacity-60" />
                  <div class="space-y-1">
                    <div class="text-base">{{ $t('subscriptionEmpty') }}</div>
                  </div>
                  <button
                    type="button"
                    class="btn btn-primary btn-sm"
                    @click="openCreateDialog"
                  >
                    <PlusIcon class="h-4 w-4" />
                    {{ $t('subscriptionAdd') }}
                  </button>
                </div>
              </td>
            </tr>
            <tr
              v-for="(item, subIndex) in filteredSubscriptions"
              :key="item.id"
              class="hover group"
              :class="subIndex % 2 === 0 && 'table-row-stripe'"
            >
              <td class="max-w-32 truncate">{{ item.name || 'Untitled subscription' }}</td>
              <td class="max-w-56 truncate">{{ item.url }}</td>
              <td class="whitespace-nowrap">
                <span
                  v-if="subscriptionStatus[item.id] === 'pending'"
                  class="badge badge-xs badge-ghost gap-1"
                >
                  <span class="loading loading-spinner loading-xs"></span
                  >{{ $t('subscriptionRefreshing') }}
                </span>
                <span
                  v-else-if="subscriptionStatus[item.id] === 'error'"
                  class="badge badge-xs badge-error badge-outline"
                  :title="subscriptionError[item.id]"
                >
                  {{ $t('offline') }}
                </span>
                <span
                  v-else
                  class="badge badge-xs"
                  :class="item.enabled ? 'badge-success' : 'badge-ghost'"
                  >{{ item.enabled ? $t('online') : $t('offline') }}</span
                >
              </td>
              <td class="whitespace-nowrap">
                <span
                  v-if="item.autoUpdate"
                  class="badge badge-xs badge-info outline"
                  >{{
                    $t('subscriptionEveryNMinutes', { minutes: item.updateInterval ?? 1440 })
                  }}</span
                >
                <span
                  v-else
                  class="text-base-content/40"
                  >—</span
                >
              </td>
              <td class="text-xs whitespace-nowrap">
                {{ item.updatedAt ? formatDate(item.updatedAt) : $t('subscriptionNeverUpdated') }}
              </td>
              <td class="pinned-td sticky right-0 z-10 text-right whitespace-nowrap">
                <button
                  type="button"
                  class="btn btn-ghost btn-xs h-6 min-h-6 w-6 p-0"
                  :disabled="!item.enabled || subscriptionStatus[item.id] === 'pending'"
                  :title="$t('subscriptionRefresh')"
                  @click="refreshOne(item.id)"
                >
                  <ArrowPathIcon class="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  class="btn btn-ghost btn-xs"
                  @click="toggleSubscription(item.id)"
                >
                  {{ item.enabled ? $t('offline') : $t('online') }}
                </button>
                <button
                  type="button"
                  class="btn btn-ghost btn-xs h-6 min-h-6 w-6 p-0"
                  :title="$t('edit')"
                  @click="openEditDialog(item)"
                >
                  <PencilIcon class="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  class="btn btn-ghost btn-xs text-error h-6 min-h-6 w-6 p-0"
                  :title="$t('delete')"
                  @click="removeSubscriptionById(item.id)"
                >
                  <TrashIcon class="h-3.5 w-3.5" />
                </button>
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
          <div class="setting-item-label shrink-0!">{{ $t('subscriptionName') }}</div>
          <input
            v-model="form.name"
            type="text"
            class="input input-sm node-long-input"
            :placeholder="$t('subscriptionNamePlaceholder')"
          />
        </div>
        <div class="setting-item node-span-2">
          <div class="setting-item-label shrink-0!">{{ $t('subscriptionUrl') }}</div>
          <!-- 连接地址框：尾部 X 一键清空 -->
          <TextInput
            v-model="form.url"
            clearable
            placeholder="https://example.com/sub.yaml"
            class="node-long-input"
          />
        </div>
        <div class="setting-item">
          <div class="setting-item-label shrink-0!">{{ $t('subscriptionEnabled') }}</div>
          <input
            v-model="form.enabled"
            type="checkbox"
            class="toggle"
          />
        </div>
        <div class="setting-item">
          <div class="setting-item-label shrink-0!">{{ $t('subscriptionAutoUpdate') }}</div>
          <input
            v-model="form.autoUpdate"
            type="checkbox"
            class="toggle"
          />
        </div>
        <div
          v-if="form.autoUpdate"
          class="setting-item"
        >
          <div class="setting-item-label shrink-0!">
            {{ $t('subscriptionUpdateInterval') }} (min)
          </div>
          <!-- 留空 = 默认 1440 分钟，灰字占位，保存时回落 -->
          <input
            v-model.number="form.updateInterval"
            type="number"
            min="1"
            step="1"
            class="input input-sm w-24"
            :placeholder="String(SUB_DEFAULTS.updateInterval)"
          />
        </div>
      </div>
      <!-- 操作行 -->
      <div class="border-base-300/60 flex items-center justify-end gap-2 border-t p-4 pt-3">
        <button
          type="button"
          class="btn btn-sm btn-ghost"
          @click="dialogOpen = false"
        >
          {{ $t('cancel') }}
        </button>
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
// 表单留空的默认值：灰字占位展示，保存时回落
const SUB_DEFAULTS = { updateInterval: 1440 }

const form = ref<{
  name: string
  url: string
  enabled: boolean
  autoUpdate: boolean
  updateInterval?: number
}>({ name: '', url: '', enabled: true, autoUpdate: false, updateInterval: undefined })

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
  form.value = {
    name: '',
    url: '',
    enabled: true,
    autoUpdate: false,
    updateInterval: undefined,
  }
  dialogOpen.value = true
}

const openEditDialog = (item: SubscriptionItem) => {
  editingId.value = item.id
  form.value = {
    name: item.name,
    url: item.url,
    enabled: item.enabled,
    autoUpdate: item.autoUpdate,
    // 与默认值相同则留空，由灰字占位代替
    updateInterval:
      item.updateInterval && item.updateInterval !== SUB_DEFAULTS.updateInterval
        ? item.updateInterval
        : undefined,
  }
  dialogOpen.value = true
}

const formatDate = (value?: string) => {
  if (!value) return ''
  return new Date(value).toLocaleString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
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
      ? Math.max(1, Math.floor(Number(form.value.updateInterval) || SUB_DEFAULTS.updateInterval))
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
      content: 'subscriptionRefreshSuccessWithCount',
      params: { count: String(result.imported) },
      type: 'alert-success',
    })
  }
}

const refreshAll = async () => {
  await refreshAllSubscriptions()
}
</script>
