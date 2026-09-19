<template>
  <DialogWrapper
    :model-value="modelValue"
    :title="isEditing ? $t('ruleProviderEditTitle') : $t('ruleProviderAdd')"
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
        v-model="providerYaml"
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
          <div class="setting-item-label shrink-0!">{{ $t('ruleProviderName') }}</div>
          <input
            v-model="form.name"
            type="text"
            class="input input-sm w-full max-w-56"
            placeholder="google"
          />
        </div>
        <div class="setting-item">
          <div class="setting-item-label shrink-0!">{{ $t('ruleProviderType') }}</div>
          <SelectInput
            v-model="form.type"
            class="select select-sm min-w-24"
            :options="RULE_PROVIDER_TYPES.map((value) => ({ value, label: value }))"
          />
        </div>
        <div class="setting-item">
          <div class="setting-item-label shrink-0!">{{ $t('ruleProviderFormat') }}</div>
          <SelectInput
            v-model="form.format"
            class="select select-sm min-w-24"
            :options="RULE_PROVIDER_FORMATS.map((value) => ({ value, label: value }))"
          />
        </div>
        <div
          v-if="form.type !== 'inline'"
          class="setting-item"
        >
          <div class="setting-item-label shrink-0!">{{ $t('ruleProviderBehavior') }}</div>
          <SelectInput
            v-model="form.behavior"
            class="select select-sm min-w-24"
            :options="RULE_PROVIDER_BEHAVIORS.map((value) => ({ value, label: value }))"
          />
        </div>
        <div
          v-if="form.type === 'http'"
          class="setting-item node-span-2"
        >
          <div class="setting-item-label shrink-0!">{{ $t('ruleProviderUrl') }}</div>
          <input
            v-model="form.url"
            type="text"
            class="input input-sm w-full"
            placeholder="https://.../rules.yaml"
          />
        </div>
        <div
          v-if="form.type !== 'inline'"
          class="setting-item"
        >
          <div class="setting-item-label shrink-0!">{{ $t('ruleProviderPath') }}</div>
          <input
            v-model="form.path"
            type="text"
            class="input input-sm w-full max-w-56"
            placeholder="./ruleset/xxx.yaml"
          />
        </div>
        <div
          v-if="form.type === 'http'"
          class="setting-item"
        >
          <div class="setting-item-label shrink-0!">{{ $t('ruleProviderInterval') }}</div>
          <input
            v-model.number="form.interval"
            type="number"
            min="0"
            class="input input-sm w-28"
            placeholder="86400"
          />
        </div>
        <div
          v-if="form.type === 'http'"
          class="setting-item"
        >
          <div class="setting-item-label shrink-0!">{{ $t('ruleProviderSizeLimit') }}</div>
          <input
            v-model.number="form.sizeLimit"
            type="number"
            min="0"
            class="input input-sm w-28"
            placeholder="0"
          />
        </div>
        <div
          v-if="form.type === 'http'"
          class="setting-item"
        >
          <div class="setting-item-label shrink-0!">{{ $t('ruleProviderProxy') }}</div>
          <SelectInput
            v-model="form.proxy"
            class="select select-sm max-w-56 min-w-0"
            :options="proxyOptions"
            searchable
            :search-placeholder="$t('search')"
            :no-results-text="$t('proxyGroupEditorNoMatch')"
          />
        </div>
      </div>

      <div
        v-if="form.type === 'inline'"
        class="flex flex-col gap-1"
      >
        <div class="text-sm font-medium">{{ $t('ruleProviderPayload') }}</div>
        <textarea
          v-model="form.payloadText"
          class="textarea textarea-bordered h-32 w-full resize-none font-mono text-xs"
          placeholder="DOMAIN-SUFFIX,google.com"
          spellcheck="false"
        ></textarea>
        <div class="text-base-content/60 text-xs">{{ $t('ruleProviderPayloadHint') }}</div>
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
        :disabled="inputMode === 'yaml' ? !providerYaml.trim() : !canSave"
        @click="saveProvider"
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
import {
  RULE_PROVIDER_BEHAVIORS,
  RULE_PROVIDER_FORMATS,
  RULE_PROVIDER_TYPES,
} from '@/store/routing'
import type { RuleProviderDraft } from '@/store/routing'

const props = defineProps<{
  modelValue: boolean
  /** 编辑已有集合时传入原始数据 */
  initial?: RuleProviderDraft
  existingNames: string[]
  proxyOptions: { value: string; label: string; group?: string }[]
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', payload: RuleProviderDraft, originalName?: string): void
}>()

