<template>
  <div class="relative flex h-full w-full items-center justify-center overflow-hidden bg-base-200/60 px-4">
    <div class="pointer-events-none absolute -top-32 -left-24 h-80 w-80 rounded-full bg-primary/15 blur-3xl"></div>
    <div class="pointer-events-none absolute -right-24 -bottom-32 h-96 w-96 rounded-full bg-secondary/15 blur-3xl"></div>
    <div
      class="border-base-border bg-base-100/95 relative flex w-[26rem] max-w-full flex-col gap-6 rounded-2xl border px-7 py-8 shadow-xl shadow-base-content/5 backdrop-blur"
    >
      <div class="flex flex-col items-center gap-3 text-center">
        <div class="bg-primary/10 text-primary flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-bold">
          Q
        </div>
        <div>
          <h1 class="text-xl font-semibold">{{ $t(isFirstRun ? 'panelWelcome' : 'panelLoginTitle') }}</h1>
          <p class="text-base-content/60 mt-1 text-sm">
            {{ $t(isFirstRun ? 'panelSetupDescription' : 'panelLoginDescription') }}
          </p>
        </div>
      </div>
      <div class="flex flex-col gap-3">
        <label class="form-control gap-1.5">
          <span class="label-text text-sm font-medium">{{ $t('panelPassword') }}</span>
          <input
            v-model="panelPasswordInput"
            type="password"
            class="input input-bordered w-full"
            :placeholder="$t(isFirstRun ? 'panelPasswordPlaceholder' : 'panelPasswordLoginPlaceholder')"
            :autocomplete="isFirstRun ? 'new-password' : 'current-password'"
            @keydown.enter="isFirstRun ? confirmInputRef?.focus() : submit()"
          />
        </label>
        <label v-if="isFirstRun" class="form-control gap-1.5">
          <span class="label-text text-sm font-medium">{{ $t('panelPasswordConfirm') }}</span>
          <input
            ref="confirmInputRef"
            v-model="confirmPasswordInput"
            type="password"
            class="input input-bordered w-full"
            :placeholder="$t('panelPasswordConfirmPlaceholder')"
            autocomplete="new-password"
            @keydown.enter="submit"
          />
        </label>
        <p v-if="isFirstRun && confirmPasswordInput && !passwordsMatch" class="text-error text-xs">
          {{ $t('panelPasswordMismatch') }}
        </p>
      </div>
      <button
        class="btn btn-primary w-full"
        :disabled="!canSubmit || submitting"
        @click="submit"
      >
        <span v-if="submitting" class="loading loading-spinner loading-sm"></span>
        {{ $t(isFirstRun ? 'panelPasswordCreate' : 'panelPasswordLogin') }}
      </button>
      <div class="flex items-center justify-center border-t border-base-content/10 pt-4">
        <LanguageSelect />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LanguageSelect from '@/components/settings/general/LanguageSelect.vue'
import { ROUTE_NAME } from '@/constant'
import { showNotification } from '@/helper/notification'
import {
  isPanelAuthenticated,
  loginToPanel,
  logoutPanel,
  panelPassword,
  setPanelPassword,
} from '@/helper/panelAuth'
import router from '@/router'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const panelPasswordInput = ref(panelPassword.value)
const confirmPasswordInput = ref('')
const confirmInputRef = ref<HTMLInputElement>()
const submitting = ref(false)
const isFirstRun = computed(() => !panelPassword.value)
const passwordsMatch = computed(
  () => panelPasswordInput.value.trim() === confirmPasswordInput.value.trim(),
)
const canSubmit = computed(() => {
  const password = panelPasswordInput.value.trim()
  return Boolean(password) && (!isFirstRun.value ? true : passwordsMatch.value)
})

const submit = async () => {
  const password = panelPasswordInput.value.trim()
  if (!canSubmit.value || submitting.value) return
  submitting.value = true
  try {
    if (isFirstRun.value) setPanelPassword(password)
    if (!loginToPanel(password)) {
      logoutPanel()
      showNotification({ content: t('panelAuthMismatch'), type: 'alert-error' })
      return
    }
    await router.push({ name: ROUTE_NAME.overview })
  } finally {
    submitting.value = false
  }
}

if (isPanelAuthenticated()) {
  void router.replace({ name: ROUTE_NAME.overview })
}
</script>
