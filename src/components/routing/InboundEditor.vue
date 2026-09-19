<template>
  <DialogWrapper
    :model-value="modelValue"
    :title="isEditing ? $t('inboundEditTitle') : $t('inboundAdd')"
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
        v-model="inboundYaml"
        class="textarea textarea-bordered border-base-300 bg-base-100 h-[360px] w-full resize-none font-mono text-xs"
        spellcheck="false"
      ></textarea>
    </div>
    <div
      v-else
      class="flex flex-col gap-3"
    >
      <div class="settings-grid node-form-grid">
        <div class="setting-item node-span-2">
          <div class="setting-item-label shrink-0!">{{ $t('name') }}</div>
          <input
            v-model="form.name"
            type="text"
            class="input input-sm node-long-input"
            :placeholder="$t('inboundNamePlaceholder')"
          />
        </div>
        <div class="setting-item">
          <div class="setting-item-label shrink-0!">{{ $t('type') }}</div>
          <SelectInput
            v-model="form.type"
            class="select select-sm min-w-24"
            :options="typeOptions"
          />
        </div>
        <div class="setting-item">
          <div class="setting-item-label shrink-0!">{{ $t('port') }}</div>
          <!-- 留空 = 默认 7890，保存/生成 YAML 时回落 -->
          <input
            v-model.number="form.port"
            type="number"
            min="1"
            max="65535"
            class="input input-sm w-24"
            :placeholder="String(INBOUND_DEFAULTS.port)"
          />
        </div>
        <div class="setting-item">
          <div class="setting-item-label shrink-0!">{{ $t('inboundListen') }}</div>
          <!-- 留空 = 使用内核默认监听地址 -->
          <input
            v-model="form.listen"
            type="text"
            class="input input-sm w-32"
            :placeholder="INBOUND_DEFAULTS.listen"
          />
        </div>
        <div class="setting-item">
          <div class="setting-item-label shrink-0!">{{ $t('inboundUdp') }}</div>
          <input
            v-model="form.udp"
            type="checkbox"
            class="toggle"
          />
        </div>
        <div class="setting-item">
          <div class="setting-item-label shrink-0!">{{ $t('inboundSubRule') }}</div>
          <SelectInput
            v-model="form.rule"
            class="select select-sm w-36"
            :options="ruleOptions"
          />
        </div>
        <div class="setting-item">
          <div class="setting-item-label shrink-0!">{{ $t('inboundFixedProxy') }}</div>
          <SelectInput
            v-model="form.proxy"
            class="select select-sm w-36"
            :options="proxyOptions"
            searchable
            :search-placeholder="$t('searchProxyGroup')"
            :no-results-text="$t('proxyGroupEditorNoMatch')"
          />
        </div>
        <div class="setting-item">
          <div class="setting-item-label shrink-0!">{{ $t('inboundRoutingMark') }}</div>
          <input
            v-model.number="form.routingMark"
            type="number"
            min="0"
            class="input input-sm w-24"
            placeholder="0"
          />
        </div>
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
        :disabled="inputMode === 'yaml' ? !inboundYaml.trim() : !form.name.trim()"
        @click="saveInbound"
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
import { INBOUND_TYPES, RULE_TARGET_ACTIONS } from '@/store/routing'
import type { InboundDraft } from '@/store/routing'

const props = defineProps<{
  modelValue: boolean
  initial?: InboundDraft
  subRuleNames: string[]
  groupOptions: string[]
  nodeOptions: string[]
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', payload: InboundDraft): void
}>()

const { t } = useI18n()

const isEditing = computed(() => !!props.initial)

// 留空即使用默认值：表单以灰字占位展示，保存/生成 YAML 时回落
const INBOUND_DEFAULTS = { port: 7890, listen: '0.0.0.0' }

const createForm = (initial?: InboundDraft) => ({
  name: initial?.name ?? '',
  type: initial?.type ?? 'mixed',
  port: initial?.port === INBOUND_DEFAULTS.port ? undefined : initial?.port,
  listen: initial?.listen === INBOUND_DEFAULTS.listen ? '' : (initial?.listen ?? ''),
  udp: initial?.udp ?? true,
  rule: initial?.rule ?? '',
  proxy: initial?.proxy ?? '',
  routingMark: initial?.['routing-mark'] ?? (undefined as unknown as number),
})

