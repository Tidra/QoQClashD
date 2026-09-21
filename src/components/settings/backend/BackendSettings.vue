<template>
  <div class="text-sm">
    <!-- 内核管理：单一入口。标题行样式沿用原样，状态/PID 移到行尾；其余全部为左标签右控件行。 -->
    <div class="settings-section-label">
      {{ $t('settingsSectionKernelManager') }}
    </div>
    <div class="base-container mb-4 flex flex-col">
      <div class="flex items-center gap-2 px-4 pt-3 pb-1">
        <div class="indicator">
          <span
            v-if="isCoreUpdateAvailable"
            class="indicator-item top-1 -right-1 flex"
          >
            <span class="bg-secondary absolute h-2 w-2 animate-ping rounded-full"></span>
            <span class="bg-secondary h-2 w-2 rounded-full"></span>
          </span>
          <a
            href="https://github.com/metacubex/mihomo"
            target="_blank"
            class="text-xl font-semibold"
          >
            mihomo
            <span class="text-sm font-normal opacity-50">
              {{ kernelVersionLabel }}
            </span>
          </a>
        </div>
        <div class="ml-auto flex items-center gap-2">
          <span
            v-if="kernelState.pid"
            class="badge badge-ghost badge-sm font-mono font-normal"
            >pid {{ kernelState.pid }}</span
          >
          <span :class="['badge badge-sm', kernelStatusBadgeClass]">{{ kernelState.status }}</span>
        </div>
      </div>

      <template v-if="runtimeInfo">
        <div class="setting-item">
          <div class="setting-item-label">{{ $t('runtimeControl') }}</div>
          <div class="flex gap-2">
            <button
              class="btn btn-sm btn-primary"
              :disabled="kernelBusy || !canStartKernel"
              @click="startOrRestartKernelAction"
            >
              {{
                kernelState.status === 'running' ? t('kernelRestartAction') : t('kernelStartAction')
              }}
            </button>
            <button
              class="btn btn-sm btn-error"
              :disabled="kernelBusy || kernelState.status !== 'running'"
              @click="stopKernelAction"
            >
              {{ $t('kernelStopAction') }}
            </button>
          </div>
        </div>

        <!-- Clash API 端口与密码由 agent 写进 active.yaml 的托管头，只在下次启动生效；
             密码同时是面板登录密码（一处改，两端同步）。 -->
        <div class="setting-item">
          <div class="setting-item-label">
            {{ $t('kernelApiPortLabel') }}
            <div class="setting-item-summary">
              {{ $t('kernelApiPortSummary') }}
            </div>
          </div>
          <input
            v-model="kernelApiPortInput"
            type="text"
            inputmode="numeric"
            spellcheck="false"
            class="input input-bordered input-sm w-24 font-mono"
          />
        </div>
        <div
          v-if="kernelApiDirty"
          class="setting-item"
        >
          <div class="setting-item-label"></div>
          <button
            class="btn btn-sm btn-primary"
            :disabled="kernelBusy"
            @click="saveKernelApi"
          >
            {{ $t('saveKernelApi') }}
          </button>
        </div>

        <!-- 密码只存在 agent 侧，浏览器既不回显也不比对：旧密码对不对由服务端说了算。 -->
        <div class="setting-item">
          <div class="setting-item-label">
            {{ $t('kernelSharedSecretLabel') }}
            <div class="setting-item-summary">
              {{ $t('kernelSharedSecretSummary') }}
            </div>
          </div>
          <button
            v-if="!passwordFormOpen"
            class="btn btn-sm btn-primary"
            :disabled="kernelBusy"
            @click="openPasswordForm"
          >
            {{ $t('kernelPasswordChange') }}
          </button>
        </div>
        <template v-if="passwordFormOpen">
          <div class="setting-item">
            <div class="setting-item-label">{{ $t('panelPasswordCurrent') }}</div>
            <input
              v-model="oldPasswordInput"
              type="password"
              autocomplete="current-password"
              class="input input-bordered input-sm w-72 max-w-[55%]"
            />
          </div>
          <div class="setting-item">
            <div class="setting-item-label">{{ $t('panelPasswordNew') }}</div>
            <input
              v-model="newPasswordInput"
              type="password"
              autocomplete="new-password"
              class="input input-bordered input-sm w-72 max-w-[55%]"
            />
          </div>
          <div class="setting-item">
            <div class="setting-item-label">{{ $t('panelPasswordConfirm') }}</div>
            <input
              v-model="confirmPasswordInput"
              type="password"
              autocomplete="new-password"
              :placeholder="$t('panelPasswordConfirmPlaceholder')"
              class="input input-bordered input-sm w-72 max-w-[55%]"
            />
          </div>
          <div class="setting-item">
            <div class="setting-item-label"></div>
            <div class="flex items-center gap-2">
              <button
                class="btn btn-sm btn-primary"
                :disabled="kernelBusy"
                @click="savePanelPassword"
              >
                {{ $t('save') }}
              </button>
              <button
                class="btn btn-sm btn-ghost"
                @click="closePasswordForm"
              >
                {{ $t('cancel') }}
              </button>
              <span
                v-if="passwordMismatch"
                class="text-error text-xs"
              >
                {{ $t('panelPasswordMismatch') }}
              </span>
            </div>
          </div>
        </template>

        <div class="setting-item">
          <div class="setting-item-label">{{ $t('kernelDownloadRepo') }}</div>
          <SelectInput
            v-model="kernelMirror"
            :options="mirrorOptions"
            class="select select-bordered select-sm w-40"
          />
        </div>
        <div class="setting-item">
          <div class="setting-item-label">{{ $t('kernelVersionLabel') }}</div>
          <div class="flex items-center gap-2">
            <SelectInput
              v-model="kernelVersion"
              :options="versionOptions"
              searchable
              class="select select-bordered select-sm w-56"
            />
            <button
              class="btn btn-sm btn-primary"
              :disabled="kernelBusy || kernelDownloadMode === 'uptodate'"
              @click="downloadKernel"
            >
              <span
                v-if="downloadingKernel"
                class="loading loading-spinner h-4 w-4"
              ></span>
              <span v-else>{{ $t(kernelDownloadLabel) }}</span>
            </button>
          </div>
        </div>

        <!-- 原「内核更新」分区并入本卡：与其他行同一起跑线，不做缩进 -->
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
        >
          <div class="setting-item-label">{{ $t('autoUpgradeCore') }}</div>
          <input
            v-model="autoUpgradeCore"
            class="toggle"
            type="checkbox"
          />
        </SettingItem>

        <div class="setting-item">
          <div class="setting-item-label">
            {{ $t('kernelStoragePath') }}
            <div class="setting-item-summary">
              {{ $t('kernelDirSummary') }}
            </div>
          </div>
          <input
            v-model="kernelDirInput"
            type="text"
            class="input input-bordered input-sm w-72 max-w-[55%] font-mono"
            spellcheck="false"
          />
        </div>
        <div class="setting-item">
          <div class="setting-item-label">
            {{ $t('configDirLabel') }}
            <div class="setting-item-summary">
              {{ $t('configDirSummary') }}
            </div>
          </div>
          <input
            v-model="configDirInput"
            type="text"
            class="input input-bordered input-sm w-72 max-w-[55%] font-mono"
            spellcheck="false"
          />
        </div>
        <div
          v-if="pathsDirty"
          class="setting-item"
        >
          <div class="setting-item-label"></div>
          <button
            class="btn btn-sm btn-primary"
            :disabled="kernelBusy"
            @click="saveRuntimePaths"
          >
            {{ $t('savePaths') }}
          </button>
        </div>

        <!-- 派生路径只读：弱底色 + 锁标 -->
        <div class="setting-item bg-base-200/40">
          <div class="setting-item-label flex items-center gap-1.5 opacity-70">
            <LockClosedIcon class="h-3.5 w-3.5 opacity-40" />
            {{ $t('runtimeRoot') }}
          </div>
          <span class="text-base-content/60 min-w-0 truncate font-mono text-xs">{{
            runtimeInfo.root
          }}</span>
        </div>
        <div class="setting-item bg-base-200/40">
          <div class="setting-item-label flex items-center gap-1.5 opacity-70">
            <LockClosedIcon class="h-3.5 w-3.5 opacity-40" />
            {{ $t('activeConfigLabel') }}
          </div>
          <span class="text-base-content/60 min-w-0 truncate font-mono text-xs">{{
            runtimeInfo.activeConfig
          }}</span>
        </div>
      </template>
      <div
        v-else
        class="setting-item text-base-content/60 text-xs"
      >
        {{ $t('controlServiceDisconnected') }}
      </div>
    </div>

    <template v-if="hasVisibleActions">
      <div class="settings-section-label">{{ $t('settingsSectionCoreOperations') }}</div>
      <div class="settings-grid">
        <!-- 重载配置独占一行：查看（只读 YAML 弹窗）+ 彩色刷新（应用面板草稿并下发内核）。
             内核没起来时此行仍在，只是刷新禁用 —— 查看不依赖内核，行也不该跟着连接状态闪进闪出。 -->
        <SettingItem :setting-key="k.reloadConfigs">
          <div class="setting-item-label">
            {{ $t('reloadConfigs') }}
            <div class="setting-item-summary">
              {{ $t('reloadConfigsSummary') }}
            </div>
          </div>
          <!-- shrink-0：daisyUI 的 .btn 自带 flex-shrink:0，控件容器不收缩时
               长标签会把整组按钮挤出内容区、贴到卡片边缘。 -->
          <div class="flex shrink-0 items-center gap-2">
            <button
              class="btn btn-sm btn-ghost"
              @click="showYamlViewer = true"
            >
              {{ $t('viewAction') }}
            </button>
            <button
              class="btn btn-sm relative min-w-11"
              :disabled="applyingConfig"
              :title="$t('applyConfigSummary')"
              :aria-label="$t('applyConfig')"
              @click="applyDraftConfig"
            >
              <span
                v-if="applyingConfig"
                class="loading loading-spinner h-4 w-4"
              ></span>
              <ArrowPathIcon
                v-else
                class="h-4 w-4"
              />
              <!-- 角标样式对齐内核标题的更新提醒点（ping 圈 + 实心点），颜色保持红。 -->
              <span
                v-if="pendingConfigChanges && !applyingConfig"
                class="absolute -top-1 -right-1 flex"
              >
                <span class="bg-error absolute h-2 w-2 animate-ping rounded-full"></span>
                <span class="bg-error h-2 w-2 rounded-full"></span>
              </span>
            </button>
          </div>
        </SettingItem>
        <SettingItem
          v-for="action in coreOperations"
          :key="action.key"
          :setting-key="action.key"
        >
          <div class="setting-item-label">{{ $t(action.label) }}</div>
          <button
            class="btn btn-sm min-w-11"
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
    <ConfigYamlModal v-model="showYamlViewer" />
  </div>
