// 组装层 · 日志累加器。
// 内核一次产出一条 Log,这里统一做加工:source-ip 标签替换、seq 编号、时间、暂停门控、保留上限与节流落表,
// 维护完整的 logs ref。store 直接引用该 ref,不再参与组装。
import { logRetentionLimit, sourceIPLabelList } from '@/store/settings'
import type { Log, LogWithSeq } from '@/types'
import dayjs from 'dayjs'
import { throttle } from 'lodash'
import { watch, type Ref } from 'vue'

export interface LogsAccumulator {
  // 内核产出的一批原始日志(已是 { type, payload } 形态)投递入表。
  push: (batch: Log[]) => void
  dispose: () => void
}

export const createLogsAccumulator = (
  logs: Ref<LogWithSeq[]>,
  isPaused: () => boolean,
): LogsAccumulator => {
  let idx = 1
  let logsTemp: LogWithSeq[] = []

  const flush = throttle(() => {
    logs.value = logsTemp.concat(logs.value).slice(0, logRetentionLimit.value)
    logsTemp = []
  }, 500)

  // source-ip 标签替换规则,随 sourceIPLabelList 变化重建。
  const ipSourceMatchs: [RegExp, string][] = []
  const restructMatchs = () => {
    ipSourceMatchs.length = 0
    for (const { key, label } of sourceIPLabelList.value) {
      if (key.startsWith('/')) continue

      if (key.includes(':')) {
        const regex = new RegExp(`${key}]:`, 'ig')
        ipSourceMatchs.push([regex, `${key}] (${label}) :`])
      } else {
        const regex = new RegExp(`${key}:`, 'ig')
        ipSourceMatchs.push([regex, `${key} (${label}) :`])
      }
    }
  }

  const stopWatch = watch(sourceIPLabelList, () => restructMatchs(), {
    immediate: true,
    deep: true,
  })

  const push = (batch: Log[]) => {
    for (const data of batch) {
      // 暂停时丢弃该条但仍推进 seq,与既有行为一致。
      if (isPaused()) {
        idx++
        continue
      }

      let payload = data.payload
      for (const [regex, label] of ipSourceMatchs) {
        payload = payload.replace(regex, label)
      }

      logsTemp.unshift({
        ...data,
        payload,
        time: dayjs().format('HH:mm:ss'),
        seq: idx++,
      })
    }

    flush()
  }

  return {
    push,
    dispose: () => {
      stopWatch()
      flush.cancel()
    },
  }
}
