<template>
  <DialogWrapper
    :model-value="modelValue"
    :title="isEditing ? $t('proxyGroupEditorEditGroup') : $t('proxyGroupEditorAddGroup')"
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

    <div v-if="inputMode === 'yaml'" class="flex min-h-[420px] flex-col">
      <textarea
        v-model="groupYaml"
        class="textarea textarea-bordered h-[420px] w-full resize-none border-base-300 bg-base-100 font-mono text-xs"
        spellcheck="false"
      ></textarea>
    </div>
    <div v-else class="settings-grid node-form-grid">
      <div class="setting-item">
        <div class="setting-item-label">{{ $t('proxyGroupEditorGroup') }}</div>
        <input v-model="groupForm.name" type="text" class="input input-sm w-40" :placeholder="$t('proxyGroupEditorNamePlaceholder')" />
      </div>
      <div class="setting-item">
        <div class="setting-item-label">{{ $t('proxyGroupEditorGroupType') }}</div>
        <SelectInput
          v-model="groupForm.type"
          class="select select-sm min-w-24"
          :options="proxyTypeOptions"
        />
      </div>

      <template v-if="showUrlField">
        <div class="setting-item node-span-2">
          <div class="setting-item-label">{{ $t('proxyGroupEditorUrl') }}</div>
          <input v-model="groupForm.url" type="text" class="input input-sm w-full max-w-64" :placeholder="$t('proxyGroupEditorUrlPlaceholder')" />
        </div>
        <div class="setting-item">
          <div class="setting-item-label">{{ $t('proxyGroupEditorInterval') }} (s)</div>
          <input v-model.number="groupForm.interval" type="number" min="1" class="input input-sm w-24" />
        </div>
        <div class="setting-item">
          <div class="setting-item-label">{{ $t('proxyGroupEditorTimeout') }} (ms)</div>
          <input v-model.number="groupForm.timeout" type="number" min="1" class="input input-sm w-24" />
        </div>
      </template>

      <div v-if="groupForm.type === 'url-test'" class="setting-item">
        <div class="setting-item-label">{{ $t('proxyGroupEditorTolerance') }} (ms)</div>
        <input v-model.number="groupForm.tolerance" type="number" min="0" class="input input-sm w-24" />
      </div>
      <div v-if="groupForm.type === 'load-balance'" class="setting-item">
        <div class="setting-item-label">{{ $t('proxyGroupEditorStrategy') }}</div>
        <SelectInput
          v-model="groupForm.strategy"
          class="select select-sm min-w-24"
          :options="[
            { value: '', label: 'default' },
            { value: 'consistent-hashing', label: 'consistent-hashing' },
            { value: 'round-robin', label: 'round-robin' },
            { value: 'sticky-sessions', label: 'sticky-sessions' },
          ]"
        />
      </div>
      <div v-if="groupForm.type === 'load-balance'" class="setting-item">
        <div class="setting-item-label">{{ $t('proxyGroupEditorMinCount') }}</div>
        <input v-model.number="groupForm.minCount" type="number" min="0" class="input input-sm w-24" />
      </div>
      <div v-if="groupForm.type === 'select'" class="setting-item node-span-2">
        <div class="setting-item-label">{{ $t('proxyGroupEditorDefaultSelected') }}</div>
        <SelectInput
          v-model="groupForm.defaultSelected"
          :options="defaultSelectedOptions"
          placeholder="--"
          searchable
          :search-placeholder="$t('proxyGroupEditorSearchOption')"
          :no-results-text="$t('proxyGroupEditorNoMatch')"
          class="select select-sm min-w-0 max-w-64 flex-1"
        />
      </div>

      <div class="setting-item">
        <div class="setting-item-label">{{ $t('proxyGroupEditorFilter') }}</div>
        <input v-model="groupForm.filter" type="text" class="input input-sm w-40" placeholder="(?i)港|hk" />
      </div>
      <div class="setting-item">
        <div class="setting-item-label">{{ $t('proxyGroupEditorExcludeFilter') }}</div>
        <input v-model="groupForm.excludeFilter" type="text" class="input input-sm w-40" placeholder="美|日" />
      </div>

      <div class="setting-item node-span-2 !flex-col !items-stretch !gap-2">
        <div class="flex items-center gap-2">
          <div class="setting-item-label shrink-0!">{{ $t('proxyGroupEditorMembers') }}</div>
          <TextInput
            v-model="memberFilter"
            :placeholder="$t('proxyGroupEditorMemberFilter')"
            clearable
            class="min-w-0 max-w-52 flex-1"
          />
          <span class="text-base-content/50 shrink-0 text-xs">
            {{ $t('proxyGroupEditorMembersSelected', { selected: expandedMemberNames.length, total: selectableMembers.length }) }}
          </span>
          <button
            type="button"
            class="btn btn-ghost btn-xs shrink-0"
            :disabled="!toggleableFilteredMembers.length"
            @click="toggleSelectAllFiltered"
          >
            {{ allFilteredSelected ? $t('proxyGroupEditorDeselectAll') : $t('proxyGroupEditorSelectAll') }}
          </button>
        </div>
        <div class="border-base-300 bg-base-100 max-h-48 overflow-y-auto rounded-md border">
            <label
              v-for="row in memberCandidates"
              :key="row.name"
              class="hover:bg-base-200/60 flex min-h-8 items-center gap-2 px-2 py-1 text-sm"
              :class="row.managed ? 'opacity-70' : 'cursor-pointer'"
            >
              <input
                type="checkbox"
                class="checkbox checkbox-xs shrink-0"
                :checked="row.checked"
                :disabled="row.managed"
                @change="toggleMember(row.name, ($event.target as HTMLInputElement).checked)"
              />
              <span
                class="badge badge-xs shrink-0"
                :class="row.kind === 'group' ? 'badge-warning' : 'badge-info'"
              >
                {{ row.kind === 'group' ? $t('memberKindGroup') : $t('memberKindNode') }}
              </span>
              <span class="min-w-0 flex-1 truncate" :title="row.name">{{ row.name }}</span>
              <span v-if="row.managed" class="badge badge-ghost badge-xs shrink-0">{{ $t('proxyGroupEditorFilterManaged') }}</span>
            </label>
            <div v-if="!memberCandidates.length" class="text-base-content/60 py-3 text-center text-sm">
              {{ $t('proxyGroupEditorNoMatch') }}
            </div>
        </div>
      </div>
    </div>

    <!-- 操作行 -->
    <div class="flex items-center justify-end gap-2 border-t border-base-300/60 p-4 pt-3">
      <button type="button" class="btn btn-sm btn-ghost" @click="$emit('update:modelValue', false)">
        {{ $t('cancel') }}
      </button>
      <button
        type="button"
        class="btn btn-sm btn-primary"
        :disabled="inputMode === 'yaml' ? !groupYaml.trim() : !canSave"
        @click="saveGroup"
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
import TextInput from '@/components/common/TextInput.vue'
import type { ProxyGroupDraft, ProxyGroupMemberOption } from '@/types'
import { PROXY_TYPE } from '@/constant'
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml'
import { showNotification } from '@/helper/notification'
import { matchesFilterPattern } from '@/store/proxyGroups'