</template>

<script setup lang="ts">
import { stopKernelSession } from '@/assembly/session'
import { isCoreUpdateAvailable } from '@/assembly/version'
import SelectInput from '@/components/common/SelectInput.vue'
import type { SelectOption } from '@/components/common/SelectInput.vue'
import DnsQuery from '@/components/settings/backend/DnsQuery.vue'
import SettingItem from '@/components/settings/SettingItem.vue'
import { backendActions } from '@/composables/backendActions'
import { useControlApi } from '@/composables/useControlApi'
import { isSettingVisible, useIsSettingVisible } from '@/composables/settings'
import {
  restartKernelAndReconnect,
  restartKernelForSecret,
  startKernelAndReconnect,
} from '@/composables/useKernelBackend'
import { BACKEND_ITEM_KEYS } from '@/config/settingsItems'
import { applyDraftConfig, applyingConfig, pendingConfigChanges } from '@/helper/applyConfig'
import { changePanelPassword } from '@/helper/panelSession'
import { notifyRequestError } from '@/helper/requestError'
import { showNotification } from '@/helper/notification'
import { useStorage } from '@/helper/storage'
import { autoUpgradeCore, checkUpgradeCore } from '@/store/settings'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowPathIcon, LockClosedIcon } from '@heroicons/vue/24/outline'
import ConfigYamlModal from './ConfigYamlModal.vue'

