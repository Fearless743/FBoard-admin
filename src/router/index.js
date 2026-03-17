import { createRouter, createWebHistory } from 'vue-router'

import { hasStoredAuthSession } from '../services/auth'
import AdminLayout from '../layouts/AdminLayout.vue'
import DashboardPage from '../views/DashboardPage.vue'
import LoginPage from '../views/LoginPage.vue'
import NodesPage from '../views/NodesPage.vue'
import NoticesPage from '../views/NoticesPage.vue'
import OrdersPage from '../views/OrdersPage.vue'
import PlansPage from '../views/PlansPage.vue'
import PluginsPage from '../views/PluginsPage.vue'
import SettingsPage from '../views/SettingsPage.vue'
import TicketsPage from '../views/TicketsPage.vue'
import UsersPage from '../views/UsersPage.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: {
      public: true,
      title: '登录',
      eyebrow: 'LongtengCloud / 登录',
    },
  },
  {
    path: '/',
    component: AdminLayout,
    children: [
      {
        path: '',
        name: 'dashboard',
        component: DashboardPage,
        meta: {
          title: '仪表盘',
          eyebrow: 'LongtengCloud / 管理后台',
        },
      },
      {
        path: 'plans',
        name: 'plans',
        component: PlansPage,
        meta: {
          title: '套餐管理',
          eyebrow: 'LongtengCloud / 业务模块',
        },
      },
      {
        path: 'orders',
        name: 'orders',
        component: OrdersPage,
        meta: {
          title: '订单管理',
          eyebrow: 'LongtengCloud / 业务模块',
        },
      },
      {
        path: 'users',
        name: 'users',
        component: UsersPage,
        meta: {
          title: '用户管理',
          eyebrow: 'LongtengCloud / 用户中心',
        },
      },
      {
        path: 'nodes',
        name: 'nodes',
        component: NodesPage,
        meta: {
          title: '节点管理',
          eyebrow: 'LongtengCloud / 系统管理',
        },
      },
      {
        path: 'plugins',
        name: 'plugins',
        component: PluginsPage,
        meta: {
          title: '插件管理',
          eyebrow: 'LongtengCloud / 系统管理',
        },
      },
      {
        path: 'tickets',
        name: 'tickets',
        component: TicketsPage,
        meta: {
          title: '工单管理',
          eyebrow: 'LongtengCloud / 用户支持',
        },
      },
      {
        path: 'notices',
        name: 'notices',
        component: NoticesPage,
        meta: {
          title: '公告管理',
          eyebrow: 'LongtengCloud / 内容运营',
        },
      },
      {
        path: 'settings',
        name: 'settings',
        component: SettingsPage,
        meta: {
          title: '系统配置',
          eyebrow: 'LongtengCloud / 系统管理',
        },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(function authGuard(to) {
  const isAuthenticated = hasStoredAuthSession()

  if (to.meta.public && isAuthenticated) {
    const redirect = typeof to.query.redirect === 'string' ? to.query.redirect : '/'
    return redirect
  }

  if (!to.meta.public && !isAuthenticated) {
    return {
      name: 'login',
      query: {
        redirect: to.fullPath,
      },
    }
  }

  return true
})

export default router