const normalizeGroupType = (type?: string) => {
  const value = (type ?? PROXY_TYPE.Selector).toLowerCase()
  if (value === 'selector' || value === 'select') return 'select'
  if (value === 'urltest' || value === 'url-test') return 'url-test'
  if (value === 'loadbalance' || value === 'load-balance') return 'load-balance'
  if (value === 'fallback') return 'fallback'
  return value
}

const props = defineProps<{
  modelValue: boolean
  memberOptions: ProxyGroupMemberOption[]
  /** 编辑已有组时传入原始数据,新建时不传 */
  initial?: ProxyGroupDraft
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (
    e: 'save',
    payload: ProxyGroupDraft,
  ): void
}>()

const { t } = useI18n()

const isEditing = computed(() => !!props.initial?.name)

const createGroupForm = (initial?: ProxyGroupDraft & { 'min-count'?: number }) => ({
  name: initial?.name ?? '',
  type: normalizeGroupType(initial?.type),
  url: initial?.url ?? 'https://www.gstatic.com/generate_204',
  interval: initial?.interval ?? 3600,
  timeout: initial?.timeout ?? 5000,
  tolerance: initial?.tolerance,
  strategy: initial?.strategy ?? '',
  minCount: initial?.minCount ?? initial?.['min-count'],
  filter: initial?.filter ?? '',
  excludeFilter: initial?.['exclude-filter'] ?? '',
  defaultSelected: initial?.['default-selected'] ?? '',
})