const { t } = useI18n()
const k = BACKEND_ITEM_KEYS
const showYamlViewer = ref(false)
const controlApi = useControlApi()

const runtimeInfo = ref<{
  root: string
  kernel: string
  config: string
  profiles: string
  activeConfig: string
} | null>(null)

// ── 内核管理（agent 控制 API，无需已连接核心） ─────────────────────
type KernelStateView = {
  status: 'stopped' | 'starting' | 'running' | 'stopping' | 'errored'
  pid?: number
  version?: string
  binaryExists?: boolean
  installedVersion?: string
  externalController: string
}
const kernelState = ref<KernelStateView>({ status: 'stopped', externalController: '' })
const releases = ref<{ versions: string[]; mirrors: string[] }>({ versions: [], mirrors: [] })
const pinnedVersion = ref('')
const downloadingKernel = ref(false)
const lifecycleBusy = ref(false)
const savingPaths = ref(false)
const savingKernelApi = ref(false)
const savingPassword = ref(false)
const kernelBusy = computed(
  () =>
    downloadingKernel.value ||
    lifecycleBusy.value ||
    savingPaths.value ||
    savingKernelApi.value ||
    savingPassword.value,
)
const kernelMirror = useStorage<string>('config/kernel-mirror', 'direct')
const kernelVersion = useStorage<string>('config/kernel-version', '')

