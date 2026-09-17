import { API_SECRET } from '@/config/env'
import { useStorage } from '@/helper/storage'

const PANEL_PASSWORD_KEY = 'setup/panel-password'
const PANEL_AUTH_KEY = 'setup/panel-auth'

// 启动时初始化：核心与面板共用同一密钥。
// 若环境变量 API_SECRET 非空且 localStorage 尚未保存面板密码，则以共用密钥作为默认面板密码，
// 使面板与核心使用同一认证值；否则保留用户自定义的面板密码。
const initPanelPasswordFromEnv = () => {
  if (API_SECRET && !panelPassword.value) {
    panelPassword.value = API_SECRET
  }
}

export const panelPassword = useStorage<string>(PANEL_PASSWORD_KEY, '')
export const panelAuthenticated = useStorage<boolean>(PANEL_AUTH_KEY, false)

initPanelPasswordFromEnv()

const browserAuthKey = 'qoqclashd:panel-authenticated'
const browserPasswordKey = 'qoqclashd:panel-password'
const readBrowserAuth = () =>
  typeof window !== 'undefined' && window.localStorage.getItem(browserAuthKey) === 'true'
const readBrowserPassword = () =>
  typeof window !== 'undefined' ? window.localStorage.getItem(browserPasswordKey) || '' : ''

if (!panelAuthenticated.value && readBrowserAuth()) panelAuthenticated.value = true
if (!panelPassword.value && readBrowserPassword()) panelPassword.value = readBrowserPassword()

export const setPanelPassword = (password: string) => {
  const cleaned = password.trim()
  panelPassword.value = cleaned
  if (typeof window !== 'undefined') window.localStorage.setItem(browserPasswordKey, cleaned)
  if (!cleaned) {
    logoutPanel()
    return
  }
  panelAuthenticated.value = false
}

export const clearPanelAuthState = () => {
  panelAuthenticated.value = false
}

// The panel should never be usable without a configured password. The first run
// is required to set one, and afterwards every dashboard entry is gated behind a
// successful login. This matches the product requirement for a real panel lock.
export const isPanelAuthRequired = () => true

export const isPanelAuthenticated = () => {
  return panelAuthenticated.value
}

export const loginToPanel = (password: string) => {
  const trimmed = password.trim()

  if (!panelPassword.value) {
    panelPassword.value = trimmed
    panelAuthenticated.value = true
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(browserPasswordKey, trimmed)
      window.localStorage.setItem(browserAuthKey, 'true')
    }
    return true
  }

  const ok = trimmed === panelPassword.value
  if (ok) {
    panelAuthenticated.value = true
    if (typeof window !== 'undefined') window.localStorage.setItem(browserAuthKey, 'true')
  }
  return ok
}

export const logoutPanel = () => {
  panelAuthenticated.value = false
  if (typeof window !== 'undefined') window.localStorage.removeItem(browserAuthKey)
}
