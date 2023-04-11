import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import { setupPageGuard } from './permission'
import { ChatLayout } from '@/layouts'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Root',
    component: ChatLayout,
    redirect: '/chat',
    children: [
      {
        path: '/chat/:uuid?',
        name: 'Chat',
        component: () => import('@/views/Chat/index.vue'),
      },
      {
        path: '/promptStore',
        name: 'PromptStore',
        component: () => import('@/views/PromptStore/index.vue'),
      },
      {
        path: '/shortcutSetting',
        name: 'ShortcutSetting',
        component: () => import('@/views/ShortcutSetting/index.vue'),
      },
    ],
  },

  {
    path: '/404',
    name: '404',
    component: () => import('@/views/Exception/404/index.vue'),
  },

  {
    path: '/500',
    name: '500',
    component: () => import('@/views/Exception/500/index.vue'),
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    redirect: '/404',
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

setupPageGuard(router)

export async function setupRouter(app: App) {
  app.use(router)
  await router.isReady()
}
