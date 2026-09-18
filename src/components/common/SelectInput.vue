<template>
  <button
    ref="triggerRef"
    v-bind="triggerAttrs()"
    type="button"
    role="combobox"
    :class="['select custom-select cursor-pointer text-left', attrs.class]"
    :style="attrs.style"
    :disabled="disabled"
    :aria-expanded="isOpen"
    aria-haspopup="listbox"
    :aria-controls="listboxId"
    :aria-activedescendant="isOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined"
    @click="toggle"
    @keydown="handleTriggerKeydown"
  >
    <span
      class="min-w-0 flex-1 truncate"
      :class="selectedOption ? '' : 'text-base-content/50'"
    >
      <slot
        name="value"
        :option="selectedOption"
      >
        {{ selectedOption?.label ?? placeholder ?? '' }}
      </slot>
    </span>
  </button>

  <Teleport
    v-if="isMounted"
    to="#app-content"
  >
    <Transition name="floating-menu">
      <div
        v-if="isOpen"
        :id="listboxId"
        ref="panelRef"
        role="listbox"
        :class="['floating-menu-panel', panelClass]"
        :style="panelStyle"
        :aria-label="ariaLabel()"
      >
        <div
          v-if="searchable"
          class="bg-base-100 sticky top-0 z-10 pb-1"
        >
          <input
            ref="searchInputRef"
            v-model="searchQuery"
            type="text"
            class="input input-sm input-bordered w-full"
            :placeholder="searchPlaceholder"
            @keydown="handleSearchKeydown"
          />
        </div>
        <template
          v-for="(option, index) in visibleOptions"
          :key="optionId(index)"
        >
          <div
            v-if="option.group && option.group !== visibleOptions[index - 1]?.group"
            class="text-base-content/45 px-2 pt-2 pb-1 text-xs font-medium"
          >
            {{ option.group }}
          </div>
          <div
            :id="optionId(index)"
            role="option"
            :aria-selected="isSelected(option)"
            :aria-disabled="option.disabled || undefined"
            :data-theme="option.theme"
            class="floating-menu-option"
            :class="[
              option.theme ? 'bg-base-100 text-base-content' : '',
              index === activeIndex && !option.disabled ? 'bg-base-200' : '',
              isSelected(option) ? [option.theme ? '' : 'text-primary', 'font-medium'] : '',
              option.disabled ? 'text-base-content/30 cursor-not-allowed' : '',
              optionClass,
            ]"
            @pointermove="setActiveIndex(index)"
            @pointerdown.prevent
            @click="selectOption(option)"
          >
            <span class="min-w-0 flex-1 truncate">
              <slot
                name="option"
                :option="option"
              >
                {{ option.label }}
              </slot>
            </span>
            <CheckIcon
              v-if="isSelected(option)"
              class="ml-2 h-4 w-4 flex-none"
            />
          </div>
        </template>
        <div
          v-if="searchable && !visibleOptions.length"
          class="text-base-content/40 px-2 py-3 text-center text-sm"
        >
          {{ noResultsText }}
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts" generic="T = unknown">
import { useFloatingMenu } from '@/composables/floatingMenu'
import { CheckIcon } from '@heroicons/vue/24/outline'
import { isEqual } from 'lodash'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, useId, watch } from 'vue'

export type SelectOption<T = unknown> = {
  value: T
  label: string
  disabled?: boolean
  group?: string
  theme?: string
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    options: readonly SelectOption<T>[]
    placeholder?: string
    disabled?: boolean
    panelClass?: string
    optionClass?: string
    /** 在面板顶部显示搜索框，按 label 部分匹配过滤选项 */
    searchable?: boolean
    searchPlaceholder?: string
    noResultsText?: string
  }>(),
  {
    placeholder: '',
    disabled: false,
    panelClass: '',
    optionClass: '',
    searchable: false,
    searchPlaceholder: '',
    noResultsText: '',
  },
)

const emit = defineEmits<{
  (e: 'change', value: T): void
}>()

defineSlots<{
  value(props: { option: SelectOption<T> | undefined }): unknown
  option(props: { option: SelectOption<T> }): unknown
}>()

const model = defineModel<T>({ required: true })
const attrs = useAttrs()
const triggerRef = ref<HTMLButtonElement>()
const panelRef = ref<HTMLDivElement>()
const searchInputRef = ref<HTMLInputElement>()
const isMounted = ref(false)
const isOpen = ref(false)
const activeIndex = ref(-1)
const searchQuery = ref('')
const id = useId().replace(/[^\w-]/g, '')
const listboxId = `select-listbox-${id}`
let typeahead = ''
let typeaheadTimer: ReturnType<typeof setTimeout> | undefined
const { panelStyle, remeasure } = useFloatingMenu(triggerRef, panelRef, isOpen)

const triggerAttrs = () => {
  const rest = { ...attrs }
  delete rest.class
  delete rest.style
  return rest
}
const ariaLabel = () => attrs['aria-label']?.toString()
// 非原始值（如 SourceIPFilter 的 string[]）在选项重建后引用会变，只比引用会让已选项
// 显示为空，所以对象/数组回退到深比较。
const isSameValue = (a: T, b: T) =>
  Object.is(a, b) ||
  (typeof a === 'object' && a !== null && typeof b === 'object' && b !== null && isEqual(a, b))