// agent 不可达 / releases 拉取失败时的兜底仓库列表（与 KERNEL_MIRRORS 键一致）
const FALLBACK_MIRRORS = ['direct', 'gh-proxy', 'ghfast', 'ghproxy']

const kernelVersionLabel = computed(
  () => kernelState.value.version || kernelState.value.installedVersion || pinnedVersion.value,
)

const kernelStatusBadgeClass = computed(
  () =>
    ({
      running: 'badge-success',
      starting: 'badge-warning',
      stopping: 'badge-warning',
      errored: 'badge-error',
      stopped: 'badge-ghost',
    })[kernelState.value.status],
)

// 三态下载按钮：无二进制 → 下载；有二进制且目标版本已装 → 已是最新（禁用）；否则 → 更新。
const kernelDownloadMode = computed(() => {
  if (!kernelState.value.binaryExists) return 'download'
  const target = kernelVersion.value || pinnedVersion.value
  if (kernelState.value.installedVersion && kernelState.value.installedVersion === target) {
    return 'uptodate'
  }
  return 'update'
})
const kernelDownloadLabel = computed(
  () =>
    ({ download: 'kernelDownload', update: 'kernelUpdate', uptodate: 'kernelUpToDate' })[
      kernelDownloadMode.value
    ],
)
const canStartKernel = computed(() => !!kernelState.value.binaryExists)

const mirrorOptions = computed<SelectOption<string>[]>(() => {
  const list = releases.value.mirrors.length ? releases.value.mirrors : FALLBACK_MIRRORS
  const options = list.map((value) => ({ value, label: value }))
  if (!options.some((option) => option.value === kernelMirror.value)) {
    options.unshift({ value: kernelMirror.value, label: kernelMirror.value })
  }
  return options
})

const versionOptions = computed<SelectOption<string>[]>(() => {
  const defaultLabel = pinnedVersion.value
    ? `${t('kernelDefaultVersion')} (${pinnedVersion.value})`
    : t('kernelDefaultVersion')
  const options: SelectOption<string>[] = [{ value: '', label: defaultLabel }]
  options.push(...releases.value.versions.map((value) => ({ value, label: value })))
  if (kernelVersion.value && !releases.value.versions.includes(kernelVersion.value)) {
    options.splice(1, 0, { value: kernelVersion.value, label: kernelVersion.value })
  }
  return options
})

// ── Clash API 端口 + 面板/内核共用密码 ─────────────────────────────
// 状态每 5s 轮询一次，输入框不能被轮询覆盖，所以只在「用户没有未保存改动」时
// 才把最新值回填进去（输入仍等于基线 = 无改动）。
const kernelApiBaselinePort = ref('')
const kernelApiPortInput = ref('')

const portOfController = (address: string) => {
  if (!address) return ''
  const raw = address.startsWith('http') ? new URL(address).host : address
  return raw.slice(raw.lastIndexOf(':') + 1)
}

const syncKernelApiFields = (state: KernelStateView) => {
  const port = portOfController(state.externalController)
  if (!port || kernelApiPortInput.value !== kernelApiBaselinePort.value) return
  kernelApiBaselinePort.value = port
  kernelApiPortInput.value = port
}

const kernelApiDirty = computed(() => kernelApiPortInput.value !== kernelApiBaselinePort.value)

/** 下发一次 Clash API 端口改动；成功返回 true。内核在跑就顺手重启，托管头才会写进 active.yaml。 */
const applyKernelApi = async (body: { port: number }, savedKey: string): Promise<boolean> => {
  savingKernelApi.value = true
  try {
    const result = await controlApi.updateKernelApi(body)
    if (!result.ok) {
      showNotification({
        content: result.error || 'kernelApiSaveFailed',
        type: 'alert-error',
      })
      return false
    }
    // 保存成功：新值即新基线。不写回的话输入框永远停在「与基线不符」，保存行会一直挂着。
    const port = portOfController(result.externalController ?? '') || String(body.port)
    kernelApiBaselinePort.value = port
    kernelApiPortInput.value = port
    showNotification({ content: savedKey, type: 'alert-success' })
    if (result.requiresRestart && !(await restartKernelAndReconnect())) {
      showNotification({ content: 'kernelStartFailed', type: 'alert-error' })
    }
    return true
  } catch (error) {
    notifyRequestError(error)
    return false
  } finally {
    savingKernelApi.value = false
    await refreshKernelState()
  }
}

