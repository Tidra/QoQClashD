// 日志页唯一的流：面板后端转发的内核进程 stdout/stderr（SSE）。
//
// 它取代了原来的 Clash WS 那条通道，因为 WS 只是这条流的子集 —— 同一批 logrus 行，
// 而且 WS 只有内核活着、Clash API 起来之后才连得上。最需要看日志的时刻恰恰是内核
// 起不来：yaml 不合法时 mihomo 把报错打出来就直接退出，只有这条流留得住那几行。
// 于是「内核运行日志」与「其余进程输出」的区分降级成行上的 origin 字段，由日志页
// 的过滤下拉去筛（见 assembly/logs 的 LOG_ORIGINS）。
//
// 缓冲里除了常驻进程的输出，还有 `mihomo -t` 校验探针的每一行：「应用配置」被 400 掉
// 时那次运行是一次性子进程，报错不落进这条流就永远只存在于没人看着的几秒钟里。
//
// SSE 断线自动重连时后端会整段重放缓冲，所以按 (ts, stream, line) 去重。
import { createControlEventSource } from '@/api/control'
import { LOG_LEVEL } from '@/constant'
import type { Log } from '@/types'
import type { LogsSubscription } from './types'

interface KernelLogFrame {
  type: 'log' | 'state'
  stream?: 'stdout' | 'stderr'
  line?: string
  ts?: number
}

// 缓冲里的行是历史，用产生时的时间戳；异常帧没有 ts 就退回当下。
const frameTime = (ts: number | undefined) => {
  const d = new Date(ts ?? Date.now())
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

// mihomo 走 logrus 的文本格式（time="…" level=info msg="…"），级别其实就写在行里。
// 不读出来的话每行都只能标成 info，颜色与类型筛选双双失效，而 fatal 那几行正是
// 这一路要给人看的东西。解析不出来的行（Go 的 panic 栈、裸 stderr）留整行原文。
const LOG_LEVEL_VALUES = new Set<string>(Object.values(LOG_LEVEL))

const readLevel = (line: string) => {
  const level = /(?:^|\s)level=(\w+)(?:\s|$)/.exec(line)?.[1]
  return level !== undefined && LOG_LEVEL_VALUES.has(level) ? (level as LOG_LEVEL) : undefined
}

const readMessage = (line: string) => {
  const raw = /(?:^|\s)msg="((?:[^"\\]|\\.)*)"(?:\s|$)/.exec(line)?.[1]
  return raw?.replace(/\\(["\\])/g, '$1')
}

export const subscribeServiceLogs = (onBatch: (batch: Log[]) => void): LogsSubscription => {
  const seen = new Set<string>()
  const source = createControlEventSource('kernel/logs')

  source.onmessage = (event: MessageEvent<string>) => {
    let frame: KernelLogFrame
    try {
      frame = JSON.parse(event.data) as KernelLogFrame
    } catch {
      return
    }

    // state 帧不进日志：内核状态侧栏一直在报，混进来只会盖掉真正的报错行。
    if (frame.type !== 'log' || typeof frame.line !== 'string') return

    const key = `${frame.ts}|${frame.stream}|${frame.line}`
    if (seen.has(key)) return
    seen.add(key)

    // 带 level= 与 msg= 的行算内核运行日志，其余都算进程原始输出。级别读不出来时
    // 退回通道能给的最粗粒度：mihomo 的异常输出走 stderr。
    const level = readLevel(frame.line)
    const message = readMessage(frame.line)

    onBatch([
      {
        type: level ?? (frame.stream === 'stderr' ? LOG_LEVEL.Error : LOG_LEVEL.Info),
        payload: message ?? frame.line,
        origin: level !== undefined && message !== undefined ? 'kernel' : 'process',
        time: frameTime(frame.ts),
      },
    ])
  }

  return { close: () => source.close() }
}