const visibleOptions = computed(() => {
  if (!props.searchable) return props.options
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return props.options
  return props.options.filter((option) => option.label.toLowerCase().includes(query))
})

const selectedOption = computed(() =>
  props.options.find((option) => isSameValue(option.value, model.value)),
)
const visibleSelectedIndex = computed(() =>
  visibleOptions.value.findIndex((option) => isSameValue(option.value, model.value)),
)

const optionId = (index: number) => `${listboxId}-option-${index}`
const isSelected = (option: SelectOption<T>) => isSameValue(option.value, model.value)

const firstEnabledIndex = () => visibleOptions.value.findIndex((option) => !option.disabled)
const lastEnabledIndex = () => {
  for (let index = visibleOptions.value.length - 1; index >= 0; index--) {
    if (!visibleOptions.value[index].disabled) return index
  }
  return -1
}

const moveActive = (direction: 1 | -1) => {
  const options = visibleOptions.value
  if (!options.length) return

  let index = activeIndex.value
  for (let count = 0; count < options.length; count++) {
    index = (index + direction + options.length) % options.length
    if (!options[index].disabled) {
      activeIndex.value = index
      scrollActiveIntoView()
      return
    }
  }
}

const setActiveIndex = (index: number) => {
  if (!visibleOptions.value[index]?.disabled) activeIndex.value = index
}

const scrollActiveIntoView = () => {
  nextTick(() => {
    panelRef.value
      ?.querySelector<HTMLElement>(`#${optionId(activeIndex.value)}`)
      ?.scrollIntoView({ block: 'nearest' })
  })
}

const focusSearch = () => {
  nextTick(() => searchInputRef.value?.focus())
}

const open = () => {
  if (props.disabled || isOpen.value) return
  activeIndex.value = visibleSelectedIndex.value >= 0 ? visibleSelectedIndex.value : firstEnabledIndex()
  isOpen.value = true
  scrollActiveIntoView()
  if (props.searchable) focusSearch()
}

const close = () => {
  if (!isOpen.value) return
  isOpen.value = false
  typeahead = ''
  if (typeaheadTimer) clearTimeout(typeaheadTimer)
}

const toggle = () => (isOpen.value ? close() : open())

const selectOption = (option: SelectOption<T>) => {
  if (option.disabled) return
  if (!isSelected(option)) {
    model.value = option.value
    emit('change', option.value)
  }
  close()
  triggerRef.value?.focus()
}

const selectActive = () => {
  const option = visibleOptions.value[activeIndex.value]
  if (option) selectOption(option)
}

const handleTypeahead = (key: string) => {
  typeahead += key.toLocaleLowerCase()
  if (typeaheadTimer) clearTimeout(typeaheadTimer)
  typeaheadTimer = setTimeout(() => (typeahead = ''), 500)

  const options = visibleOptions.value
  const start = Math.max(activeIndex.value, -1)
  for (let offset = 1; offset <= options.length; offset++) {
    const index = (start + offset) % options.length
    const option = options[index]
    if (!option.disabled && option.label.toLocaleLowerCase().startsWith(typeahead)) {
      activeIndex.value = index
      scrollActiveIntoView()
      return
    }
  }
}

const handleTriggerKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      if (!isOpen.value) open()
      else moveActive(1)
      break
    case 'ArrowUp':
      event.preventDefault()
      if (!isOpen.value) open()
      else moveActive(-1)
      break
    case 'Home':
      if (!isOpen.value) return
      event.preventDefault()
      activeIndex.value = firstEnabledIndex()
      scrollActiveIntoView()
      break
    case 'End':
      if (!isOpen.value) return
      event.preventDefault()
      activeIndex.value = lastEnabledIndex()
      scrollActiveIntoView()
      break
    case 'Enter':
    case ' ':
      event.preventDefault()
      if (isOpen.value) selectActive()
      else open()
      break
    case 'Escape':
      if (!isOpen.value) return
      event.preventDefault()
      close()
      break
    case 'Tab':
      close()
      break
    default:
      if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        if (props.searchable) {
          // 直接在触发器上打字：带入搜索框，由面板搜索过滤
          if (!isOpen.value) open()
          searchQuery.value += event.key
          focusSearch()
        } else {
          if (!isOpen.value) open()
          handleTypeahead(event.key)
        }
      }
  }
}

const handleSearchKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      moveActive(1)
      break
    case 'ArrowUp':
      event.preventDefault()
      moveActive(-1)
      break
    case 'Enter':
      event.preventDefault()
      selectActive()
      break
    case 'Escape':
      event.stopPropagation()
      close()
      triggerRef.value?.focus()
      break
    case 'Tab':
      close()
  }
}

watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) close()
  },
)

watch(isOpen, (open) => {
  if (open) return
  typeahead = ''
  if (typeaheadTimer) clearTimeout(typeaheadTimer)
  searchQuery.value = ''
})

watch(searchQuery, () => {
  if (!isOpen.value) return
  activeIndex.value = firstEnabledIndex()
  scrollActiveIntoView()
  remeasure()
})

watch(
  () => [model.value, props.options],
  () => {
    if (isOpen.value) {
      activeIndex.value = visibleSelectedIndex.value
      remeasure()
    }
  },
  { deep: true },
)

onMounted(() => (isMounted.value = true))
onBeforeUnmount(() => {
  if (typeaheadTimer) clearTimeout(typeaheadTimer)
})
</script>
