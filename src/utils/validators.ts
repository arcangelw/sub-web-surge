/**
 * 验证订阅链接格式
 * @param {string} url - 订阅链接
 * @returns {Object} 验证结果
 */
export interface ValidationResult {
  valid: boolean;
  message?: string;
}

/**
 * 验证订阅链接格式
 * @param {string} url - 订阅链接
 * @returns {ValidationResult} 验证结果
 */
export const validateSubUrl = (url: string): ValidationResult => {
  if (!url || url.trim() === "") {
    return { valid: false, message: "订阅链接不能为空" };
  }

  // 检查是否包含有效的协议或节点信息
  const hasValidFormat = /^(ss|ssr|vmess|trojan|hysteria|tuic|sip008|vless):\/\//.test(url) ||
                         /^https?:\/\//.test(url) ||
                         /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]+$/.test(url);

  if (!hasValidFormat) {
    return { valid: false, message: "订阅链接格式可能不正确" };
  }

  return { valid: true };
};

/**
 * 验证表单必填项
 * @param {any} form - 表单数据 (使用 any 暂避循环依赖，后续可优化为 SubscriptionForm)
 * @returns {boolean} 验证结果
 */
export const validateForm = (form: any): boolean => {
  if (form.sourceSubUrl === "" || form.clientType === "") {
    return false;
  }
  return true;
};
