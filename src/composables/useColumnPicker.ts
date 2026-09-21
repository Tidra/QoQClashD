import { computed, toValue, type MaybeRefOrGetter, type WritableComputedRef } from 'vue'

export interface ColumnOption {
  key: string
  label: string
}

/**
 * 表格列选择器：已选列存在一个可写 ref 里（通常是 useStorage），未选列由选项表推导。
 *
 * 返回的字段是刻意做成可重命名解构的，模板里 `v-model="selected"` 配
 * `v-model="available"` 直接能用，不需要为每个选择器再写一遍 add/remove/label。
 */
export const useColumnPicker = (
  selected: WritableComputedRef<string[]> | { value: string[] },
  options: MaybeRefOrGetter<ColumnOption[]>,
) => {
  const available = computed({
    get: () =>
      toValue(options)
        .filter((option) => !selected.value.includes(option.key))
        .map((option) => option.key),
    // vuedraggable 在拖动两侧列表时会把目标数组整体写回，这里的增删一律走 add/remove，
    // 所以 setter 必须是空实现，否则拖一下就等于把未选列写成任意值。
    set: () => {},
  })

  const labelOf = (key: string) =>
    toValue(options).find((option) => option.key === key)?.label || key

  const add = (key: string) => {
    if (selected.value.includes(key)) return
    selected.value = [...selected.value, key]
  }

  const remove = (key: string) => {
    selected.value = selected.value.filter((column) => column !== key)
  }

  return { selected, available, labelOf, add, remove }
}
