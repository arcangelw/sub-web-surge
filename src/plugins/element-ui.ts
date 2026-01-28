import 'element-plus/dist/index.css'
import type { App } from 'vue'
import ElementPlus from 'element-plus'

/**
 * Element Plus 插件
 * 注册 Element Plus 组件并配置全局属性
 * @param {App} app Vue 应用实例
 */
export default (app: App) => {
  // 使用 Element Plus 全局插件
  app.use(ElementPlus, { size: 'small', zIndex: 3000 })
}
