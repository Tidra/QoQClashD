<template>
  <div
    class="text-sm"
  >
    <div
      v-if="!hasVisibleItems"
      class="base-container mb-4 flex flex-col gap-3 p-4"
    >
      <div class="font-medium">控制服务配置</div>
      <div
        v-if="runtimeInfo"
        class="grid gap-2 text-xs text-base-content/70 sm:grid-cols-2"
      >
        <div><span class="font-medium">运行目录：</span>{{ runtimeInfo.root }}</div>
        <div><span class="font-medium">核心目录：</span>{{ runtimeInfo.kernel }}</div>
        <div><span class="font-medium">配置目录：</span>{{ runtimeInfo.config }}</div>
        <div><span class="font-medium">Profiles：</span>{{ runtimeInfo.profiles }}</div>
        <div class="sm:col-span-2"><span class="font-medium">当前配置：</span>{{ runtimeInfo.activeConfig }}</div>
      </div>
      <div
        v-else
        class="text-xs text-base-content/60"
      >
        控制服务未连接，启动 agent 后将显示运行目录、核心路径和当前配置。
      </div>
      <div class="flex gap-2">
        <button
          class="btn btn-sm btn-primary"
          @click="ensureKernel"
        >
          下载并启动核心
        </button>
        <button
          class="btn btn-sm btn-outline"
          @click="showConfigEditor = true"
        >
          YAML 编辑
        </button>
      </div>
    </div>
    <template v-if="isVisibleBackendSwitch">
      <div class="settings-section-label">{{ $t('settingsSectionCurrentBackend') }}</div>
      <div class="settings-grid">
        <SettingItem
          :setting-key="k.backend"
          class="py-3"
        >
          <div class="flex w-full flex-col gap-3">
            <div class="flex items-center gap-2 px-1">
              <div class="indicator">
                <span
                  v-if="isCoreUpdateAvailable"
                  class="indicator-item top-1 -right-1 flex"
                >
                  <span class="bg-secondary absolute h-2 w-2 animate-ping rounded-full"></span>
                  <span class="bg-secondary h-2 w-2 rounded-full"></span>
                </span>
                <a
                  class="flex cursor-pointer items-center gap-2 font-semibold"
                  :href="coreBrand.url"
                  target="_blank"
                >
                  {{ $t('backend') }}
                  <BackendVersion class="text-sm font-normal" />
                </a>
              </div>
            </div>
            <BackendSwitch :show-actions="false" />
          </div>
        </SettingItem>
      </div>
    </template>

    <template v-if="hasVisibleActions">
      <div class="settings-section-label">{{ $t('settingsSectionCoreOperations') }}</div>
      <div class="settings-grid">
        <SettingItem
          v-for="action in backendActions"
          :key="action.key"
          :setting-key="action.key"
        >
          <div class="setting-item-label">{{ $t(action.label) }}</div>
          <button
            :class="['btn btn-sm min-w-11', action.key === k.upgradeCore && 'btn-neutral']"
            :disabled="action.running"
            :aria-label="$t(action.label)"
            @click="action.run()"
          >
            <span
              v-if="action.running"
              class="loading loading-spinner h-4 w-4"
            ></span>
            <component
              :is="action.icon"
              v-else
              class="h-4 w-4"
            />
          </button>
        </SettingItem>
      </div>
    </template>

    <template v-if="hasVisibleNetworkSettings">
      <div class="settings-section-label">{{ $t('settingsSectionNetworkListening') }}</div>
      <div class="settings-grid">
        <SettingItem
          :setting-key="k.ports"
          class="py-3"
        >
          <div class="flex w-full flex-col gap-3">
            <div class="setting-item-label">{{ $t('ports') }}</div>
            <BackendPortsGrid />
          </div>
        </SettingItem>
        <SettingItem
          :setting-key="k.tunMode"
          :when="!!configs?.tun && !activeBackend?.disableTunMode"
        >
          <div class="setting-item-label">{{ $t('tunMode') }}</div>
          <input
            v-model="configs!.tun.enable"
            class="toggle"
            type="checkbox"
            @change="hanlderTunModeChange"
          />
        </SettingItem>
        <SettingItem
          v-if="configs?.tun.enable"
          :setting-key="k.tunConfig"
          :when="!activeBackend?.disableTunMode"
          class="py-3"
        >
          <div class="setting-item-label mb-2">{{ $t('tunConfig') }}</div>
          <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
            <label class="form-control w-full">
              <span class="label-text mb-1">{{ $t('tunStack') }}</span>
              <select
                v-model="tunForm.stack"
                class="select select-bordered select-sm w-full"
                @change="handleTunConfigChange"
              >
                <option value="gvisor">gvisor</option>
                <option value="system">system</option>
                <option value="mixed">mixed</option>
              </select>
            </label>
            <label class="form-control w-full">
              <span class="label-text mb-1">{{ $t('tunMtu') }}</span>
              <input
                v-model.number="tunForm.mtu"
                type="number"
                min="1280"
                max="9000"
                class="input input-bordered input-sm w-full"
                @change="handleTunConfigChange"
              />
            </label>
            <label class="form-control w-full">
              <span class="label-text mb-1">{{ $t('tunDevice') }}</span>
              <input
                v-model="tunForm.device"
                type="text"
                class="input input-bordered input-sm w-full"
                :placeholder="$t('tunDevice')"
                @change="handleTunConfigChange"
              />
            </label>
            <div class="flex flex-col gap-2">
              <label class="label cursor-pointer justify-start gap-3">
                <input
                  v-model="tunForm.autoDetectInterface"
                  type="checkbox"
                  class="checkbox"
                  @change="handleTunConfigChange"
                />
                <span class="label-text">{{ $t('tunAutoDetectInterface') }}</span>
              </label>
              <label class="label cursor-pointer justify-start gap-3">
                <input
                  v-model="tunForm.strictRoute"
                  type="checkbox"
                  class="checkbox"
                  @change="handleTunConfigChange"
                />
                <span class="label-text">{{ $t('tunStrictRoute') }}</span>
              </label>
            </div>
          </div>
        </SettingItem>
        <SettingItem
          :setting-key="k.allowLan"
          :when="!!configs"
        >
          <div class="setting-item-label">{{ $t('allowLan') }}</div>
          <input
            v-model="configs!['allow-lan']"
            class="toggle"
            type="checkbox"
            @change="handlerAllowLanChange"
          />
        </SettingItem>
      </div>
    </template>

    <template v-if="hasVisibleUpgradeSettings">
      <div class="settings-section-label">{{ $t('settingsSectionCoreUpdates') }}</div>
      <div class="settings-grid">
        <SettingItem :setting-key="k.checkCoreUpgrade">
          <div class="setting-item-label">{{ $t('checkCoreUpgrade') }}</div>
          <input
            v-model="checkUpgradeCore"
            class="toggle"
            type="checkbox"
            @change="handlerCheckUpgradeCoreChange"
          />
        </SettingItem>
        <SettingItem
          :setting-key="k.autoUpgradeCore"
          :when="checkUpgradeCore"
          class="settings-dependent-item"
        >
          <div class="setting-item-label">{{ $t('autoUpgradeCore') }}</div>
          <input
            v-model="autoUpgradeCore"
            class="toggle"
            type="checkbox"
          />
        </SettingItem>
      </div>
    </template>

    <template v-if="showDnsQuery">
      <div class="settings-section-label">{{ $t('settingsSectionDiagnostics') }}</div>
      <div class="settings-grid">
        <SettingItem
          :setting-key="k.DNSQuery"
          class="py-3"
        >
          <DnsQuery />
        </SettingItem>
      </div>
    </template>
    <UpdateConfigModal v-model="showConfigEditor" />
  </div>
