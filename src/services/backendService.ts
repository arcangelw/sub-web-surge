import { CONSTANTS } from '@/config/constants';
import { formatVersion } from '@/utils/formatters';

/**
 * 后端版本检查服务
 */
export class BackendService {
  /**
   * 获取后端版本信息
   *
   * 业务逻辑:
   * 1. 根据当前选择的后端地址 (DEFAULT_BACKEND) 构造 `/version` 接口地址
   * 2. 发起 GET 请求
   * 3. 格式化返回的版本号字符串
   *
   * @param {Object} $axios - Axios 实例
   * @returns {Promise<string>} 版本信息字符串，失败时返回空字符串(静默失败)
   */
  static async getBackendVersion($axios: any): Promise<string> {
    // 提取版本 API 路径 (移除 /sub? 后缀并追加 /version)
    const versionApiUrl = CONSTANTS.DEFAULT_BACKEND.substring(0, CONSTANTS.DEFAULT_BACKEND.length - 5) + "/version";

    try {
      const response = await $axios.get(versionApiUrl);
      // 清理版本信息格式 (e.g. "subconverter v0.7.2" -> "v0.7.2")
      let version = formatVersion(response.data);
      return version;
    } catch (error) {
      // 错误处理策略: 静默处理
      // 原因: 后端版本非核心功能，获取失败不应阻断用户使用
      console.warn("Failed to fetch backend version:", error);
      return "";
    }
  }
}
