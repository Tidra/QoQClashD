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
            class="toggle"
          />
        </div>
      </div>

      <div class="border-base-300/60 bg-base-200/40 rounded-md border p-3">
        <div class="mb-2 flex items-center justify-between">
          <div class="text-sm font-medium">{{ $t('tunSettings') }}</div>
          <input
            v-model="form.tunEnable"
            type="checkbox"
            class="toggle"
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
            <!-- 留空 = 内核默认 9000 -->
            <input
              v-model.number="form.tunMtu"
              type="number"
              min="576"
              class="input input-sm w-24"
              :placeholder="String(TUN_DEFAULTS.mtu)"
            />
          </div>
          <div class="setting-item">
            <div class="setting-item-label shrink-0!">{{ $t('tunAutoRoute') }}</div>
            <input
              v-model="form.tunAutoRoute"
              type="checkbox"
              class="toggle"
            />
          </div>
          <div class="setting-item">
            <div class="setting-item-label shrink-0!">{{ $t('tunAutoDetectInterface') }}</div>
            <input
              v-model="form.tunAutoDetectInterface"
              type="checkbox"
              class="toggle"
            />
          </div>
          <div class="setting-item">
            <div class="setting-item-label shrink-0!">{{ $t('tunStrictRoute') }}</div>
            <input
              v-model="form.tunStrictRoute"
              type="checkbox"
              class="toggle"
            />
          </div>
          <div class="setting-item node-span-2">
            <div class="setting-item-label shrink-0!">{{ $t('tunDnsHijack') }}</div>
            <!-- 留空 = 内核默认 any:53 -->
            <input
              v-model="form.tunDnsHijackStr"
              type="text"
              class="input input-sm node-long-input"
              :placeholder="TUN_DEFAULTS.dnsHijack"
            />
          </div>
        </div>
        <div class="text-base-content/60 mt-1 text-xs">{{ $t('mainEntryLocked') }}</div>
      </div>

      <div class="border-base-300/60 bg-base-200/40 rounded-md border p-3">
        <div class="mb-2 flex items-center justify-between">
          <div class="text-sm font-medium">{{ $t('dnsSettings') }}</div>
          <input
            v-model="form.dnsEnable"
            type="checkbox"
            class="toggle"
            :title="$t('dnsSettings')"
          />
        </div>
        <div
          v-show="form.dnsEnable"
          class="settings-grid node-form-grid"
        >
          <div class="setting-item node-span-2">
            <div class="setting-item-label shrink-0!">{{ $t('dnsNameserver') }}</div>
            <input
              v-model="form.dnsNameserverStr"
              type="text"
              class="input input-sm node-long-input"
              placeholder="223.5.5.5, https://dns.google/dns-query"
            />
          </div>
          <div class="setting-item node-span-2">
            <div class="setting-item-label shrink-0!">{{ $t('dnsFallback') }}</div>
            <input
              v-model="form.dnsFallbackStr"
              type="text"
              class="input input-sm node-long-input"
              placeholder="1.1.1.1, 8.8.8.8"
            />
          </div>
          <div class="setting-item node-span-2">
            <div class="setting-item-label shrink-0!">{{ $t('dnsDefaultNameserver') }}</div>
            <input
              v-model="form.dnsDefaultNameserverStr"
              type="text"
              class="input input-sm node-long-input"
              placeholder="system"
            />
          </div>
          <div class="setting-item">
            <div class="setting-item-label shrink-0!">{{ $t('dnsEnhancedMode') }}</div>
            <SelectInput
              v-model="form.dnsEnhancedMode"
              class="select select-sm min-w-28"
              :options="[
                { value: '', label: $t('dnsKernelDefault') },
                ...DNS_ENHANCED_MODES.map((mode) => ({ value: mode, label: mode })),
              ]"
            />
          </div>
          <div class="setting-item">
            <div class="setting-item-label shrink-0!">{{ $t('dnsFakeIpRange') }}</div>
            <input
              v-model="form.dnsFakeIpRange"
              type="text"
              class="input input-sm w-36"
              placeholder="198.18.0.1/16"
            />
          </div>
        </div>
        <div
          v-show="form.dnsEnable"
          class="text-base-content/60 mt-1 text-xs"
        >
          {{ $t('dnsRestartHint') }}
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
        :disabled="inputMode === 'yaml' ? !entryYaml.trim() : !canSaveForm"
        @click="saveEntry"
      >
        {{ $t('save') }}
      </button>
    </div>
  </DialogWrapper>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import DialogWrapper from '@/components/common/DialogWrapper.vue'
import SegmentedControl from '@/components/common/SegmentedControl.vue'
import SelectInput from '@/components/common/SelectInput.vue'
import { useDualInputMode } from '@/composables/dualInputMode'
import { parse as parseYaml } from 'yaml'
import { DNS_ENHANCED_MODES, TUN_STACKS } from '@/store/routing'
import type { DnsDraft, MainEntryDraft } from '@/store/routing'

const props = defineProps<{
  modelValue: boolean
  initial: MainEntryDraft
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', payload: MainEntryDraft): void
}>()

// 留空即使用内核默认值：灰字占位展示，构建 YAML 时省略该键
const TUN_DEFAULTS = { mtu: 9000, dnsHijack: 'any:53' }

/** 逗号分隔的输入框 ↔ 字符串列表 */
const toList = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

