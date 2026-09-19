<template>
  <DialogWrapper
    :model-value="modelValue"
    :title="$t('mainEntryEditTitle')"
    box-class="max-w-xl"
    :show-close-button="false"
    @update:model-value="handleModelValueUpdate"
  >
    <template #title-right>
      <SegmentedControl
        :model-value="inputMode"
        :options="inputModeOptions"
        @update:model-value="switchInputMode($event as 'form' | 'yaml')"
      />
    </template>

    <div
      v-if="inputMode === 'yaml'"
      class="flex min-h-[360px] flex-col"
    >
      <textarea
        v-model="entryYaml"
        class="textarea textarea-bordered border-base-300 bg-base-100 h-[360px] w-full resize-none font-mono text-xs"
        spellcheck="false"
      ></textarea>
    </div>
    <div
      v-else
      class="flex flex-col gap-3"
    >
      <div class="settings-grid node-form-grid">
        <div class="setting-item">
          <div class="setting-item-label shrink-0!">{{ $t('portHttp') }}</div>
          <input
            v-model.number="form.port"
            type="number"
            min="1"
            max="65535"
            class="input input-sm w-24"
            placeholder="—"
          />
        </div>
        <div class="setting-item">
          <div class="setting-item-label shrink-0!">{{ $t('portSocks') }}</div>
          <input
            v-model.number="form.socksPort"
            type="number"
            min="1"
            max="65535"
            class="input input-sm w-24"
            placeholder="—"
          />
        </div>
        <div class="setting-item">
          <div class="setting-item-label shrink-0!">{{ $t('portMixed') }}</div>
          <input
            v-model.number="form.mixedPort"
            type="number"
            min="1"
            max="65535"
            class="input input-sm w-24"
            placeholder="—"
          />
        </div>
        <div class="setting-item">
          <div class="setting-item-label shrink-0!">{{ $t('portRedir') }}</div>
          <input
            v-model.number="form.redirPort"
            type="number"
            min="1"
            max="65535"
            class="input input-sm w-24"
            placeholder="—"
          />
        </div>
        <div class="setting-item">
          <div class="setting-item-label shrink-0!">{{ $t('portTproxy') }}</div>
          <input
            v-model.number="form.tproxyPort"
            type="number"
            min="1"
            max="65535"
            class="input input-sm w-24"
            placeholder="—"
          />
        </div>
        <div class="setting-item">
          <div class="setting-item-label shrink-0!">{{ $t('allowLan') }}</div>
          <input
            v-model="form.allowLan"
            type="checkbox"
            class="toggle toggle-sm"
          />
        </div>
      </div>

      <div class="border-base-300/60 bg-base-200/40 rounded-md border p-3">
        <div class="mb-2 flex items-center justify-between">
          <div class="text-sm font-medium">{{ $t('tunSettings') }}</div>
          <input
            v-model="form.tunEnable"
            type="checkbox"
            class="toggle toggle-sm"
            :title="$t('tunMode')"
          />
        </div>
        <div
          v-show="form.tunEnable"
          class="settings-grid node-form-grid"
        >
          <div class="setting-item">
            <div class="setting-item-label shrink-0!">{{ $t('tunStack') }}</div>
            <SelectInput
              v-model="form.tunStack"
              class="select select-sm min-w-24"
              :options="TUN_STACKS.map((s) => ({ value: s, label: s }))"
            />
          </div>
          <div class="setting-item">
            <div class="setting-item-label shrink-0!">{{ $t('tunDevice') }}</div>
            <input
              v-model="form.tunDevice"
              type="text"
              class="input input-sm w-28"
              placeholder="Mihomo"
            />
          </div>
          <div class="setting-item">
            <div class="setting-item-label shrink-0!">{{ $t('tunMtu') }}</div>
            <input
              v-model.number="form.tunMtu"
              type="number"
              min="576"
              class="input input-sm w-24"
            />
          </div>
          <div class="setting-item">
            <div class="setting-item-label shrink-0!">{{ $t('tunAutoRoute') }}</div>
            <input
              v-model="form.tunAutoRoute"
              type="checkbox"
              class="toggle toggle-sm"
            />
          </div>
          <div class="setting-item">
            <div class="setting-item-label shrink-0!">{{ $t('tunAutoDetectInterface') }}</div>
            <input
              v-model="form.tunAutoDetectInterface"
              type="checkbox"
              class="toggle toggle-sm"
            />
          </div>
          <div class="setting-item">
            <div class="setting-item-label shrink-0!">{{ $t('tunStrictRoute') }}</div>
            <input
              v-model="form.tunStrictRoute"
              type="checkbox"
              class="toggle toggle-sm"
            />
          </div>
          <div class="setting-item node-span-2">
            <div class="setting-item-label shrink-0!">{{ $t('tunDnsHijack') }}</div>
            <input
              v-model="form.tunDnsHijackStr"
              type="text"
              class="input input-sm w-full max-w-64"
              placeholder="any:53,tcp://any:53"
            />
          </div>
        </div>
        <div class="text-base-content/60 mt-1 text-xs">{{ $t('mainEntryLocked') }}</div>
      </div>
    </div>

    <div class="border-base-300/60 flex items-center justify-end gap-2 border-t p-4 pt-3">
      <button
        type="button"
        class="btn btn-sm btn-ghost"
        @click="$emit('update:modelValue', false)"
      >
        {{ $t('cancel') }}
      </button>
      <button
        type="button"
        class="btn btn-sm btn-primary"
        :disabled="inputMode === 'yaml' ? !entryYaml.trim() : !hasAnyPort"
        @click="saveEntry"
      >
        {{ $t('save') }}
      </button>
    </div>
  </DialogWrapper>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import DialogWrapper from '@/components/common/DialogWrapper.vue'
