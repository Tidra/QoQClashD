import '@/api/http'
import '@/helper/dayjs'
import '@/store/sampleData'
import 'tippy.js/animations/scale.css'
import 'tippy.js/dist/tippy.css'
import { createApp } from 'vue'
import App from './App.vue'
import { loadFonts } from './assets/load-fonts'
import './assets/main.css'
import { applyCustomCSS, applyCustomThemes, applyKsuTheme } from './helper'
import { i18n } from './i18n'
import router from './router'
import { whenStorageReady } from '@/helper/storage'
import { startSubscriptionAutoUpdate } from '@/store/subscriptions'

const isEdge = /Edg\//.test(navigator.userAgent)

if (isEdge) {
  const originalReplaceState = history.replaceState
  history.replaceState = function (...args) {
    if (document.visibilityState === 'hidden') return
    return originalReplaceState.apply(this, args)
  }
}

applyCustomThemes()
applyCustomCSS()
applyKsuTheme()
loadFonts()

const app = createApp(App)

app.use(router)
app.use(i18n)
app.mount('#app')

// 订阅自动更新：等存储水合完成后启动，避免用默认空数据误判。
void whenStorageReady().then(() => startSubscriptionAutoUpdate())