const saveKernelApi = async () => {
  if (kernelBusy.value) return
  const portText = kernelApiPortInput.value.trim()
  const port = Number(portText)
  if (!/^\d+$/.test(portText) || !Number.isInteger(port) || port < 1 || port > 65535) {
    showNotification({ content: 'kernelApiPortInvalid', type: 'alert-error' })
    return
  }
  if (portText === kernelApiBaselinePort.value) return
  await applyKernelApi({ port }, 'kernelApiSaved')
}

// ── 修改面板/内核共用密码：旧密码本地比对 + 新密码输入两次 ──────────
const passwordFormOpen = ref(false)
const oldPasswordInput = ref('')
const newPasswordInput = ref('')
const confirmPasswordInput = ref('')

const openPasswordForm = () => {
  oldPasswordInput.value = ''
  newPasswordInput.value = ''
  confirmPasswordInput.value = ''
  passwordFormOpen.value = true
}

const closePasswordForm = () => {
  passwordFormOpen.value = false
}

const passwordMismatch = computed(
  () =>
    !!newPasswordInput.value.trim() &&
    newPasswordInput.value.trim() !== confirmPasswordInput.value.trim(),
)

const savePanelPassword = async () => {
  if (kernelBusy.value) return
  const next = newPasswordInput.value.trim()
  if (!next) {
    showNotification({ content: 'kernelApiSecretRequired', type: 'alert-error' })
    return
  }
  if (passwordMismatch.value) {
    showNotification({ content: 'panelPasswordMismatch', type: 'alert-error' })
    return
  }
  savingPassword.value = true
  try {
    // 旧密码由 agent 比对：浏览器从没拿过它，本地比对无从谈起。
    const result = await changePanelPassword(oldPasswordInput.value.trim(), next)
    if (!result.ok) {
      showNotification({ content: 'panelAuthMismatch', type: 'alert-error' })
      return
    }
    showNotification({ content: 'kernelPasswordSaved', type: 'alert-success' })
    closePasswordForm()
    // 这个密码同时是内核的 Clash API secret，内核在跑时不重启就是拿新密码敲旧锁。
    if (result.requiresRestart) await restartKernelForSecret()
  } catch (error) {
    notifyRequestError(error)
  } finally {
    savingPassword.value = false
    await refreshKernelState()
  }
}

const refreshKernelState = async () => {
  try {
    kernelState.value = await controlApi.getKernelStatus()
    syncKernelApiFields(kernelState.value)
  } catch {
    // 控制服务不可达时保留上次状态，仅路径区显示断连提示
  }
}
let kernelPollTimer: ReturnType<typeof setInterval> | undefined

const loadRuntimeInfo = async () => {
  try {
    runtimeInfo.value = await controlApi.getRuntimeInfo()
    kernelDirInput.value = runtimeInfo.value.kernel
    configDirInput.value = runtimeInfo.value.config
  } catch {
    runtimeInfo.value = null
  }
}

// 内核存放路径 / 配置目录可编辑；运行目录与当前配置只读（由它们派生）。
const kernelDirInput = ref('')
const configDirInput = ref('')
const pathsDirty = computed(() => {
  if (!runtimeInfo.value) return false
  return (
    kernelDirInput.value.trim() !== runtimeInfo.value.kernel ||
    configDirInput.value.trim() !== runtimeInfo.value.config
  )
})

const saveRuntimePaths = async () => {
  if (!runtimeInfo.value || !pathsDirty.value || kernelBusy.value) return
  savingPaths.value = true
  try {
    const body: { kernelDir?: string; configDir?: string } = {}
    if (kernelDirInput.value.trim() !== runtimeInfo.value.kernel) {
      body.kernelDir = kernelDirInput.value.trim()
    }
    if (configDirInput.value.trim() !== runtimeInfo.value.config) {
      body.configDir = configDirInput.value.trim()
    }
    const result = await controlApi.setRuntimePaths(body)
    if (!result.ok) {
      showNotification({ content: result.error || 'kernelPathFailed', type: 'alert-error' })
    } else {
      showNotification({ content: 'kernelPathSaved', type: 'alert-success' })
    }
  } catch (error) {
    notifyRequestError(error)
  } finally {
    savingPaths.value = false
    await Promise.all([loadRuntimeInfo(), refreshKernelState()])
  }
}

