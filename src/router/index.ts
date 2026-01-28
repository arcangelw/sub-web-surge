import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'SubConverter',
    component: () => import('../views/Subconverter.vue')
  }
]

/**
 * 创建并导出路由实例
 * 使用 Vue Router 4 的 createRouter 和 createWebHistory API
 */
const router = createRouter({
  // 使用 HTML5 History 模式
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
