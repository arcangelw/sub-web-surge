import axios from "axios"
import type { App } from 'vue'

// 请求超时时间设定 (5秒)
axios.defaults.timeout = 5000

/**
 * Axios 插件
 * 注册全局 $axios 属性
 * @param {App} app Vue 应用实例
 */
export default (app: App) => {
  app.config.globalProperties.$axios = axios
}