import SegmentedControl, { type SegmentOption } from '@/components/common/SegmentedControl.vue'
import SelectInput from '@/components/common/SelectInput.vue'
import { showNotification } from '@/helper/notification'
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml'
import { TUN_STACKS } from '@/store/routing'
import type { MainEntryDraft } from '@/store/routing'

const props = defineProps<{
  modelValue: boolean
  initial: MainEntryDraft
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', payload: MainEntryDraft): void
}>()

const { t } = useI18n()

const createForm = (initial: MainEntryDraft) => ({
  port: initial.port,
  socksPort: initial['socks-port'],
  mixedPort: initial['mixed-port'],
  redirPort: initial['redir-port'],
  tproxyPort: initial['tproxy-port'],
  allowLan: initial['allow-lan'] ?? false,
  tunEnable: initial.tun?.enable ?? false,
  tunStack: initial.tun?.stack ?? 'gvisor',
  tunDevice: initial.tun?.device ?? '',
  tunMtu: initial.tun?.mtu ?? 9000,
  tunAutoRoute: initial.tun?.['auto-route'] ?? true,
  tunAutoDetectInterface: initial.tun?.['auto-detect-interface'] ?? true,
  tunStrictRoute: initial.tun?.['strict-route'] ?? false,
  tunDnsHijackStr: (initial.tun?.['dns-hijack'] ?? ['any:53']).join(','),
})

const form = ref(createForm(props.initial))
const inputMode = ref<'form' | 'yaml'>('form')
const entryYaml = ref('')
const inputModeOptions = computed<SegmentOption[]>(() => [
  { value: 'form', label: t('formMode') },
  { value: 'yaml', label: t('dualModeYaml') },
])

const hasAnyPort = computed(() =>
  [
    form.value.port,
    form.value.socksPort,
    form.value.mixedPort,
    form.value.redirPort,
    form.value.tproxyPort,
  ].some((port) => typeof port === 'number' && port > 0),
)

const resetForm = () => {
  form.value = createForm(props.initial)
  inputMode.value = 'form'
  entryYaml.value = ''
}

watch(
  () => props.modelValue,
  (value) => {
    if (value) resetForm()
  },
)

const toPort = (value: unknown) => (typeof value === 'number' && value > 0 ? value : undefined)

const buildDraft = (): MainEntryDraft => {
  const f = form.value
  return {
    ...(f.port ? { port: f.port } : {}),
    ...(f.socksPort ? { 'socks-port': f.socksPort } : {}),
    ...(f.mixedPort ? { 'mixed-port': f.mixedPort } : {}),
    ...(f.redirPort ? { 'redir-port': f.redirPort } : {}),
    ...(f.tproxyPort ? { 'tproxy-port': f.tproxyPort } : {}),
    'allow-lan': f.allowLan,
    tun: {
      enable: f.tunEnable,
      stack: f.tunStack,
      ...(f.tunDevice.trim() ? { device: f.tunDevice.trim() } : {}),
      ...(f.tunMtu ? { mtu: f.tunMtu } : {}),
      'auto-route': f.tunAutoRoute,
      'auto-detect-interface': f.tunAutoDetectInterface,
      'strict-route': f.tunStrictRoute,
      'dns-hijack': f.tunDnsHijackStr
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    },
  }
}

const applyYaml = (yamlText: string): boolean => {
  try {
    const parsed = parseYaml(yamlText) as Record<string, unknown>
    if (!parsed || typeof parsed !== 'object') return false
    const tun = parsed.tun as Record<string, unknown> | undefined
    form.value = createForm({
      port: toPort(parsed.port),
      'socks-port': toPort(parsed['socks-port']),
      'mixed-port': toPort(parsed['mixed-port']),
      'redir-port': toPort(parsed['redir-port']),
      'tproxy-port': toPort(parsed['tproxy-port']),
      'allow-lan': parsed['allow-lan'] === true,
      tun: {
        enable: tun?.enable === true,
        stack: typeof tun?.stack === 'string' ? tun.stack : 'gvisor',
        device: typeof tun?.device === 'string' ? tun.device : undefined,
        mtu: typeof tun?.mtu === 'number' ? tun.mtu : undefined,
        'auto-route': tun?.['auto-route'] !== false,
        'auto-detect-interface': tun?.['auto-detect-interface'] !== false,
        'strict-route': tun?.['strict-route'] === true,
        'dns-hijack': Array.isArray(tun?.['dns-hijack'])
          ? tun['dns-hijack'].map(String)
          : undefined,
      },
    })
    return true
  } catch {
    return false
  }
}

const switchInputMode = (mode: 'form' | 'yaml') => {
  if (mode === 'yaml') {
    entryYaml.value = stringifyYaml(buildDraft(), { indent: 2 })
  } else if (!applyYaml(entryYaml.value)) {
    showNotification({ content: 'routingInvalidYaml', type: 'alert-error' })
    return
  }
  inputMode.value = mode
}

const handleModelValueUpdate = (value: boolean | undefined) => {
  if (value !== undefined) emits('update:modelValue', value)
}

const saveEntry = () => {
  if (inputMode.value === 'yaml') {
    if (!applyYaml(entryYaml.value)) {
      showNotification({ content: 'routingInvalidYaml', type: 'alert-error' })
      return
    }
  }
  if (!hasAnyPort.value) return
  emits('save', buildDraft())
  emits('update:modelValue', false)
}
</script>
