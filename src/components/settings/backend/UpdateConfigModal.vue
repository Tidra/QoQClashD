<template>
  <!--
    DialogWrapper 会 teleport 到 #app-content,而那正是挂载本组件的 App 根节点 ——
    首帧它还没进 DOM。等挂载完再渲染,与同处 App 根下的 BackendManager 一致。
  -->
  <DialogWrapper
    v-if="isReady"
    v-model="modalValue"
    :title="$t('updateConfigs')"
  >
    <div class="flex flex-col gap-4 p-2">
      <!-- 输入模式切换 -->
      <SegmentedControl
        v-model="inputMode"
        :options="inputModeOptions"
        :class="{ 'flex-1': '' }"
      />

      <!-- ===== 表单模式 ===== -->
      <div
        v-if="inputMode === 'form'"
        class="flex flex-col gap-3"
      >
        <div class="flex flex-col gap-2">
          <label class="text-sm">{{ $t('configFilePath') }}</label>
          <input
            v-model="configPath"
            class="input input-bordered input-sm w-full"
            type="text"
            :placeholder="$t('configFilePathPlaceholder')"
          />
        </div>

        <!-- 端口设置 -->
        <div class="grid grid-cols-2 gap-2">
          <div class="flex flex-col gap-1">
            <span class="text-base-content/60 text-xs">Port</span>
            <input
              v-model.number="formConfig.port"
              class="input input-bordered input-sm"
              type="number"
              min="0"
            />
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-base-content/60 text-xs">Socks Port</span>
            <input
              v-model.number="formConfig['socks-port']"
              class="input input-bordered input-sm"
              type="number"
              min="0"
            />
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-base-content/60 text-xs">Redir Port</span>
            <input
              v-model.number="formConfig['redir-port']"
              class="input input-bordered input-sm"
              type="number"
              min="0"
            />
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-base-content/60 text-xs">Mixed Port</span>
            <input
              v-model.number="formConfig['mixed-port']"
              class="input input-bordered input-sm"
              type="number"
              min="0"
            />
          </div>
        </div>

        <!-- 高级设置 -->
        <div class="grid grid-cols-2 gap-2">
          <div class="flex flex-col gap-1">
            <span class="text-base-content/60 text-xs">Bind Address</span>
            <input
              v-model="formConfig['bind-address']"
              class="input input-bordered input-sm"
              type="text"
            />
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-base-content/60 text-xs">Log Level</span>
            <select
              v-model="formConfig['log-level']"
              class="select select-bordered select-sm"
            >
              <option value="debug">debug</option>
              <option value="info">info</option>
              <option value="warning">warning</option>
              <option value="error">error</option>
              <option value="silent">silent</option>
            </select>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label class="flex items-center gap-2 text-sm">
            <input
              v-model="formConfig['allow-lan']"
              type="checkbox"
              class="checkbox"
            />
            <span>{{ $t('allowLan') }}</span>
          </label>
          <label class="flex items-center gap-2 text-sm">
            <input
              v-model="formConfig.ipv6"
              type="checkbox"
              class="checkbox"
            />
            <span>IPv6</span>
          </label>
        </div>

        <!-- TUN 配置 -->
        <div
          v-if="formConfig.tun"
          class="border-base-300 bg-base-100 rounded-xl border p-3"
        >
          <label class="flex items-center gap-2 text-sm font-medium">
            <input
              v-model="formConfig.tun.enable"
              type="checkbox"
              class="checkbox"
            />
            <span>{{ $t('tunMode') }}</span>
          </label>

          <div
            v-if="formConfig.tun.enable"
            class="mt-3 flex flex-col gap-3"
          >
            <div class="grid grid-cols-2 gap-2">
              <div class="flex flex-col gap-1">
                <span class="text-base-content/60 text-xs">{{ $t('tunStack') }}</span>
                <select
                  v-model="formConfig.tun.stack"
                  class="select select-bordered select-sm"
                >
                  <option value="gvisor">gvisor</option>
                  <option value="system">system</option>
                  <option value="mixed">mixed</option>
                </select>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-base-content/60 text-xs">{{ $t('tunMtu') }}</span>
                <input
                  v-model.number="formConfig.tun.mtu"
                  class="input input-bordered input-sm"
                  type="number"
                  min="1280"
                  max="9000"
                />
              </div>
            </div>

            <div class="flex flex-col gap-1">
              <span class="text-base-content/60 text-xs">{{ $t('tunDevice') }}</span>
              <input
                v-model="formConfig.tun.device"
                class="input input-bordered input-sm"
                type="text"
                :placeholder="$t('tunDevice')"
              />
            </div>

            <div class="flex flex-col gap-2">
              <label class="flex items-center gap-2 text-sm">
                <input
                  v-model="formConfig.tun['auto-detect-interface']"
                  type="checkbox"
                  class="checkbox"
                />
                <span>{{ $t('tunAutoDetectInterface') }}</span>
              </label>
              <label class="flex items-center gap-2 text-sm">
                <input
                  v-model="formConfig.tun['strict-route']"
                  type="checkbox"
                  class="checkbox"
                />
                <span>{{ $t('tunStrictRoute') }}</span>
              </label>
            </div>
          </div>
        </div>

        <!-- 生成 YAML 预览 -->
        <div class="flex items-center gap-2">
          <button
            class="btn btn-ghost btn-sm"
            type="button"
            @click="syncFormToYaml"
          >
            <ArrowDownTrayIcon class="h-3.5 w-3.5" />
            {{ $t('dualModeSyncToYaml') }}
          </button>
          <span class="text-base-content/50 text-xs">{{ $t('dualModeConfig') }}</span>
        </div>
      </div>

      <!-- ===== YAML 模式 ===== -->
      <div
        v-else
        class="flex flex-col gap-2"
      >
        <div class="flex flex-col gap-2">
          <label class="text-sm">{{ $t('configFilePath') }}</label>
          <input
            v-model="configPath"
            class="input input-bordered input-sm w-full"
            type="text"
            :placeholder="$t('configFilePathPlaceholder')"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-sm">{{ $t('configPayload') }}</label>
          <textarea
            v-model="configPayload"
            rows="12"
            class="textarea textarea-bordered w-full font-mono text-xs"
            :placeholder="$t('configPayloadPlaceholder')"
          ></textarea>
        </div>

        <button
          class="btn btn-ghost btn-sm self-start"
          type="button"
          @click="syncYamlToForm"
        >
          <ArrowDownTrayIcon class="h-3.5 w-3.5" />
          {{ $t('dualModeSyncToForm') }}
        </button>
      </div>

      <!-- 公共提交区 -->
      <div class="divider my-0"></div>

      <div class="flex items-center gap-3">
        <label class="label cursor-pointer gap-2">
          <span class="text-sm">{{ $t('forceUpdate') }}</span>
          <input
            v-model="forceUpdate"
            class="toggle"
            type="checkbox"
          />
        </label>

        <button
          class="btn btn-primary btn-sm"
          :disabled="isUpdating || (!configPath && !configPayload)"
          @click="handleUpdateConfigs"
        >
          <span
            v-if="isUpdating"
            class="loading loading-spinner loading-md"
          ></span>
          {{ $t('updateConfigs') }}
        </button>
      </div>
    </div>
  </DialogWrapper>
