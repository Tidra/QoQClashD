<!--
  后端连接参数的表单字段。新增与编辑共用同一份 —— 两处字段本就该一致。

  disableUpgradeCore / disableTunMode 有意不在这里出现:它们是给通过 URL 参数
  下发后端的场景用的(见 getBackendFromUrl),由分发方决定藏掉哪些功能,
  不是手填地址的人要操心的东西。编辑时原样带过,不清空。

  这里只管字段。可达性探测留在父级:登录页要根据探测结果决定能不能自动登录,
  探测状态藏进子组件父级就读不到了。
-->
<template>
  <div class="settings-grid node-form-grid">
    <div class="setting-item node-span-2">
      <div class="setting-item-label shrink-0!">{{ $t('host') }}</div>
      <!-- 连接地址框：尾部 X 一键清空 -->
      <TextInput
        class="node-long-input"
        name="username"
        autocomplete="username"
        clearable
        v-model="model.host"
        placeholder="127.0.0.1"
      />
    </div>
    <div class="setting-item">
      <div class="setting-item-label shrink-0!">{{ $t('protocol') }}</div>
      <SelectInput
        class="select select-sm min-w-24"
        v-model="model.protocol"
        :options="[
          { value: 'http', label: 'HTTP' },
          { value: 'https', label: 'HTTPS' },
        ]"
      />
    </div>
    <div class="setting-item">
      <div class="setting-item-label shrink-0!">{{ $t('port') }}</div>
      <TextInput
        class="w-24"
        v-model="model.port"
        placeholder="9090"
      />
    </div>

    <div class="setting-item node-span-2">
      <div class="setting-item-label flex shrink-0! items-center gap-1">
        <span>{{ $t('secondaryPath') }}</span>
        <span
          class="tooltip flex-none"
          :data-tip="$t('secondaryPathTip')"
        >
          <QuestionMarkCircleIcon class="h-4 w-4" />
        </span>
      </div>
      <TextInput
        class="node-long-input"
        v-model="model.secondaryPath"
        clearable
        :placeholder="$t('secondaryPathPlaceholder')"
      />
    </div>
    <div class="setting-item node-span-2">
      <div class="setting-item-label shrink-0!">{{ $t('label') }}</div>
      <TextInput
        class="node-long-input"
        v-model="model.label"
        :placeholder="$t('backendLabelPlaceholder')"
      />
    </div>

    <div class="setting-item node-span-2">
      <div class="setting-item-label shrink-0!">{{ $t('password') }}</div>
      <input
        type="password"
        class="input input-sm node-long-input"
        autocomplete="current-password"
        v-model="model.password"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import TextInput from '@/components/common/TextInput.vue'
import SelectInput from '@/components/common/SelectInput.vue'
import type { Backend } from '@/types'
import { QuestionMarkCircleIcon } from '@heroicons/vue/24/outline'

const model = defineModel<Omit<Backend, 'uuid'>>({ required: true })
</script>