const form = ref(createForm(props.initial))
const inputMode = ref<'form' | 'yaml'>('form')
const inboundYaml = ref('')
const inputModeOptions = computed<SegmentOption[]>(() => [
  { value: 'form', label: t('formMode') },
  { value: 'yaml', label: t('dualModeYaml') },
])

const typeOptions = INBOUND_TYPES.map((type) => ({ value: type, label: type }))
const ruleOptions = computed(() => [
  { value: '', label: t('inboundDefaultSubRule') },
  { value: 'rules', label: t('inboundMainRuleOption') },
  ...props.subRuleNames.map((name) => ({ value: name, label: name })),
])
const proxyOptions = computed(() => [
  { value: '', label: t('inboundDefaultProxy') },
  ...props.nodeOptions.map((name) => ({ value: name, label: name, group: t('memberKindNode') })),
  ...props.groupOptions.map((name) => ({
    value: name,
    label: name,
    group: t('routingTargetGroup'),
  })),
  ...RULE_TARGET_ACTIONS.map((action) => ({
    value: action,
    label: action,
    group: t('routingTargetAction'),
  })),
])

const resetForm = () => {
  form.value = createForm(props.initial)
  inputMode.value = 'form'
  inboundYaml.value = ''
}

watch(
  () => props.modelValue,
  (value) => {
    if (value) resetForm()
  },
)

const buildDraft = (): InboundDraft => {
  const f = form.value
  return {
    id: props.initial?.id ?? '',
    name: f.name.trim(),
    type: f.type,
    port: f.port || INBOUND_DEFAULTS.port,
    listen: f.listen.trim() || INBOUND_DEFAULTS.listen,
    ...(f.udp ? { udp: true } : {}),
    ...(f.rule ? { rule: f.rule } : {}),
    ...(f.proxy ? { proxy: f.proxy } : {}),
    ...(f.routingMark ? { 'routing-mark': f.routingMark } : {}),
  } as InboundDraft
}

const buildYamlObject = () => {
  const draft = buildDraft() as unknown as Record<string, unknown>
  delete draft.id
  return draft
}

const applyYaml = (yamlText: string): boolean => {
  try {
    const parsed = parseYaml(yamlText) as Record<string, unknown>
    if (!parsed || typeof parsed !== 'object' || typeof parsed.name !== 'string') return false
    form.value = createForm({
      ...props.initial,
      id: props.initial?.id ?? '',
      name: parsed.name,
      type: typeof parsed.type === 'string' ? parsed.type : (props.initial?.type ?? 'mixed'),
      port: typeof parsed.port === 'number' ? parsed.port : props.initial?.port,
      listen: typeof parsed.listen === 'string' ? parsed.listen : undefined,
      udp: parsed.udp === true,
      rule: typeof parsed.rule === 'string' ? parsed.rule : undefined,
      proxy: typeof parsed.proxy === 'string' ? parsed.proxy : undefined,
      'routing-mark':
        typeof parsed['routing-mark'] === 'number' ? parsed['routing-mark'] : undefined,
    })
    return true
  } catch {
    return false
  }
}

const switchInputMode = (mode: 'form' | 'yaml') => {
  if (mode === 'yaml') {
    inboundYaml.value = stringifyYaml(buildYamlObject(), { indent: 2 })
  } else if (!applyYaml(inboundYaml.value)) {
    showNotification({ content: 'routingInvalidYaml', type: 'alert-error' })
    return
  }
  inputMode.value = mode
}

const handleModelValueUpdate = (value: boolean | undefined) => {
  if (value !== undefined) emits('update:modelValue', value)
}

const saveInbound = () => {
  if (inputMode.value === 'yaml') {
    if (!applyYaml(inboundYaml.value)) {
      showNotification({ content: 'routingInvalidYaml', type: 'alert-error' })
      return
    }
  }
  const draft = buildDraft()
  if (!draft.name || !draft.port) return
  emits('save', draft)
  emits('update:modelValue', false)
}
</script>