</template>

<script setup lang="ts">
import { fetchConfigs, updateConfigsAPI } from '@/assembly/config'
import { fetchProxies } from '@/assembly/proxies'
import { fetchRules } from '@/assembly/rules'
import { notifyActionPending, showNotification } from '@/helper/notification'
import { notifyRequestError } from '@/helper/requestError'
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowDownTrayIcon } from '@heroicons/vue/24/outline'
import DialogWrapper from '../../common/DialogWrapper.vue'
import SegmentedControl from '../../common/SegmentedControl.vue'

type InputMode = 'form' | 'yaml'

const modalValue = defineModel<boolean>()
const { t } = useI18n()

const isReady = ref(false)
onMounted(() => {
  isReady.value = true
})

const configPath = ref('')
const configPayload = ref('')
const forceUpdate = ref(false)
const isUpdating = ref(false)
const inputMode = ref<InputMode>('yaml')

const inputModeOptions = computed(() => [
  { value: 'yaml' as InputMode, label: t('dualModeYaml') },
  { value: 'form' as InputMode, label: t('dualModeForm') },
])

// 表单模式的结构化 Config
const formConfig = reactive({
  port: 7890,
  'socks-port': 7891,
  'redir-port': 7892,
  'mixed-port': 7893,
  'allow-lan': false,
  'bind-address': '::',
  'log-level': 'info',
  ipv6: false,
  tun: {
    enable: false,
    stack: 'gvisor',
    mtu: 1500,
    device: '',
    'auto-detect-interface': true,
    'strict-route': false,
  } as {
    enable: boolean
    stack?: string
    dns?: boolean
    autoDns?: boolean
    mtu?: number
    'auto-detect-interface'?: boolean
    device?: string
    'strict-route'?: boolean
  },
})

