<template>
  <div
    class="bg-base-100 fixed top-0 right-0 left-0 z-30 shadow-xs backdrop-blur-xl"
    :class="[isMiddleScreen ? 'fixed' : 'sticky', { 'md:bg-base-100/50': !solid }]"
    ref="ctrlsBarRef"
  >
    <slot></slot>
  </div>
</template>
<script lang="ts" setup>
import { ctrlsBottom } from '@/composables/paddingViews'
import { isMiddleScreen } from '@/helper/utils'
import { useElementBounding } from '@vueuse/core'
import { onUnmounted, ref, watch } from 'vue'

defineProps<{
  solid?: boolean
}>()

/**
 * 一条全局顶距，同时挂载的多条 CtrlsBar（节点页用 v-show 切子页）会抢着写它，
 * 而收起的那条在 display:none 下不再重测、只能把上一次的旧高度再写一遍 —— 页面就按错误
 * 的高度让位，头部下沿压在首行上。所以只有真正在屏幕上占位的那条有资格发布。
 */
let publishedBar: HTMLElement | null = null

const ctrlsBarRef = ref<HTMLDivElement | null>(null)
const { bottom: ctrlsBarBottom } = useElementBounding(ctrlsBarRef)

watch(
  ctrlsBarBottom,
  () => {
    const el = ctrlsBarRef.value
    // 隐藏元素没有 client rect，用它当「是否可见」的判据（fixed 元素的 offsetParent 恒为 null）
    if (!el || el.getClientRects().length === 0) return
    publishedBar = el
    ctrlsBottom.value = ctrlsBarBottom.value
  },
  { immediate: true },
)

onUnmounted(() => {
  // 只有最后发布的那条负责收摊，否则切路由时新页刚写好顶距就被旧页清成 0
  if (publishedBar !== ctrlsBarRef.value) return
  publishedBar = null
  ctrlsBottom.value = 0
})
</script>
