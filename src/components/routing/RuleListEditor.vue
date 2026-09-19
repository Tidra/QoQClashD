<template>
  <DialogWrapper
    :model-value="modelValue"
    :title="dialogTitle"
    box-class="max-w-3xl"
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
        v-model="listYaml"
        class="textarea textarea-bordered border-base-300 bg-base-100 h-[360px] w-full resize-none font-mono text-xs"
        spellcheck="false"
      ></textarea>
    </div>
    <div
      v-else
      class="flex min-h-[200px] flex-col gap-3"
    >
      <div
        v-if="mode === 'sub'"
        class="settings-grid node-form-grid"
      >
        <div class="setting-item node-span-2">
          <div class="setting-item-label shrink-0!">{{ $t('subRuleNameLabel') }}</div>
          <input
            v-model="name"
            type="text"
            class="input input-sm w-full"
            :placeholder="$t('subRuleNamePlaceholder')"
          />
        </div>
      </div>

      <!-- px-4 对齐上方名称行（setting-item 自带同宽内边距），左右边缘一致 -->
      <div class="flex flex-col gap-2 px-4">
        <div class="flex items-center justify-between">
          <div class="text-sm font-medium">{{ $t('subRuleRulesLabel') }}</div>
          <button
            type="button"
            class="btn btn-ghost btn-xs"
            @click="addRow"
          >
            <PlusIcon class="h-3.5 w-3.5" />
            {{ $t('subRuleAddRow') }}
          </button>
        </div>
        <div
          v-for="(row, index) in rows"
          :key="row.id"
          class="bg-base-200/40 flex items-center gap-1.5 rounded-md p-1.5"
        >
          <span class="text-base-content/50 w-5 shrink-0 text-right text-xs">{{ index + 1 }}</span>
          <SelectInput
            v-if="!row.builtin"
            v-model="row.type"
            :options="typeOptions"
            searchable
            :search-placeholder="$t('search')"
            class="select select-sm w-36 min-w-0 shrink-0"
          />
          <span
            v-else
            class="badge badge-ghost shrink-0"
            >{{ row.type }}</span
          >
          <SelectInput
            v-if="row.type === 'SUB-RULE'"
            v-model="row.payload"
            :options="subRuleOptions"
            searchable
            :search-placeholder="$t('search')"
            :no-results-text="$t('proxyGroupEditorNoMatch')"
            class="select select-sm min-w-0 flex-1"
          />
          <SelectInput
            v-else-if="row.type === 'RULE-SET'"
            v-model="row.payload"
            :options="providerOptions"
            searchable
            :search-placeholder="$t('search')"
            :no-results-text="$t('proxyGroupEditorNoMatch')"
            class="select select-sm min-w-0 flex-1"
          />
          <input
            v-else-if="row.type !== 'MATCH'"
            v-model="row.payload"
            type="text"
            class="input input-sm min-w-0 flex-1 font-mono text-xs"
            :placeholder="$t('routingRulePayload')"
          />
          <div
            v-else
            class="min-w-0 flex-1"
          ></div>
          <SelectInput
            v-model="row.target"
            :options="targetOptions"
            searchable
            :search-placeholder="$t('searchProxyGroup')"
            :no-results-text="$t('proxyGroupEditorNoMatch')"
            class="select select-sm w-32 min-w-0 shrink-0"
          />
          <label
            v-if="supportsNoResolve(row.type)"
            class="text-base-content/70 flex w-24 shrink-0 cursor-pointer items-center gap-1.5 text-xs"
          >
            <input
              v-model="row.noResolve"
              type="checkbox"
              class="checkbox checkbox-xs shrink-0"
            />
            <span class="truncate">{{ $t('routingRuleNoResolve') }}</span>
          </label>
          <div
            v-else
            class="w-24 shrink-0"
          ></div>
          <div class="flex shrink-0 gap-0.5">
            <button
              type="button"
              class="btn btn-ghost btn-xs h-6 min-h-6 w-6 p-0"
              :disabled="index === 0"
              :title="$t('moveUp')"
              @click="moveRow(index, -1)"
            >
              <ArrowUpIcon class="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              class="btn btn-ghost btn-xs h-6 min-h-6 w-6 p-0"
              :disabled="index === rows.length - 1"
              :title="$t('moveDown')"
              @click="moveRow(index, 1)"
            >
              <ArrowDownIcon class="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              class="btn btn-ghost btn-xs text-error h-6 min-h-6 w-6 p-0"
              :disabled="!!row.builtin"
              :title="$t('delete')"
              @click="rows.splice(index, 1)"
            >
              <TrashIcon class="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <div
          v-if="!rows.length"
          class="text-base-content/60 py-2 text-center text-xs"
        >
          {{ $t('subRuleEmpty') }}
        </div>
        <div class="text-base-content/60 text-xs">
          {{ mode === 'main' ? $t('mainRuleOrderHint') : $t('subRuleTerminalHint') }}
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
        :disabled="!canSave"
        @click="saveList"
      >
        {{ $t('save') }}
      </button>
    </div>
  </DialogWrapper>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowDownIcon, ArrowUpIcon, PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'
