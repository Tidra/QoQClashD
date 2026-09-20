// 401 的统一出口。
//
// api 层与 KV 存储都处在依赖图底部，不能反向 import 路由或会话模块（会绕出一条
// helper/storage → 会话 → 路由 → 视图 → store → helper/storage 的环，视图里的
// 顶层 useStorage 会在初始化前被调用）。所以这里只放一个计数器，跳转登录页由
// App.vue 监听它来做。
import { ref } from 'vue'

export const unauthorizedCount = ref(0)

export const markUnauthorized = () => {
  unauthorizedCount.value += 1
}