// 表单 → YAML 文本
function buildYamlFromForm(): string {
  const obj: Record<string, unknown> = { ...formConfig }
  const tun = obj.tun as { enable?: boolean } | undefined
  if (tun && !tun.enable) {
    obj.tun = { enable: false }
  }
  return serializeYaml(obj)
}

function serializeYaml(obj: Record<string, unknown>, indent = 0): string {
  const pad = '  '.repeat(indent)
  const lines: string[] = []
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null) continue
    if (typeof value === 'object' && !Array.isArray(value)) {
      const nested = value as Record<string, unknown>
      lines.push(`${pad}${key}:`)
      lines.push(serializeYaml(nested, indent + 1))
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        lines.push(`${pad}${key}: []`)
      } else {
        lines.push(`${pad}${key}:`)
        value.forEach((item) => {
          lines.push(`${pad}  - ${JSON.stringify(item)}`)
        })
      }
    } else if (typeof value === 'string') {
      lines.push(`${pad}${key}: ${JSON.stringify(value)}`)
    } else {
      lines.push(`${pad}${key}: ${value}`)
    }
  }
  return lines.filter(Boolean).join('\n')
}

// 表单 → YAML 同步
const syncFormToYaml = () => {
  configPayload.value = buildYamlFromForm()
  showNotification({ content: 'updateConfigsSuccess', type: 'alert-info', timeout: 2000 })
}

// 简易 YAML → 表单 解析（仅处理顶层和 tun 嵌套）
const syncYamlToForm = () => {
  try {
    const lines = configPayload.value.split('\n')
    let inTun = false
    let tunIndent = 0

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue

      // 检测 tun 块
      if (trimmed === 'tun:') {
        inTun = true
        tunIndent = line.length - line.trimStart().length
        formConfig.tun.enable = false
        continue
      }

      if (inTun) {
        const curIndent = line.length - line.trimStart().length
        if (curIndent > tunIndent) {
          const match = trimmed.match(/^(\S+):\s*(.*)$/)
          if (match) {
            const [, key, val] = match
            ;(formConfig.tun as Record<string, unknown>)[key] = parseYamlValue(val)
          }
        } else {
          inTun = false
        }
      }

      // 顶层字段
      if (!inTun) {
        const match = trimmed.match(/^(\S+):\s*(.*)$/)
        if (match) {
          const [, key, val] = match
          if (key in formConfig && key !== 'tun') {
            ;(formConfig as Record<string, unknown>)[key] = parseYamlValue(val)
          }
        }
      }
    }
    showNotification({ content: 'updateConfigsSuccess', type: 'alert-info', timeout: 2000 })
  } catch {
    showNotification({ content: 'updateConfigs', type: 'alert-error' })
  }
}

function parseYamlValue(raw: string): string | number | boolean {
  const val = raw.trim().replace(/^["']|["']$/g, '')
  if (val === 'true') return true
  if (val === 'false') return false
  if (/^-?\d+$/.test(val)) return parseInt(val, 10)
  return val
}

const reloadAll = () => {
  fetchConfigs()
  fetchRules()
  fetchProxies()
}

const handleUpdateConfigs = async () => {
  if (isUpdating.value) return
  isUpdating.value = true
  const notifyKey = notifyActionPending('updateConfigs')
  try {
    // 表单模式下，把表单序列化为 YAML 传给后端
    const payload = inputMode.value === 'form' ? buildYamlFromForm() : configPayload.value
    await updateConfigsAPI({ path: configPath.value, payload }, forceUpdate.value)
    reloadAll()
    modalValue.value = false
    showNotification({
      key: notifyKey,
      content: 'updateConfigsSuccess',
      type: 'alert-success',
    })
  } catch (e) {
    notifyRequestError(e, notifyKey)
  } finally {
    isUpdating.value = false
  }
}
</script>
