import SvgIcon from '@/components/SvgIcon/index.vue'// svg component
import 'virtual:svg-icons-register'
import type { App } from 'vue'

/**
 * 图标插件
 * 注册全局 svg-icon 组件
 * @param {App} app Vue 应用实例
 */
export default (app: App) => {
  // 注册全局组件
  app.component('svg-icon', SvgIcon)
}