const { t } = useI18n()

const isEditing = computed(() => !!props.initial?.name)

const createForm = (initial?: RuleProviderDraft) => ({
  name: initial?.name ?? '',
  type: initial?.type ?? 'http',
  format: initial?.format ?? 'yaml',
  behavior: initial?.behavior ?? 'classical',
  url: initial?.url ?? '',
  path: initial?.path ?? '',
  interval: initial?.interval as number | undefined,
  sizeLimit: initial?.['size-limit'] as number | undefined,
  proxy: initial?.proxy ?? '',
  payloadText: (initial?.payload ?? []).join('\n'),
})

const form = ref(createForm(props.initial))
const inputMode = ref<'form' | 'yaml'>('form')
const providerYaml = ref('')
const inputModeOptions = computed<SegmentOption[]>(() => [
  { value: 'form', label: t('formMode') },
  { value: 'yaml', label: t('dualModeYaml') },
])

watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      form.value = createForm(props.initial)
      inputMode.value = 'form'
      providerYaml.value = ''
    }
  },
)

const canSave = computed(() => {
  const f = form.value
  if (!f.name.trim()) return false
  if (f.type === 'http' && !f.url.trim()) return false
  return true
})

const buildDraft = (): RuleProviderDraft => {
  const f = form.value
  return {
    name: f.name.trim(),
    type: f.type,
    format: f.format,
    ...(f.type !== 'inline' && f.behavior ? { behavior: f.behavior } : {}),
    ...(f.type === 'http' && f.url.trim() ? { url: f.url.trim() } : {}),
    ...(f.type !== 'inline' && f.path.trim() ? { path: f.path.trim() } : {}),
    ...(f.type === 'http' && f.interval ? { interval: f.interval } : {}),
    ...(f.type === 'http' && f.sizeLimit ? { 'size-limit': f.sizeLimit } : {}),
    ...(f.type === 'http' && f.proxy ? { proxy: f.proxy } : {}),
    ...(f.type === 'inline'
      ? {
          payload: f.payloadText
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean),
        }
      : {}),
  }
}

const applyYaml = (yamlText: string): boolean => {
  try {
    const parsed = parseYaml(yamlText) as Record<string, unknown>
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      typeof parsed.name !== 'string' ||
      typeof parsed.type !== 'string'
    )
      return false
    if (!RULE_PROVIDER_TYPES.includes(parsed.type as (typeof RULE_PROVIDER_TYPES)[number]))
      return false
    form.value = createForm({
      ...(props.initial ?? ({} as RuleProviderDraft)),
      name: parsed.name,
      type: parsed.type,
      format: typeof parsed.format === 'string' ? parsed.format : (props.initial?.format ?? 'yaml'),
      behavior: typeof parsed.behavior === 'string' ? parsed.behavior : undefined,
      url: typeof parsed.url === 'string' ? parsed.url : undefined,
      path: typeof parsed.path === 'string' ? parsed.path : undefined,
      interval: typeof parsed.interval === 'number' ? parsed.interval : undefined,
      'size-limit': typeof parsed['size-limit'] === 'number' ? parsed['size-limit'] : undefined,
      proxy: typeof parsed.proxy === 'string' ? parsed.proxy : undefined,
      payload: Array.isArray(parsed.payload) ? parsed.payload.map(String) : undefined,
    })
    return true
  } catch {
    return false
  }
}

const switchInputMode = (mode: 'form' | 'yaml') => {
  if (mode === 'yaml') {
    providerYaml.value = stringifyYaml(buildDraft(), { indent: 2 })
  } else if (!applyYaml(providerYaml.value)) {
    showNotification({ content: 'routingInvalidYaml', type: 'alert-error' })
    return
  }
  inputMode.value = mode
}

const handleModelValueUpdate = (value: boolean | undefined) => {
  if (value !== undefined) emits('update:modelValue', value)
}

const saveProvider = () => {
  if (inputMode.value === 'yaml') {
    if (!applyYaml(providerYaml.value)) {
      showNotification({ content: 'routingInvalidYaml', type: 'alert-error' })
      return
    }
  }
  if (!canSave.value) return
  const draft = buildDraft()
  if (draft.name !== props.initial?.name && props.existingNames.includes(draft.name)) {
    showNotification({ content: 'routingNameExists', type: 'alert-error' })
    return
  }
  emits('save', draft, props.initial?.name)
  emits('update:modelValue', false)
}
</script>
