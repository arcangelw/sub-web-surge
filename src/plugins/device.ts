import type { App } from 'vue'

/**
 * 设备检测插件
 * 注册全局 $getOS 方法用于识别当前操作系统环境
 * @param {App} app Vue 应用实例
 */
export default (app: App) => {
  app.config.globalProperties.$getOS = () => {
    // 获取用户代理字符串
    let ua = navigator.userAgent,
      isWindowsPhone = /(?:Windows Phone)/.test(ua),
      isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
      isAndroid = /(?:Android)/.test(ua),
      isFireFox = /(?:Firefox)/.test(ua),
      // isChrome = /(?:Chrome|CriOS)/.test(ua),
      isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
      isIPhone = /(?:iPhone)/.test(ua) && !isTablet,
      isPc = !isIPhone && !isAndroid && !isSymbian && !isWindowsPhone;

    return {
      isTablet: isTablet,
      isIPhone: isIPhone,
      isAndroid: isAndroid,
      isPc: isPc
    };
  }
}