import DialogWrapper from '@/components/common/DialogWrapper.vue'
import SegmentedControl, { type SegmentOption } from '@/components/common/SegmentedControl.vue'
import SelectInput from '@/components/common/SelectInput.vue'
import { showNotification } from '@/helper/notification'
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml'
import {
  ALL_RULE_TYPES,
  RULE_TARGET_ACTIONS,
  RULE_TYPE_GROUPS,
  SUB_RULE_TARGET_ACTIONS,
  supportsNoResolve,
} from '@/store/routing'

export type RuleListRow = {
  id: string
  type: string
  payload: string
  target: string
  noResolve: boolean
  builtin?: boolean
}

const props = defineProps<{
  modelValue: boolean
  /** main = YAML 顶层 rules 列表；sub = 单条子规则 */
  mode: 'main' | 'sub'
  initialRows: RuleListRow[]
  /** sub 模式：原始名称，存在即编辑态 */
  initialName?: string
  /** sub 模式：名称查重列表 */
  existingNames: string[]
  groupOptions: string[]
  ruleProviderNames: string[]
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save-main', rows: RuleListRow[]): void
  (e: 'save-sub', name: string, rows: RuleListRow[], originalName?: string): void
}>()

const { t } = useI18n()

const isEditing = computed(() => props.mode === 'sub' && !!props.initialName)
const dialogTitle = computed(() =>
  props.mode === 'main'
    ? t('mainRuleEditTitle')
    : isEditing.value
      ? t('subRuleEditTitle')
      : t('subRuleAdd'),
)

const generateId = () => `rule-row-${Math.random().toString(36).slice(2, 10)}`

const name = ref('')
const rows = ref<RuleListRow[]>([])
const inputMode = ref<'form' | 'yaml'>('form')
const listYaml = ref('')
const inputModeOptions = computed<SegmentOption[]>(() => [
  { value: 'form', label: t('formMode') },
  { value: 'yaml', label: t('dualModeYaml') },
])

const typeOptions = RULE_TYPE_GROUPS.flatMap((item) =>
  item.types.map((type) => ({ value: type, label: type, group: item.group })),
)

const targetActions = computed(() =>
  props.mode === 'main' ? RULE_TARGET_ACTIONS : SUB_RULE_TARGET_ACTIONS,
)
const targetOptions = computed(() => [
  ...props.groupOptions.map((groupName) => ({
    value: groupName,
    label: groupName,
    group: t('routingTargetGroup'),
  })),
  ...targetActions.value.map((action) => ({
    value: action,
    label: action,
    group: t('routingTargetAction'),
  })),
])

const subRuleOptions = computed(() =>
  props.existingNames
    .filter((subName) => subName !== props.initialName)
    .map((subName) => ({ value: subName, label: subName })),
)
const providerOptions = computed(() =>
  props.ruleProviderNames.map((providerName) => ({ value: providerName, label: providerName })),
)

const createRow = (): RuleListRow => ({
  id: generateId(),
  type: 'DOMAIN-SUFFIX',
  payload: '',
  target: props.mode === 'main' ? 'DIRECT' : 'PROXY',
  noResolve: false,
})

const addRow = () => rows.value.push(createRow())

const moveRow = (index: number, offset: -1 | 1) => {
  const target = index + offset
  if (target < 0 || target >= rows.value.length) return
  const list = [...rows.value]
  ;[list[index], list[target]] = [list[target], list[index]]
  rows.value = list
}

