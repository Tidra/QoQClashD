<template>
  <div class="flex w-full flex-col gap-1.5">
    <div class="flex w-full items-center gap-2">
      <slot name="prefix"></slot>
      <TextInput
        class="min-w-0 flex-1"
        :menus="sourceList"
        v-model="sourceIPLabel.key"
        placeholder="IP/CIDR | eui64 | /Regex"
      />

      <slot></slot>
    </div>
    <div class="flex w-full items-center gap-2">
      <ArrowRightCircleIcon class="text-base-content/40 h-4 w-4 shrink-0" />
      <TextInput
        class="flex-1"
        v-model="sourceIPLabel.label"
        :placeholder="$t('label')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { getConnectionSourceIP } from '@/helper'
import { connections } from '@/store/connections'
import { sourceIPLabelList } from '@/store/settings'
import type { SourceIPLabel } from '@/types'
import { ArrowRightCircleIcon } from '@heroicons/vue/24/outline'
import { uniq } from 'lodash'
import { computed } from 'vue'
import TextInput from '../../common/TextInput.vue'

const sourceIPLabel = defineModel<Partial<SourceIPLabel>>({
  default: () => ({
    key: '',
    label: '',
  }),
})
const sourceList = computed(() => {
  return uniq(connections.value.map(getConnectionSourceIP))
    .filter(Boolean)
    .filter((ip) => !sourceIPLabelList.value.find((item) => item.key === ip))
    .sort()
})
</script>
