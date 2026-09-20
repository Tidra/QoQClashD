<template>
  <!-- DialogWrapper teleport 到 #app-content（本组件的挂载根），需等挂载完成再渲染。 -->
  <DialogWrapper
    v-if="isReady"
    v-model="value"
    :title="$t('currentConfigYaml')"
    box-class="w-[min(720px,92vw)] max-w-none"
  >
    <div class="flex flex-col gap-3">
      <div class="flex items-center justify-between gap-3">
        <div class="btn-group">
          <button
            class="btn btn-xs"
            :class="tab === 'yaml' && 'btn-active'"
            @click="tab = 'yaml'"
          >
            {{ $t('configYamlTab') }}
          </button>
          <button
            class="btn btn-xs"
            :class="tab === 'diff' && 'btn-active'"
            :disabled="!baselineAvailable"
            @click="tab = 'diff'"
          >
            {{ $t('configDiffTab') }}
          </button>
        </div>
        <div class="text-base-content/60 min-w-0 truncate text-xs">
          {{ tab === 'diff' ? $t('configDiffHint') : $t('currentConfigYamlHint') }}
        </div>
      </div>

      <textarea
        v-if="tab === 'yaml'"
        class="textarea textarea-bordered h-[min(65vh,640px)] w-full resize-none font-mono text-xs"
        readonly
        :value="yamlText"
        spellcheck="false"
        :aria-label="$t('currentConfigYaml')"
      ></textarea>

      <div
        v-else
        class="border-base-border bg-base-200/40 h-[min(65vh,640px)] overflow-auto rounded-md border p-2 font-mono text-xs leading-5"
      >
        <div
          v-if="diffLoading"
          class="flex items-center gap-2 p-2"
        >
          <span class="loading loading-spinner loading-sm"></span>
        </div>
        <div
          v-else-if="!baselineAvailable"
          class="text-base-content/50 p-2"
        >
          {{ $t('configDiffNoBaseline') }}
        </div>
        <div
          v-else-if="!diffHasChanges"
          class="text-base-content/50 p-2"
        >
          {{ $t('configDiffUnchanged') }}
        </div>
        <template v-else>
          <div
            v-for="(row, index) in diffRows"
            :key="index"
            class="flex rounded-sm px-1 break-all whitespace-pre-wrap"
            :class="{
              'bg-success/10 text-success': row.kind === 'add',
              'bg-error/10 text-error': row.kind === 'del',
              'text-base-content/40 justify-center': row.kind === 'gap',
            }"
          >
            <template v-if="row.kind === 'gap'">
              {{ $t('configDiffGap', { count: row.count }) }}
            </template>
            <template v-else>
              <span class="w-4 shrink-0 text-center select-none">{{
                row.kind === 'add' ? '+' : row.kind === 'del' ? '-' : ' '
              }}</span>
              <span>{{ row.text }}</span>
            </template>
          </div>
        </template>
      </div>

      <div class="flex justify-end gap-2">
        <button
          class="btn btn-sm"
          @click="copyYaml"
        >
          {{ $t('copy') }}
        </button>
        <button
          class="btn btn-sm btn-primary"
          @click="value = false"
        >
          {{ $t('close') }}
        </button>
      </div>
    </div>
  </DialogWrapper>
</template>

<script setup lang="ts">
import DialogWrapper from '@/components/common/DialogWrapper.vue'
import { useControlApi } from '@/composables/useControlApi'
import { composeConfigYaml } from '@/helper/composeConfig'
import { showNotification } from '@/helper/notification'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const value = defineModel<boolean>({ required: true })

type DiffRow = { kind: 'ctx' | 'add' | 'del' | 'gap'; text?: string; count?: number }

const yamlText = ref('')
const diffRows = ref<DiffRow[]>([])
const baselineAvailable = ref(false)
const diffLoading = ref(false)
const tab = ref<'yaml' | 'diff'>('yaml')
const isReady = ref(false)
const diffHasChanges = computed(() =>
  diffRows.value.some((row) => row.kind === 'add' || row.kind === 'del'),
)

onMounted(() => {
  isReady.value = true
})

