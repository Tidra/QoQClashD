<template>
  <div
    class="bg-base-200/60 relative flex h-full w-full items-center justify-center overflow-hidden px-4"
  >
    <div
      class="bg-primary/15 pointer-events-none absolute -top-32 -left-24 h-80 w-80 rounded-full blur-3xl"
    ></div>
    <div
      class="bg-secondary/15 pointer-events-none absolute -right-24 -bottom-32 h-96 w-96 rounded-full blur-3xl"
    ></div>
    <div
      class="border-base-border bg-base-100/95 shadow-base-content/5 relative flex w-[26rem] max-w-full flex-col gap-6 rounded-2xl border px-7 py-8 shadow-xl backdrop-blur"
    >
      <div class="flex flex-col items-center gap-3 text-center">
        <div
          class="bg-primary/10 text-primary flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-bold"
        >
          Q
        </div>
        <div>
          <h1 class="text-xl font-semibold">
            {{ $t(isFirstRun ? 'panelWelcome' : 'panelLoginTitle') }}
          </h1>
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
            :placeholder="
              $t(isFirstRun ? 'panelPasswordPlaceholder' : 'panelPasswordLoginPlaceholder')
            "
            :autocomplete="isFirstRun ? 'new-password' : 'current-password'"
            @keydown.enter="isFirstRun ? confirmInputRef?.focus() : submit()"
          />
        </label>
        <label
          v-if="isFirstRun"
          class="form-control gap-1.5"
        >
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
        <p
          v-if="isFirstRun && confirmPasswordInput && !passwordsMatch"
          class="text-error text-xs"
        >
          {{ $t('panelPasswordMismatch') }}
        </p>
      </div>
      <button
        class="btn btn-primary w-full"
        :disabled="!canSubmit || submitting"
        @click="submit"
      >
        <span
          v-if="submitting"
          class="loading loading-spinner loading-sm"
        ></span>
        {{ $t(isFirstRun ? 'panelPasswordCreate' : 'panelPasswordLogin') }}
      </button>
      <div class="border-base-content/10 flex items-center justify-center border-t pt-4">
        <LanguageSelect />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LanguageSelect from '@/components/settings/general/LanguageSelect.vue'
import { restartKernelForSecret } from '@/composables/useKernelBackend'
import { authStatus, getAuthStatus, loginToPanel } from '@/helper/panelSession'
import { showNotification } from '@/helper/notification'
import { computed, onMounted, ref } from 'vue'

// 密码不预填也不本地保存：校验和会话签发全在服务端做。needsSetup 来自 /auth/status，
// 路由守卫进登录页前已经取过一次，这里只在缺省时补取。
const isFirstRun = computed(() => authStatus.value?.needsSetup ?? false)
const panelPasswordInput = ref('')
const confirmPasswordInput = ref('')
const confirmInputRef = ref<HTMLInputElement>()
const submitting = ref(false)
const passwordsMatch = computed(
  () => panelPasswordInput.value.trim() === confirmPasswordInput.value.trim(),
)
const canSubmit = computed(() => {
  const password = panelPasswordInput.value.trim()
  return Boolean(password) && (isFirstRun.value ? passwordsMatch.value : true)
})

const submit = async () => {
  const password = panelPasswordInput.value.trim()
  if (!canSubmit.value || submitting.value) return
  submitting.value = true
  try {
    const result = await loginToPanel(password)
    if (!result.ok) {
      showNotification({ content: 'panelAuthMismatch', type: 'alert-error' })
      // needsSetup 可能被别人抢先建好了，重新问一次。
      await getAuthStatus(true).catch(() => undefined)
      return
    }
    // 首次建密码时内核可能已经在跑，它认的还是启动时那份随机 secret；
    // 同源代理注入的已经是新值，不重启就是拿新密码敲旧锁。
    if (result.requiresRestart) await restartKernelForSecret()
    // 登录前所有 KV 读都吃 401，各个 store 还是空默认值。整页重载一次，
    // 让它们带着会话 cookie 重新水合，比在面板里手写一遍启动顺序可靠。
    location.reload()
  } catch {
    showNotification({ content: 'panelLoginFailed', type: 'alert-error' })
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  if (authStatus.value) return
  void getAuthStatus(true).catch(() => undefined)
})
</script>
