import useClipboard from 'vue-clipboard3'
import type { App } from 'vue'

/**
 * 剪贴板插件
 * 使用 vue-clipboard3 实现复制功能
 * @param {App} app Vue 应用实例
 */
export default (app: App) => {
  const { toClipboard } = useClipboard()
  // 注册全局 $copyText 方法以保持 API 兼容
  app.config.globalProperties.$copyText = toClipboard
}
