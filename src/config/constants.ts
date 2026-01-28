/**
 * 项目常量定义配置
 * 包含了所有外部链接、API 地址和 UI 相关的固定参数
 */
export interface AppConstants {
  /** 项目 GitHub 地址 */
  PROJECT: string;
  /** 远程配置示例文件的 URL */
  REMOTE_CONFIG_SAMPLE: string;
  /** Subconverter 高级用法文档地址 */
  DOC_ADVANCED: string;
  /** Subconverter 后端发布页地址 */
  BACKEND_RELEASE: string;
  /** 默认的 Subconverter 后端地址 */
  DEFAULT_BACKEND: string;

  /** 配置文件上传服务 API */
  CONFIG_UPLOAD_API: string;

  /** 默认选中的客户端类型 (Key) */
  DEFAULT_CLIENT_TYPE: string;
  /** 通用按钮宽度样式 */
  BUTTON_WIDTH: string;
  /** 大号按钮宽度样式 */
  LARGE_BUTTON_WIDTH: string;
}

/**
 * 全局常量对象
 * 大部分值通过 vite 的环境变量注入 (import.meta.env)
 * 详见 .env 文件
 */
export const CONSTANTS: AppConstants = {
  PROJECT: import.meta.env.VITE_PROJECT,
  REMOTE_CONFIG_SAMPLE: import.meta.env.VITE_SUBCONVERTER_REMOTE_CONFIG,
  DOC_ADVANCED: import.meta.env.VITE_SUBCONVERTER_DOC_ADVANCED,
  BACKEND_RELEASE: import.meta.env.VITE_BACKEND_RELEASE,
  DEFAULT_BACKEND: import.meta.env.VITE_SUBCONVERTER_DEFAULT_BACKEND + '/sub?',

  CONFIG_UPLOAD_API: import.meta.env.VITE_CONFIG_UPLOAD_API,

  DEFAULT_CLIENT_TYPE: 'clash',
  BUTTON_WIDTH: '140px',
  LARGE_BUTTON_WIDTH: '290px'
};
