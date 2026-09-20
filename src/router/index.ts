import { resolvePageTransition } from '@/composables/pageTransition'
import { ROUTE_NAME } from '@/constant'
import { getAuthStatus } from '@/helper/panelSession'
import { whenStorageReady } from '@/helper/storage'
import { i18n } from '@/i18n'
import { language } from '@/store/settings'
import ConnectionsPage from '@/views/ConnectionsPage.vue'
import HomePage from '@/views/HomePage.vue'
import LogsPage from '@/views/LogsPage.vue'
import NodePoolPage from '@/views/NodePoolPage.vue'
import OverviewPage from '@/views/OverviewPage.vue'
import ProxiesPage from '@/views/ProxiesPage.vue'
import RulesPage from '@/views/RulesPage.vue'
import SettingsPage from '@/views/SettingsPage.vue'
import SetupPage from '@/views/SetupPage.vue'
import SubscriptionsPage from '@/views/SubscriptionsPage.vue'
import { useTitle } from '@vueuse/core'
import { watch } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const childrenRouter = [
  {
    path: 'proxies',
    name: ROUTE_NAME.proxies,
    component: ProxiesPage,
  },
  {
    path: 'node-pools',
    name: ROUTE_NAME.nodePools,
    component: NodePoolPage,
  },
  {
    path: 'overview',
    name: ROUTE_NAME.overview,
    component: OverviewPage,
  },
  {
    path: 'subscriptions',
    name: ROUTE_NAME.subscriptions,
    component: SubscriptionsPage,
  },
  {
    path: 'connections',
    name: ROUTE_NAME.connections,
    component: ConnectionsPage,
  },
  {
    path: 'logs',
    name: ROUTE_NAME.logs,
    component: LogsPage,
  },
  {
    path: 'rules',
    name: ROUTE_NAME.rules,
    component: RulesPage,
  },
  {
    path: 'settings',
    name: ROUTE_NAME.settings,
    component: SettingsPage,
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: ROUTE_NAME.overview,
      component: HomePage,
      children: childrenRouter,
    },
    {
      path: '/setup',
      name: ROUTE_NAME.setup,
      component: SetupPage,
    },
    {
      path: '/:catchAll(.*)',
      redirect: ROUTE_NAME.overview,
    },
  ],
})

const title = useTitle('QoQClashD')
const setTitleByName = (name: string | symbol | undefined) => {
  title.value = typeof name === 'string' ? `${i18n.global.t(name)} | QoQClashD` : 'QoQClashD'
}

router.beforeEach(async (to, from) => {
  resolvePageTransition(to, from)

  // 会话由服务端签发（签名 cookie），鉴权状态必须先问一次 /auth/status。
  const authenticated = await getAuthStatus()
    .then((status) => status.authenticated)
    .catch(() => false)

  if (to.name === ROUTE_NAME.setup) {
    return authenticated ? { name: ROUTE_NAME.overview } : undefined
  }

  if (!authenticated) return { name: ROUTE_NAME.setup }

  // 面板认证状态存于后端 SQLite，异步读取完成前各个 store 还是默认值，
  // 直接放行会把已登录用户闪到空白页，必须先等待水合完成。
  await whenStorageReady()
})

router.afterEach((to) => {
  setTitleByName(to.name)
})

watch(language, () => {
  setTimeout(() => {
    setTitleByName(router.currentRoute.value.name)
  })
})

export default router