</template>

<script setup lang="ts">
import { can } from '@/assembly/backend'
import { configs, updateConfigs } from '@/assembly/config'
import { coreBrand, isCoreUpdateAvailable } from '@/assembly/version'
import BackendVersion from '@/components/common/BackendVersion.vue'
import BackendPortsGrid from '@/components/settings/backend/BackendPortsGrid.vue'
import BackendSwitch from '@/components/settings/backend/BackendSwitch.vue'
import DnsQuery from '@/components/settings/backend/DnsQuery.vue'
import SettingItem from '@/components/settings/SettingItem.vue'
import { backendActions } from '@/composables/backendActions'
import { useControlApi } from '@/composables/useControlApi'
import { isSettingVisible, useIsSettingVisible } from '@/composables/settings'
import { BACKEND_ITEM_KEYS } from '@/config/settingsItems'
import { notifyRequestError } from '@/helper/requestError'
import { autoUpgradeCore, checkUpgradeCore } from '@/store/settings'
import { activeBackend } from '@/store/setup'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import UpdateConfigModal from './UpdateConfigModal.vue'

const k = BACKEND_ITEM_KEYS
const showConfigEditor = ref(false)
const runtimeInfo = ref<{
  root: string
  kernel: string
  config: string
  profiles: string
  activeConfig: string
} | null>(null)