const groupForm = ref(createGroupForm(props.initial))
const inputMode = ref<'form' | 'yaml'>('form')
const groupYaml = ref('')
const inputModeOptions = computed<SegmentOption[]>(() => [
  { value: 'form', label: t('formMode') },
  { value: 'yaml', label: t('dualModeYaml') },
])

const members = ref<string[]>([...(props.initial?.proxies ?? [])])
const memberFilter = ref('')

const resetForm = () => {
  groupForm.value = createGroupForm(props.initial)
  members.value = [...(props.initial?.proxies ?? [])]
  memberFilter.value = ''
  inputMode.value = 'form'
  groupYaml.value = ''
}

watch(
  () => props.initial,
  () => {
    resetForm()
  },
  { deep: true },
)

const buildGroupDraft = (): ProxyGroupDraft => {
  const type = normalizeGroupType(groupForm.value.type)
  const isHealthCheckGroup =
    type === 'url-test' || type === 'fallback' || type === 'load-balance'
  return {
    name: groupForm.value.name.trim(),
    type,
    proxies: members.value,
    url: isHealthCheckGroup ? groupForm.value.url || undefined : undefined,
    interval: isHealthCheckGroup ? groupForm.value.interval : undefined,
    timeout: isHealthCheckGroup ? groupForm.value.timeout : undefined,
    tolerance: type === 'url-test' && groupForm.value.tolerance != null ? groupForm.value.tolerance : undefined,
    strategy: type === 'load-balance' && groupForm.value.strategy ? groupForm.value.strategy : undefined,
    minCount: type === 'load-balance' && groupForm.value.minCount != null ? groupForm.value.minCount : undefined,
    filter: groupForm.value.filter?.trim() || undefined,
    'exclude-filter': groupForm.value.excludeFilter?.trim() || undefined,
    'default-selected': type === 'select' && groupForm.value.defaultSelected?.trim() ? groupForm.value.defaultSelected.trim() : undefined,
    // 表单不再编辑这些字段，原值透传避免编辑保存时被清空
    icon: props.initial?.icon,
    hidden: props.initial?.hidden,
    lazy: props.initial?.lazy,
  }
}

const buildGroupYamlObject = () => {
  const draft = buildGroupDraft()
  return {
    name: draft.name,
    type: draft.type,
    proxies: draft.proxies,
    ...(draft.url ? { url: draft.url } : {}),
    ...(draft.interval != null ? { interval: draft.interval } : {}),
    ...(draft.timeout != null ? { timeout: draft.timeout } : {}),
    ...(draft.tolerance != null ? { tolerance: draft.tolerance } : {}),
    ...(draft.strategy ? { strategy: draft.strategy } : {}),
    ...(draft.minCount != null ? { 'min-count': draft.minCount } : {}),
    ...(draft.filter ? { filter: draft.filter } : {}),
    ...(draft['exclude-filter'] ? { 'exclude-filter': draft['exclude-filter'] } : {}),
    ...(draft['default-selected'] ? { 'default-selected': draft['default-selected'] } : {}),
    ...(draft.icon ? { icon: draft.icon } : {}),
    ...(draft.hidden ? { hidden: true } : {}),
    ...(draft.lazy ? { lazy: true } : {}),
  }
}

const switchInputMode = (mode: 'form' | 'yaml') => {
  if (mode === 'yaml') {
    groupYaml.value = stringifyYaml(buildGroupYamlObject(), { indent: 2 })
  }
  else {
    try {
      const parsed = parseYaml(groupYaml.value) as ProxyGroupDraft
      groupForm.value = createGroupForm(parsed)
      members.value = [...(parsed.proxies ?? [])]
    } catch {
      showNotification({ content: 'invalidURL', type: 'alert-error' })
      return
    }
  }
  inputMode.value = mode
}

watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      resetForm()
    }
  },
)

const proxyTypeOptions = computed(() => [
  { value: 'select', label: t('proxyGroupEditorGroupTypeSelect') },
  { value: 'url-test', label: t('proxyGroupEditorGroupTypeUrlTest') },
  { value: 'fallback', label: t('proxyGroupEditorGroupTypeFallback') },
  { value: 'load-balance', label: t('proxyGroupEditorGroupTypeLoadBalance') },
])

const showUrlField = computed(
  () =>
    groupForm.value.type === 'url-test' ||
    groupForm.value.type === 'fallback' ||
    groupForm.value.type === 'load-balance',
)

const selectableMembers = computed(() =>
  [...props.memberOptions]
    .filter((option) => option.name !== groupForm.value.name)
    .sort((a, b) => a.name.localeCompare(b.name)),
)

// 筛选条件命中的节点由筛选自动管理，展示为勾选且不可取消
const filterManagedMembers = computed(() => {
  const filter = groupForm.value.filter?.trim()
  if (!filter) return new Set<string>()
  const exclude = groupForm.value.excludeFilter?.trim()
  return new Set(
    props.memberOptions
      .filter((option) => option.kind === 'node')
      .map((option) => option.name)
      .filter((name) => matchesFilterPattern(filter, name) && !(exclude && matchesFilterPattern(exclude, name))),
  )
})

const expandedMemberNames = computed(() => [
  ...new Set([...filterManagedMembers.value, ...members.value]),
])

// 默认选择只允许在最终成员（含筛选展开）中挑
const defaultSelectedOptions = computed(() => [
  { value: '', label: '--' },
  ...expandedMemberNames.value.map((name) => ({ value: name, label: name })),
])

const memberCandidates = computed(() => {
  const selected = new Set(members.value)
  const keyword = memberFilter.value.trim()
  return selectableMembers.value
    .map((option) => {
      const managed = filterManagedMembers.value.has(option.name)
      return {
        name: option.name,
        kind: option.kind,
        managed,
        checked: managed || selected.has(option.name),
      }
    })
    .filter((row) => !keyword || matchesFilterPattern(keyword, row.name))
    .sort((a, b) => Number(b.checked) - Number(a.checked) || a.name.localeCompare(b.name))
})

const toggleMember = (name: string, checked: boolean) => {
  if (filterManagedMembers.value.has(name)) return
  const index = members.value.indexOf(name)
  if (checked && index === -1) members.value.push(name)
  if (!checked && index !== -1) {
    members.value.splice(index, 1)
    if (groupForm.value.defaultSelected === name) groupForm.value.defaultSelected = ''
  }
}

// 全选/取消全选只作用于当前过滤结果里可手动勾选的行
const toggleableFilteredMembers = computed(() =>
  memberCandidates.value.filter((row) => !row.managed),
)

const allFilteredSelected = computed(
  () =>
    toggleableFilteredMembers.value.length > 0 &&
    toggleableFilteredMembers.value.every((row) => row.checked),
)

const toggleSelectAllFiltered = () => {
  const checked = !allFilteredSelected.value
  for (const row of toggleableFilteredMembers.value) toggleMember(row.name, checked)
}

const canSave = computed(() => {
  return groupForm.value.name.trim().length > 0
})

const handleModelValueUpdate = (value: boolean | undefined) => {
  if (value !== undefined) {
    emits('update:modelValue', value)
  }
}

const saveGroup = () => {
  if (inputMode.value === 'yaml') {
    try {
      const parsed = parseYaml(groupYaml.value) as ProxyGroupDraft
      if (!parsed || typeof parsed !== 'object' || !parsed.name || !parsed.type || !Array.isArray(parsed.proxies)) {
        throw new Error('Invalid proxy group YAML')
      }
      emits('save', parsed)
      emits('update:modelValue', false)
    } catch {
      showNotification({ content: 'invalidURL', type: 'alert-error' })
    }
    return
  }
  if (!canSave.value) return

  emits('save', buildGroupDraft())
  emits('update:modelValue', false)
}
</script>

<style scoped>
.ghost {
  opacity: 0.4;
}
</style>
