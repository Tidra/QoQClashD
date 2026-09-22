// api 层 · 面板后端控制接口的长连接。
//
// 控制接口的 REST 调用收在 composables/useControlApi（ky 客户端）里，这里只放它
// 表达不了的 EventSource —— 组装层不引 composable，与 clash.ts 承载 WS 的分工一致。
// 鉴权走同源会话 cookie，EventSource 的同源请求默认就会带上，不需要额外头部。
export const createControlEventSource = (path: string) => {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return new EventSource(`${origin}/api/control/${path.replace(/^\/+/, '')}`)
}