// 公共前后缀先剥掉，LCS 只算中间差异段，几百行的配置也够快。
const diffRowsFor = (oldLines: string[], newLines: string[]): DiffRow[] => {
  let prefix = 0

  while (
    prefix < oldLines.length &&
    prefix < newLines.length &&
    oldLines[prefix] === newLines[prefix]
  )
    prefix++

  let suffix = 0

  while (
    suffix < oldLines.length - prefix &&
    suffix < newLines.length - prefix &&
    oldLines[oldLines.length - 1 - suffix] === newLines[newLines.length - 1 - suffix]
  )
    suffix++

  const midOld = oldLines.slice(prefix, oldLines.length - suffix)
  const midNew = newLines.slice(prefix, newLines.length - suffix)
  const rows: DiffRow[] = []

  if (midOld.length && midNew.length && midOld.length * midNew.length <= 4_000_000) {
    const n = midOld.length
    const m = midNew.length
    // dp[i][j] = midOld[i:] 与 midNew[j:] 的 LCS 长度
    const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))

    for (let i = n - 1; i >= 0; i--) {
      for (let j = m - 1; j >= 0; j--) {
        dp[i][j] =
          midOld[i] === midNew[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1])
      }
    }
    let i = 0
    let j = 0

    while (i < n && j < m) {
      if (midOld[i] === midNew[j]) {
        rows.push({ kind: 'ctx', text: midOld[i] })
        i++
        j++
      } else if (dp[i + 1][j] >= dp[i][j + 1]) {
        rows.push({ kind: 'del', text: midOld[i++] })
      } else {
        rows.push({ kind: 'add', text: midNew[j++] })
      }
    }
    while (i < n) rows.push({ kind: 'del', text: midOld[i++] })
    while (j < m) rows.push({ kind: 'add', text: midNew[j++] })
  } else {
    for (const line of midOld) rows.push({ kind: 'del', text: line })
    for (const line of midNew) rows.push({ kind: 'add', text: line })
  }

  return [
    ...collapseCtx(oldLines.slice(0, prefix)),
    ...rows,
    ...collapseCtx(oldLines.slice(oldLines.length - suffix)),
  ]
}

// 连续未变更行只留头尾各 3 行，中间折成一条「未变更 N 行」。
const collapseCtx = (lines: string[]): DiffRow[] => {
  if (lines.length <= 6) return lines.map((text) => ({ kind: 'ctx' as const, text }))

  return [
    ...lines.slice(0, 3).map((text) => ({ kind: 'ctx' as const, text })),
    { kind: 'gap', count: lines.length - 6 },
    ...lines.slice(-3).map((text) => ({ kind: 'ctx' as const, text })),
  ]
}

const load = async () => {
  try {
    yamlText.value = composeConfigYaml()
  } catch (error) {
    yamlText.value = ''
    diffRows.value = []
    baselineAvailable.value = false
    tab.value = 'yaml'
    showNotification({
      content: error instanceof Error ? error.message : String(error),
      type: 'alert-error',
    })
    return
  }

  diffLoading.value = true
  try {
    const baseline = await useControlApi().getActiveConfig()

    baselineAvailable.value = Boolean(baseline.trim())
    if (baselineAvailable.value) {
      diffRows.value = diffRowsFor(
        baseline.replace(/\r\n/g, '\n').split('\n'),
        yamlText.value.split('\n'),
      )
      // 有未下发差异时默认落在差异页 —— 「查看」就是为了看新旧差在哪。
      tab.value = diffHasChanges.value ? 'diff' : 'yaml'
    } else {
      diffRows.value = []
      tab.value = 'yaml'
    }
  } catch {
    baselineAvailable.value = false
    diffRows.value = []
    tab.value = 'yaml'
  } finally {
    diffLoading.value = false
  }
}

const stopWatch = watch(value, (open) => {
  if (open) void load()
})

onBeforeUnmount(stopWatch)

const copyYaml = async () => {
  const done = () => showNotification({ content: 'copySuccess', type: 'alert-success' })

  try {
    await navigator.clipboard.writeText(yamlText.value)
    done()
  } catch {
    // 非安全上下文 / 无焦点时 Clipboard API 会直接抛错，降级用隐藏 textarea + execCommand。
    const textArea = document.createElement('textarea')

    textArea.value = yamlText.value
    textArea.style.position = 'fixed'
    textArea.style.opacity = '0'
    document.body.appendChild(textArea)
    textArea.select()

    try {
      document.execCommand('copy')
      done()
    } catch {
      showNotification({ content: 'copyFailed', type: 'alert-error' })
    }
    document.body.removeChild(textArea)
  }
}
</script>
