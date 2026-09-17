import { resolvePageTransition } from '@/composables/pageTransition'
import { ROUTE_NAME } from '@/constant'
import { i18n } from '@/i18n'
import { isPanelAuthenticated } from '@/helper/panelAuth'
import { language } from '@/store/settings'
import { activeBackend } from '@/store/setup'
import ConnectionsPage from '@/views/ConnectionsPage.vue'
import HomePage from '@/views/HomePage.vue'
import LogsPage from '@/views/LogsPage.vue'
import OverviewPage from '@/views/OverviewPage.vue'
import NodePoolPage from '@/views/NodePoolPage.vue'
import ProxiesPage from '@/views/ProxiesPage.vue'
import SubscriptionsPage from '@/views/SubscriptionsPage.vue'
import RulesPage from '@/views/RulesPage.vue'
import SettingsPage from '@/views/SettingsPage.vue'
import SetupPage from '@/views/SetupPage.vue'
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
  if (typeof name === 'string' && activeBackend.value) {
    const backend = activeBackend.value
    const prefix = backend.label || `${backend.host}:${backend.port}`
    title.value = `${prefix} | ${i18n.global.t(name)}`
  } else {
    title.value = 'QoQClashD'
  }
}

router.beforeEach((to, from) => {
  resolvePageTransition(to, from)

  const panelAllowed = isPanelAuthenticated()
  if (to.name === ROUTE_NAME.setup) {
    return
  }

  if (!panelAllowed) {
    router.push({ name: ROUTE_NAME.setup })
    return false
  }

  if (!activeBackend.value) {
    return
  }
})

router.afterEach((to) => {
  setTitleByName(to.name)
})

watch([language, activeBackend], () => {
  setTimeout(() => {
    setTitleByName(router.currentRoute.value.name)
  })
})

export default router