const downloadKernel = async () => {
  downloadingKernel.value = true
  try {
    const result = await controlApi.ensureKernel({
      mirror: kernelMirror.value,
      version: kernelVersion.value || undefined,
      // 已是最新时按钮禁用；这里只会是首次下载或真正的更新。
      force: kernelDownloadMode.value === 'update',
    })
    if (result.ok) {
      showNotification({ content: 'kernelDownloadSuccess', type: 'alert-success' })
    } else {
      showNotification({
        content: result.error || 'kernelDownloadFailed',
        type: 'alert-error',
      })
    }
  } catch (error) {
    notifyRequestError(error)
  } finally {
    downloadingKernel.value = false
    await Promise.all([refreshKernelState(), loadRuntimeInfo()])
  }
}

const runKernelLifecycle = async (action: () => Promise<unknown>) => {
  if (lifecycleBusy.value) return
  lifecycleBusy.value = true
  try {
    await action()
  } catch (error) {
    notifyRequestError(error)
  } finally {
    lifecycleBusy.value = false
    await refreshKernelState()
  }
}

// 单按钮语义：running → 重启；否则（stopped/errored）→ 启动。
// 起来后不等用户手动刷新：等到 running 就立刻重建会话接上。
const startOrRestartKernelAction = () =>
  runKernelLifecycle(async () => {
    const reconnected =
      kernelState.value.status === 'running'
        ? await restartKernelAndReconnect()
        : await startKernelAndReconnect()
    if (!reconnected) {
      showNotification({ content: 'kernelStartFailed', type: 'alert-error' })
    }
  })
// 停完就地结束会话：三条常驻流对着死端口只会无限重连，能力表也得退回空态，
// 否则面板会继续显示上一轮内核的版本与「正常」。
const stopKernelAction = () =>
  runKernelLifecycle(async () => {
    await controlApi.stopKernel()
    stopKernelSession()
  })

onMounted(async () => {
  // 内核状态不只会被本页的操作改变（连接失败弹窗里也能启动），轮询到 running/stopped
  // 变化才能让本页的徽章、按钮语义跟真实状态对上，而不是停在挂载那一刻的快照。
  // 定时器必须在第一个 await 之前注册：onBeforeUnmount 只会跑一次，加载中就切走
  // 的话，await 之后再 setInterval 将永远没人清理。
  kernelPollTimer = setInterval(refreshKernelState, 5000)
  await loadRuntimeInfo()
  refreshKernelState()
  try {
    const info = await controlApi.getInfo()
    pinnedVersion.value = info.kernel?.version ?? ''
  } catch {
    // ignore: 默认版本标签退化为纯文案
  }
  try {
    const result = await controlApi.getKernelReleases()
    releases.value = { versions: result.versions, mirrors: result.mirrors }
  } catch {
    // ignore: 保留兜底仓库与仅默认版本的可选项
  }
})
onBeforeUnmount(() => clearInterval(kernelPollTimer))

const isVisibleDnsQuery = useIsSettingVisible(k.DNSQuery)

// 升级/重启内核与检查更新等已在上方内核管理卡里给出；网络监听（端口/TUN/allow-lan）
// 已整体移到分流中心「入口」的主入口，更新配置入口也移除（配置编辑在节点页/分流中心进行），
// 设置页运维区只留重载配置一行特殊布局 + 其余图标动作。
const kernelCardKeys = new Set([k.upgradeCore, k.restartCore])
const coreOperations = computed(() =>
  backendActions.value.filter(
    (action) => !kernelCardKeys.has(action.key) && action.key !== k.reloadConfigs,
  ),
)
const hasVisibleActions = computed(
  () =>
    isSettingVisible(k.reloadConfigs) ||
    coreOperations.value.some((action) => isSettingVisible(action.key)),
)
const showDnsQuery = isVisibleDnsQuery
const handlerCheckUpgradeCoreChange = () => {
  if (!checkUpgradeCore.value) {
    autoUpgradeCore.value = false
    isCoreUpdateAvailable.value = false
  }
}
</script>