const toStringList = (value: unknown) => {
  if (Array.isArray(value)) return value.map(String)
  if (typeof value === 'string') return toList(value)
  return undefined
}

const toStr = (value: unknown) => (typeof value === 'string' ? value : undefined)

const createForm = (initial: MainEntryDraft) => {
  const hijack = (initial.tun?.['dns-hijack'] ?? []).join(',')
  return {
    port: initial.port,
    socksPort: initial['socks-port'],
    mixedPort: initial['mixed-port'],
    redirPort: initial['redir-port'],
    tproxyPort: initial['tproxy-port'],
    allowLan: initial['allow-lan'] ?? false,
    tunEnable: initial.tun?.enable ?? false,
    tunStack: initial.tun?.stack ?? 'gvisor',
    tunDevice: initial.tun?.device ?? '',
    tunMtu: initial.tun?.mtu === TUN_DEFAULTS.mtu ? undefined : initial.tun?.mtu,
    tunAutoRoute: initial.tun?.['auto-route'] ?? true,
    tunAutoDetectInterface: initial.tun?.['auto-detect-interface'] ?? true,
    tunStrictRoute: initial.tun?.['strict-route'] ?? false,
    tunDnsHijackStr: hijack === TUN_DEFAULTS.dnsHijack ? '' : hijack,
    // 草稿里没有 dns 这一项就是「不配置」，与内核默认解析一致
    dnsEnable: !!initial.dns,
    dnsNameserverStr: (initial.dns?.nameserver ?? []).join(','),
    dnsFallbackStr: (initial.dns?.fallback ?? []).join(','),
    dnsDefaultNameserverStr: (initial.dns?.['default-nameserver'] ?? []).join(','),
    dnsEnhancedMode: initial.dns?.['enhanced-mode'] ?? '',
    dnsFakeIpRange: initial.dns?.['fake-ip-range'] ?? '',
  }
}

const form = ref(createForm(props.initial))

const hasAnyPort = computed(() =>
  [
    form.value.port,
    form.value.socksPort,
    form.value.mixedPort,
    form.value.redirPort,
    form.value.tproxyPort,
  ].some((port) => typeof port === 'number' && port > 0),
)

// 开了 DNS 却不给上游，落出去的就是一个只会走内核硬编码默认值的空块
const dnsUsable = computed(
  () => !form.value.dnsEnable || toList(form.value.dnsNameserverStr).length > 0,
)

const canSaveForm = computed(() => hasAnyPort.value && dnsUsable.value)

const resetForm = () => {
  form.value = createForm(props.initial)
  resetInputMode()
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
  const dnsHijack = toList(f.tunDnsHijackStr)
  const dnsNameserver = toList(f.dnsNameserverStr)
  const dnsFallback = toList(f.dnsFallbackStr)
  const dnsDefaultNameserver = toList(f.dnsDefaultNameserverStr)
  const dns: DnsDraft = {
    ...(f.dnsEnhancedMode ? { 'enhanced-mode': f.dnsEnhancedMode } : {}),
    ...(dnsDefaultNameserver.length ? { 'default-nameserver': dnsDefaultNameserver } : {}),
    ...(dnsNameserver.length ? { nameserver: dnsNameserver } : {}),
    ...(dnsFallback.length ? { fallback: dnsFallback } : {}),
    ...(f.dnsFakeIpRange.trim() ? { 'fake-ip-range': f.dnsFakeIpRange.trim() } : {}),
  }
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
      ...(dnsHijack.length ? { 'dns-hijack': dnsHijack } : {}),
    },
    ...(f.dnsEnable ? { dns } : {}),
  }
}

const applyYaml = (yamlText: string): boolean => {
  try {
    const parsed = parseYaml(yamlText) as Record<string, unknown>
    if (!parsed || typeof parsed !== 'object') return false
    const tun = parsed.tun as Record<string, unknown> | undefined
    const dns = parsed.dns as Record<string, unknown> | undefined
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
        device: toStr(tun?.device),
        mtu: typeof tun?.mtu === 'number' ? tun.mtu : undefined,
        'auto-route': tun?.['auto-route'] !== false,
        'auto-detect-interface': tun?.['auto-detect-interface'] !== false,
        'strict-route': tun?.['strict-route'] === true,
        'dns-hijack': toStringList(tun?.['dns-hijack']),
      },
      dns: dns
        ? {
            'enhanced-mode': toStr(dns['enhanced-mode']),
            'default-nameserver': toStringList(dns['default-nameserver']),
            nameserver: toStringList(dns.nameserver),
            fallback: toStringList(dns.fallback),
            'fake-ip-range': toStr(dns['fake-ip-range']),
          }
        : undefined,
    })
    return true
  } catch {
    return false
  }
}

const {
  inputMode,
  inputModeOptions,
  switchInputMode,
  resetInputMode,
  commitYaml,
  yamlText: entryYaml,
} = useDualInputMode({
  buildYaml: () => buildDraft(),
  applyYaml: (yamlText) => applyYaml(yamlText),
})

const handleModelValueUpdate = (value: boolean | undefined) => {
  if (value !== undefined) emits('update:modelValue', value)
}

const saveEntry = () => {
  if (inputMode.value === 'yaml' && !commitYaml()) return
  if (!canSaveForm.value) return
  emits('save', buildDraft())
  emits('update:modelValue', false)
}
</script>
