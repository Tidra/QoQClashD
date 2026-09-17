<template>
  <div class="flex h-full flex-col overflow-auto" :style="padding">
    <NodePageHeader>
      <template #search>
        <input v-model="subscriptionSearch" type="search" class="input input-sm input-bordered w-full max-w-md" :placeholder="`${$t('search')} | Regex`" />
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
              <th>{{ $t('subscriptionName') }}</th>
              <th>{{ $t('subscriptionUrl') }}</th>
              <th>{{ $t('subscriptionStatus') }}</th>
              <th>{{ $t('subscriptionUpdatedAt') }}</th>
              <th class="text-right">{{ $t('actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!filteredSubscriptions.length">
              <td colspan="5" class="text-base-content/50 h-90">
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
            <tr v-for="item in filteredSubscriptions" :key="item.id" class="hover">
              <td class="max-w-48 truncate">{{ item.name || 'Untitled subscription' }}</td>
              <td class="max-w-80 truncate">{{ item.url }}</td>
              <td><span class="badge" :class="item.enabled ? 'badge-success' : 'badge-ghost'">{{ item.enabled ? $t('online') : $t('offline') }}</span></td>
              <td>{{ item.updatedAt ? formatDate(item.updatedAt) : $t('subscriptionNeverUpdated') }}</td>
              <td class="text-right">
                <button v-if="subscriptionStatus[item.id] === 'pending'" type="button" class="btn btn-ghost btn-xs" disabled>
                  <span class="loading loading-spinner loading-xs"></span>
                </button>
                <button v-else type="button" class="btn btn-ghost btn-xs" :disabled="!item.enabled" @click="refreshOne(item.id)">
                  {{ $t('subscriptionRefresh') }}
                </button>
                <button type="button" class="btn btn-ghost btn-xs" @click="toggleSubscription(item.id)">{{ item.enabled ? $t('offline') : $t('online') }}</button>
                <button type="button" class="btn btn-ghost btn-xs" @click="openEditDialog(item)"><PencilIcon class="h-3.5 w-3.5" /></button>
                <button type="button" class="btn btn-ghost btn-xs text-error" @click="removeSubscriptionById(item.id)"><TrashIcon class="h-3.5 w-3.5" /></button>
              </td>
            </tr>
          </tbody>
        </table>
              </div>
            </div>

            <dialog ref="dialogRef" class="modal">
      <div class="modal-box max-w-xl">
        <h3 class="text-lg font-semibold">
          {{ editingId ? $t('subscriptionEditTitle') : $t('subscriptionAddTitle') }}
        </h3>

        <div class="mt-4 space-y-4">
          <label class="form-control w-full">
            <span class="label-text mb-1">{{ $t('subscriptionName') }}</span>
            <input
              v-model="form.name"
              type="text"
              class="input input-bordered w-full"
              placeholder="My subscription"
            />
          </label>

          <label class="form-control w-full">
            <span class="label-text mb-1">{{ $t('subscriptionUrl') }}</span>
            <input
              v-model="form.url"
              type="url"
              class="input input-bordered w-full"
              placeholder="https://example.com/sub.yaml"
            />
          </label>

          <label class="label cursor-pointer justify-start gap-3">
            <input
              v-model="form.enabled"
              type="checkbox"
              class="checkbox"
            />
            <span class="label-text">{{ $t('subscriptionEnabled') }}</span>
          </label>

          <label class="label cursor-pointer justify-start gap-3">
            <input
              v-model="form.autoUpdate"
              type="checkbox"
              class="checkbox"
            />
            <span class="label-text">{{ $t('subscriptionAutoUpdate') }}</span>
          </label>
        </div>

        <div class="modal-action">
          <button type="button" class="btn btn-ghost" @click="closeDialog">{{ $t('cancel') }}</button>
          <button type="button" class="btn btn-primary" @click="saveSubscription">
            {{ $t('save') }}
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="closeDialog">close</button>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { usePaddingForViews } from '@/composables/paddingViews'
import { showNotification } from '@/helper/notification'
import {
  addSubscription,
  refreshAllSubscriptions,
  refreshSubscription,
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
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { padding } = usePaddingForViews({ offsetTop: 0, offsetBottom: 0 })
const dialogRef = ref<HTMLDialogElement | null>(null)
const editingId = ref<string | null>(null)
const form = ref({ name: '', url: '', enabled: true, autoUpdate: false })

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
  form.value = { name: '', url: '', enabled: true, autoUpdate: false }
  dialogRef.value?.showModal()
}

const openEditDialog = (item: SubscriptionItem) => {
  editingId.value = item.id
  form.value = { name: item.name, url: item.url, enabled: item.enabled, autoUpdate: item.autoUpdate }
  dialogRef.value?.showModal()
}

const closeDialog = () => {
  dialogRef.value?.close()
}

const formatDate = (value?: string) => {
  if (!value) return ''
  return new Date(value).toLocaleString()
}

const saveSubscription = () => {
  const url = form.value.url.trim()
  if (!url || !hasValidUrl.value) {
    showNotification({ content: 'invalidURL', type: 'alert-error' })
    return
  }

  if (editingId.value) {
    updateSubscription(editingId.value, {
      name: form.value.name.trim() || 'Subscription',
      url,
      enabled: form.value.enabled,
      autoUpdate: form.value.autoUpdate,
    })
  } else {
    addSubscription({
      name: form.value.name.trim() || 'Subscription',
      url,
      enabled: form.value.enabled,
      autoUpdate: form.value.autoUpdate,
    })
  }

  showNotification({ content: 'subscriptionSaveSuccess', type: 'alert-success' })
  closeDialog()
}

const toggleEnabled = (id: string) => {
  toggleSubscription(id)
}

const removeSubscriptionById = (id: string) => {
  if (!window.confirm(t('subscriptionDeleteConfirm'))) return
  removeSubscription(id)
}

const refreshOne = async (id: string) => {
  const result = await refreshSubscription(id)
  if (result.ok) {
    showNotification({ content: 'subscriptionRefreshSuccess', type: 'alert-success' })
  }
}

const refreshAll = async () => {
  await refreshAllSubscriptions()
}
</script>