onMounted(async () => {
  try {
    runtimeInfo.value = await useControlApi().getRuntimeInfo()
  } catch {
    runtimeInfo.value = null
  }
})

const ensureKernel = async () => {
  try {
    await useControlApi().ensureKernel()
  } catch (error) {
    notifyRequestError(error)
  }
}

const isVisibleBackendSwitch = useIsSettingVisible(k.backend)
const isVisiblePorts = useIsSettingVisible(k.ports)
const isVisibleTunMode = useIsSettingVisible(k.tunMode)
const isVisibleTunConfig = useIsSettingVisible(k.tunConfig)
const isVisibleAllowLan = useIsSettingVisible(k.allowLan)
const isVisibleCheckUpgrade = useIsSettingVisible(k.checkCoreUpgrade)
const isVisibleAutoUpgrade = useIsSettingVisible(k.autoUpgradeCore)
const isVisibleDnsQuery = useIsSettingVisible(k.DNSQuery)
const canShowTunMode = computed(
  () => isVisibleTunMode.value && !activeBackend.value?.disableTunMode,
)

// TUN advanced form (mirrors configs.tun fields)
const tunForm = reactive({
  stack: 'gvisor',
  mtu: 1500,
  device: '',
  autoDetectInterface: true,
  strictRoute: false,
})

watch(
  () => configs.value?.tun,
  (tun) => {
    if (!tun) return
    const t = tun as unknown as Record<string, unknown>
    tunForm.stack = (t.stack as string) ?? 'gvisor'
    tunForm.mtu = (t.mtu as number) ?? 1500
    tunForm.device = (t.device as string) ?? ''
    tunForm.autoDetectInterface = (t['auto-detect-interface'] as boolean) ?? true
    tunForm.strictRoute = (t['strict-route'] as boolean) ?? false
  },
  { immediate: true },
)

const handleTunConfigChange = async () => {
  if (!configs.value?.tun) return
  configs.value.tun = {
    ...configs.value.tun,
    stack: tunForm.stack,
    mtu: tunForm.mtu,
    device: tunForm.device || undefined,
    'auto-detect-interface': tunForm.autoDetectInterface,
    'strict-route': tunForm.strictRoute,
  }
  try {
    await updateConfigs({ tun: configs.value.tun })
  } catch (error) {
    notifyRequestError(error)
  }
}

const hasVisibleActions = computed(() =>
  backendActions.value.some((action) => isSettingVisible(action.key)),
)
const showDnsQuery = isVisibleDnsQuery
const hasVisibleNetworkSettings = computed(
  () =>
    can('configPatch') &&
    !!configs.value &&
    (isVisiblePorts.value ||
      (!!configs.value.tun && canShowTunMode.value) ||
      isVisibleAllowLan.value),
)
const hasVisibleUpgradeSettings = computed(
  () =>
    can('configPatch') &&
    !!configs.value &&
    !activeBackend.value?.disableUpgradeCore &&
    (isVisibleCheckUpgrade.value || (checkUpgradeCore.value && isVisibleAutoUpgrade.value)),
)
const hasVisibleItems = computed(
  () =>
    isVisibleBackendSwitch.value ||
    hasVisibleActions.value ||
    hasVisibleNetworkSettings.value ||
    hasVisibleUpgradeSettings.value ||
    showDnsQuery.value,
)

const handlerCheckUpgradeCoreChange = () => {
  if (!checkUpgradeCore.value) {
    autoUpgradeCore.value = false
    isCoreUpdateAvailable.value = false
  }
}
const hanlderTunModeChange = async () => {
  try {
    await updateConfigs({ tun: { enable: configs.value?.tun.enable } })
  } catch (error) {
    notifyRequestError(error)
  }
}
const handlerAllowLanChange = async () => {
  try {
    await updateConfigs({ ['allow-lan']: configs.value?.['allow-lan'] })
  } catch (error) {
    notifyRequestError(error)
  }
}
</script>
