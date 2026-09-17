<template>
  <div class="base-container p-4">
    <div class="flex flex-col gap-4">
      <!-- ===== 入站端口 ===== -->
      <section class="flex flex-col gap-2">
        <h3 class="text-sm font-semibold text-base-content/70">{{ $t('ports') }}</h3>
        <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <div class="flex flex-col gap-1">
            <label class="text-xs text-base-content/60" for="inb-port">{{ $t('port') }}</label>
            <input
              id="inb-port"
              v-model.number="form.port"
              class="input input-bordered input-sm w-full text-center"
              type="number"
              min="0"
              max="65535"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs text-base-content/60" for="inb-socks-port">{{ $t('socksPort') }}</label>
            <input
              id="inb-socks-port"
              v-model.number="form['socks-port']"
              class="input input-bordered input-sm w-full text-center"
              type="number"
              min="0"
              max="65535"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs text-base-content/60" for="inb-redir-port">{{ $t('redirPort') }}</label>
            <input
              id="inb-redir-port"
              v-model.number="form['redir-port']"
              class="input input-bordered input-sm w-full text-center"
              type="number"
              min="0"
              max="65535"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs text-base-content/60" for="inb-mixed-port">{{ $t('mixedPort') }}</label>
            <input
              id="inb-mixed-port"
              v-model.number="form['mixed-port']"
              class="input input-bordered input-sm w-full text-center"
              type="number"
              min="0"
              max="65535"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs text-base-content/60" for="inb-tproxy-port">{{ $t('tproxyPort') }}</label>
            <input
              id="inb-tproxy-port"
              v-model.number="form['tproxy-port']"
              class="input input-bordered input-sm w-full text-center"
              type="number"
              min="0"
              max="65535"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs text-base-content/60" for="inb-bind-address">Bind Address</label>
            <input
              id="inb-bind-address"
              v-model="form['bind-address']"
              class="input input-bordered input-sm w-full"
              type="text"
              placeholder="::"
            />
          </div>
        </div>

        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 text-sm">
            <input
              v-model="form['allow-lan']"
              class="checkbox"
              type="checkbox"
            />
            <span>{{ $t('allowLan') }}</span>
          </label>
          <label class="flex items-center gap-2 text-sm">
            <input
              v-model="form.ipv6"
              class="checkbox"
              type="checkbox"
            />
            <span>IPv6</span>
          </label>
        </div>
      </section>

      <!-- ===== TUN 配置 ===== -->
      <section class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-base-content/70">{{ $t('tunMode') }}</h3>
          <label class="flex cursor-pointer items-center gap-2 text-sm">
            <input
              v-model="form.tun.enable"
              class="toggle"
              type="checkbox"
            />
          </label>
        </div>

        <div
          v-if="form.tun.enable"
          class="flex flex-col gap-3"
        >
          <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <div class="flex flex-col gap-1">
              <label class="text-xs text-base-content/60" for="inb-tun-stack">{{ $t('tunStack') }}</label>
              <select
                id="inb-tun-stack"
                v-model="form.tun.stack"
                class="select select-bordered select-sm w-full"
              >
                <option value="gvisor">gvisor</option>
                <option value="system">system</option>
                <option value="mixed">mixed</option>
              </select>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-xs text-base-content/60" for="inb-tun-mtu">{{ $t('tunMtu') }}</label>
              <input
                id="inb-tun-mtu"
                v-model.number="form.tun.mtu"
                class="input input-bordered input-sm w-full text-center"
                type="number"
                min="1280"
                max="9000"
              />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-xs text-base-content/60" for="inb-tun-device">{{ $t('tunDevice') }}</label>
              <input
                id="inb-tun-device"
                v-model="form.tun.device"
                class="input input-bordered input-sm w-full"
                type="text"
                :placeholder="$t('tunDevice')"
              />
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <label class="flex items-center gap-2 text-sm">
              <input
                v-model="form.tun['auto-detect-interface']"
                class="checkbox"
                type="checkbox"
              />
              <span>{{ $t('tunAutoDetectInterface') }}</span>
            </label>
            <label class="flex items-center gap-2 text-sm">
              <input
                v-model="form.tun['strict-route']"
                class="checkbox"
                type="checkbox"
              />
              <span>{{ $t('tunStrictRoute') }}</span>
            </label>
          </div>
        </div>
      </section>

      <!-- ===== 应用 ===== -->
      <div class="flex items-center justify-end gap-2">
        <button
          class="btn btn-primary btn-sm"
          :disabled="isApplying"
          type="button"
          @click="handleApply"
        >
          <span
            v-if="isApplying"
            class="loading loading-spinner loading-sm"
          ></span>
          {{ $t('applyConfig') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { configs, fetchConfigs, updateConfigs } from '@/assembly/config'
import { notifyRequestError } from '@/helper/requestError'
import { reactive, ref, watch } from 'vue'

const form = reactive({
  port: 7890,
  'socks-port': 7891,
  'redir-port': 7892,
  'mixed-port': 7893,
  'tproxy-port': 7894,
  'allow-lan': false,
  'bind-address': '::',
  ipv6: false,
  tun: {
    enable: false,
    stack: 'gvisor' as string | undefined,
    dns: undefined as boolean | undefined,
    autoDns: undefined as boolean | undefined,
    mtu: 1500 as number | undefined,
    'auto-detect-interface': true as boolean | undefined,
    device: '' as string | undefined,
    'strict-route': false as boolean | undefined,
  },
})

watch(
  configs,
  (cfg) => {
    if (!cfg) return
    form.port = cfg.port ?? 0
    form['socks-port'] = cfg['socks-port'] ?? 0
    form['redir-port'] = cfg['redir-port'] ?? 0
    form['mixed-port'] = cfg['mixed-port'] ?? 0
    form['tproxy-port'] = cfg['tproxy-port'] ?? 0
    form['allow-lan'] = cfg['allow-lan'] ?? false
    form['bind-address'] = cfg['bind-address'] ?? ''
    form.ipv6 = cfg.ipv6 ?? false
    form.tun.enable = cfg.tun?.enable ?? false
    form.tun.stack = cfg.tun?.stack
    form.tun.dns = cfg.tun?.dns
    form.tun.autoDns = cfg.tun?.autoDns
    form.tun.mtu = cfg.tun?.mtu
    form.tun['auto-detect-interface'] = cfg.tun?.['auto-detect-interface']
    form.tun.device = cfg.tun?.device
    form.tun['strict-route'] = cfg.tun?.['strict-route']
  },
  { immediate: true, deep: true },
)

const isApplying = ref(false)

const handleApply = async () => {
  if (isApplying.value) return
  isApplying.value = true
  try {
    await updateConfigs({
      port: form.port,
      'socks-port': form['socks-port'],
      'redir-port': form['redir-port'],
      'mixed-port': form['mixed-port'],
      'tproxy-port': form['tproxy-port'],
      'allow-lan': form['allow-lan'],
      'bind-address': form['bind-address'],
      ipv6: form.ipv6,
      tun: { ...form.tun },
    })
    await fetchConfigs()
  } catch (e) {
    notifyRequestError(e)
  } finally {
    isApplying.value = false
  }
}
</script>