const resetForm = () => {
  name.value = props.initialName ?? ''
  rows.value = props.initialRows.map((row) => ({ ...row }))
  inputMode.value = 'form'
  listYaml.value = ''
}

watch(
  () => props.modelValue,
  (value) => {
    if (value) resetForm()
  },
)

const rowToLine = (row: RuleListRow) => {
  const base =
    row.type === 'MATCH' ? `MATCH,${row.target}` : [row.type, row.payload, row.target].join(',')
  return row.noResolve && supportsNoResolve(row.type) ? `${base},no-resolve` : base
}

const buildYamlObject = () => {
  const rules = rows.value.map(rowToLine)
  return props.mode === 'sub' ? { name: name.value.trim(), rules } : { rules }
}

const parseLine = (line: string, fallbackIndex: number): RuleListRow | null => {
  const parts = line
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part.length)
  if (!parts.length) return null
  const type = parts[0].toUpperCase()
  const prev = props.initialRows[fallbackIndex]
  if (type === 'MATCH' || type === 'FINAL') {
    return {
      id: prev?.id ?? generateId(),
      type: 'MATCH',
      payload: '',
      target: parts[1] ?? '',
      noResolve: false,
      ...(prev?.builtin ? { builtin: true } : {}),
    }
  }
  if (parts.length < 3 || !ALL_RULE_TYPES.includes(type)) return null
  return {
    id: prev?.id ?? generateId(),
    type,
    payload: parts[1],
    target: parts[2],
    noResolve: parts[parts.length - 1].toLowerCase() === 'no-resolve',
    ...(prev?.builtin ? { builtin: true } : {}),
  }
}

const applyYaml = (yamlText: string): boolean => {
  try {
    const parsed = parseYaml(yamlText) as Record<string, unknown>
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.rules)) return false
    if (props.mode === 'sub' && typeof parsed.name !== 'string') return false
    const next = parsed.rules.map((line, index) => parseLine(String(line), index))
    if (next.some((row) => !row)) return false
    rows.value = next as RuleListRow[]
    if (props.mode === 'sub') name.value = parsed.name as string
    return true
  } catch {
    return false
  }
}

const switchInputMode = (mode: 'form' | 'yaml') => {
  if (mode === 'yaml') {
    listYaml.value = stringifyYaml(buildYamlObject(), { indent: 2 })
  } else if (!applyYaml(listYaml.value)) {
    showNotification({ content: 'routingInvalidYaml', type: 'alert-error' })
    return
  }
  inputMode.value = mode
}

const isRowValid = (row: RuleListRow) =>
  !!row.type && !!row.target.trim() && (row.type === 'MATCH' || !!row.payload.trim())

const canSave = computed(() => {
  if (inputMode.value === 'yaml') return !!listYaml.value.trim()
  if (!rows.value.length || !rows.value.every(isRowValid)) return false
  if (props.mode === 'sub' && !name.value.trim()) return false
  return true
})

const handleModelValueUpdate = (value: boolean | undefined) => {
  if (value !== undefined) emits('update:modelValue', value)
}

const saveList = () => {
  let finalRows = rows.value
  if (inputMode.value === 'yaml') {
    if (!applyYaml(listYaml.value)) {
      showNotification({ content: 'routingInvalidYaml', type: 'alert-error' })
      return
    }
    finalRows = rows.value
  }
  if (!finalRows.length || !finalRows.every(isRowValid)) return
  if (props.mode === 'sub') {
    const trimmed = name.value.trim()
    if (!trimmed) return
    if (trimmed !== props.initialName && props.existingNames.includes(trimmed)) {
      showNotification({ content: 'routingNameExists', type: 'alert-error' })
      return
    }
    emits(
      'save-sub',
      trimmed,
      finalRows.map((row) => ({
        ...row,
        payload: row.type === 'MATCH' ? '' : row.payload.trim(),
        target: row.target.trim(),
      })),
      props.initialName,
    )
  } else {
    emits(
      'save-main',
      finalRows.map((row) => ({
        ...row,
        payload: row.type === 'MATCH' ? '' : row.payload.trim(),
        target: row.target.trim(),
      })),
    )
  }
  emits('update:modelValue', false)
}
</script>
