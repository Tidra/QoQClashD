// api 层 · axios 实例的全局拦截器。
// Mihomo 请求统一走当前 server 的同源代理；内核 secret 由 server 侧注入，
// 浏览器不持有任何凭据 —— 这里的 401 只可能是面板会话本身失效。
import { markUnauthorized } from '@/helper/unauthorized'
import axios, { type AxiosError } from 'axios'

axios.interceptors.request.use((config) => {
  config.baseURL =
    typeof window !== 'undefined' ? `${window.location.origin}/api/mihomo` : undefined
  return config
})

// 其余错误一律原样抛出，不在这里弹提示 —— 提示该由发起请求的业务层用 try-catch
// 决定(见 helper/requestError.ts)：只有用户手动触发的动作才打扰用户，后台
// 自动拉取失败保持静默。
axios.interceptors.response.use(null, (error: AxiosError) => {
  if (error.status === 401) markUnauthorized()
  return Promise.reject(error)
})
