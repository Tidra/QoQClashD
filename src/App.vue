<script setup lang="ts">
import { computed, onMounted, ref, type Ref, watch } from 'vue'
import { RouterView } from 'vue-router'
import UpgradeCoreModal from './components/settings/backend/UpgradeCoreModal.vue'
import { useAppearanceVars } from './composables/useAppearanceVars'
import { bootstrapKernelSession } from './composables/useKernelBackend'
import { showUpgradeCoreModal } from './composables/backendActions'
import ConfirmDialogHost from './components/common/ConfirmDialogHost.vue'
import { useKeyboard } from './composables/keyboard'
import { EMOJIS, FONTS, ROUTE_NAME } from './constant'
import { backgroundImage } from './helper/indexeddb'
import { initNotification } from './helper/notification'
import { authStatus } from './helper/panelSession'
import { unauthorizedCount } from './helper/unauthorized'
import { isPreferredDark } from './helper/utils'
import router from './router'
import { disablePullToRefresh, emoji, font, theme } from './store/settings'

const app = ref<HTMLElement>()
const toast = ref<HTMLElement>()

initNotification(toast as Ref<HTMLElement>)

// 字体类名映射表
const FONT_CLASS_MAP = {
  [EMOJIS.TWEMOJI]: {
    [FONTS.MI_SANS]: 'font-MiSans-Twemoji',
    [FONTS.SARASA_UI]: 'font-SarasaUI-Twemoji',
    [FONTS.PING_FANG]: 'font-PingFang-Twemoji',
    [FONTS.FIRA_SANS]: 'font-FiraSans-Twemoji',
    [FONTS.SYSTEM_UI]: 'font-SystemUI-Twemoji',
  },
  [EMOJIS.NOTO_COLOR_EMOJI]: {
    [FONTS.MI_SANS]: 'font-MiSans-NotoEmoji',
    [FONTS.SARASA_UI]: 'font-SarasaUI-NotoEmoji',
    [FONTS.PING_FANG]: 'font-PingFang-NotoEmoji',
    [FONTS.FIRA_SANS]: 'font-FiraSans-NotoEmoji',
    [FONTS.SYSTEM_UI]: 'font-SystemUI-NotoEmoji',
  },
} as const

const fontClassName = computed(() => {
  return (
    FONT_CLASS_MAP[emoji.value]?.[font.value] || FONT_CLASS_MAP[EMOJIS.TWEMOJI][FONTS.SYSTEM_UI]
  )
})

const setThemeColor = () => {
  if (!app.value) return

  const themeColor = getComputedStyle(app.value!).getPropertyValue('background-color').trim()
  const metaThemeColor = document.querySelector('meta[name="theme-color"]')
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', themeColor)
  }
}

watch(isPreferredDark, setThemeColor)
watch(
  theme,
  () => {
    document.body.setAttribute('data-theme', theme.value)
    setThemeColor()
  },
  {
    immediate: true,
  },
)

// iOS bounces the whole page when a vertical drag has nowhere left to scroll:
// either it's over a non-scrollable area (so the drag pans the layout viewport),
// or it's inside a scroll container already at its top/bottom edge and the
// leftover scroll chains up to the document. Classic iOS scroll-lock: find the
// nearest vertically-scrollable ancestor and only let the drag through while
// that element can still move in the drag direction; otherwise cancel it so
// nothing reaches the page.
let touchStartX = 0
let touchStartY = 0

const onTouchStart = (event: TouchEvent) => {
  touchStartX = event.touches[0].clientX
  touchStartY = event.touches[0].clientY
}

const findScrollableY = (target: EventTarget | null) => {
  let el = target as HTMLElement | null
  while (el && el !== document.body && el !== document.documentElement) {
    const { overflowY } = getComputedStyle(el)
    if ((overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight) {
      return el
    }
    el = el.parentElement
  }
  return null
}

const onTouchMove = (event: TouchEvent) => {
  if (event.touches.length > 1) return

  const deltaX = event.touches[0].clientX - touchStartX
  const deltaY = event.touches[0].clientY - touchStartY
  // Leave horizontal gestures (e.g. swiping a horizontally-scrollable table) be.
  if (Math.abs(deltaY) <= Math.abs(deltaX)) return

  const el = findScrollableY(event.target)
  if (!el) {
    event.preventDefault()
    return
  }

  const atTop = el.scrollTop <= 0
  const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1
  // deltaY > 0 means dragging downward (revealing content above).
  if ((atTop && deltaY > 0) || (atBottom && deltaY < 0)) {
    event.preventDefault()
  }
}

watch(
  disablePullToRefresh,
  () => {
    const body = document.body
    if (disablePullToRefresh.value) {
      body.style.overscrollBehavior = 'none'
      body.style.overflow = 'hidden'
      document.addEventListener('touchstart', onTouchStart, { passive: true })
      document.addEventListener('touchmove', onTouchMove, { passive: false })
    } else {
      body.style.overscrollBehavior = ''
      body.style.overflow = ''
      document.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('touchmove', onTouchMove)
    }
  },
  {
    immediate: true,
  },
)

// 会话由服务端签发：登录状态一确定就接上内核。
//   - authenticated 翻成 true（路由守卫拿到 /auth/status 的那一刻）→ running 就开
//     数据会话，没在跑则送去内核设置页；
//   - 任何一侧回 401（ky / axios / 存储读写）→ 作废本地快照并落回登录页。
watch(
  () => authStatus.value?.authenticated,
  (authenticated) => {
    if (authenticated) void bootstrapKernelSession()
  },
  // 路由守卫可能比本组件更早拿到 /auth/status，那时值不会再变，只有 immediate 能接上。
  { immediate: true },
)

watch(unauthorizedCount, async () => {
  if (!authStatus.value?.authenticated) return
  authStatus.value = null
  await router.replace({ name: ROUTE_NAME.setup })
})

onMounted(() => {
  setThemeColor()
})

useAppearanceVars()
useKeyboard()
</script>

<template>
  <div
    ref="app"
    id="app-content"
    :class="[
      'bg-base-100 flex w-screen overflow-hidden',
      fontClassName,
      backgroundImage && 'custom-background bg-cover bg-center',
    ]"
    :style="[backgroundImage, { height: 'var(--app-height, 100dvh)' }]"
  >
    <RouterView />
    <!-- 内核升级弹窗挂在根节点：设置页的动作按钮在别的组件树里，弹窗要跨路由存活。 -->
    <UpgradeCoreModal v-model="showUpgradeCoreModal" />
    <!--
      确认弹窗排在所有弹窗之后:它们都 teleport 到 #app-content 且同一层 z-index,
      谁后插进 DOM 谁在上面。升级内核的确认是从弹窗里拉起的,排前面就会被压在底下。
    -->
    <ConfirmDialogHost />
    <div
      ref="toast"
      class="app-toast-region"
    />
  </div>
</template>
