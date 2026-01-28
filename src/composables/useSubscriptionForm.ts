import { reactive, ref } from 'vue';
import { setLocalStorageItem } from '@/utils/storage';

export interface SubscriptionForm {
  sourceSubUrl: string;
  clientType: string;
  customBackend: string;
  remoteConfig: string;
  excludeRemarks: string;
  includeRemarks: string;
  filename: string;
  emoji: boolean;
  nodeList: boolean;
  extraset: boolean;
  sort: boolean;
  udp: boolean;
  tfo: boolean;
  scv: boolean;
  fdn: boolean;
  expand: boolean;
  appendType: boolean;
  insert: boolean;
  new_name: boolean;
  tpl: {
    surge: {
      doh: boolean;
    };
    clash: {
      doh: boolean;
    };
  };
}

export interface CustomParam {
  name: string;
  value: string;
}

/**
 * 订阅表单状态管理
 * 封装表单数据模型与业务逻辑
 */
export function useSubscriptionForm() {
  // 表单数据模型
  const form = reactive<SubscriptionForm>({
    /**
     * 原始订阅链接 / 节点链接
     * 支持多种格式 (ss/vmess/trojan/http/socks 等)
     * 多个链接可以用换行或 `|` 分隔
     */
    sourceSubUrl: "",
    
    /**
     * 目标客户端类型
     * 决定生成配置文件的格式 (e.g., 'clash', 'surge&ver=4')
     * 映射关系见 src/config/client-types.js
     */
    clientType: "",
    
    /**
     * 自定义后端地址
     * 若未指定，则使用默认后端 (src/config/constants.js)
     */
    customBackend: "",
    
    /**
     * 远程配置 URL
     * 用于加载外部的规则集和配置模板
     */
    remoteConfig: "",
    
    // 过滤与筛选
    excludeRemarks: "", // 排除匹配正则的节点
    includeRemarks: "", // 仅保留匹配正则的节点
    filename: "",       // 自定义输出文件名 (Content-Disposition)
    
    // 高级选项开关
    emoji: true,      // 是否为节点名称添加国旗 Emoji
    nodeList: false,  // 是否仅输出节点列表 (不含规则/策略组)
    extraset: false,  // 更多选项 (废弃保留字段)
    sort: false,      // 是否对节点进行排序
    udp: false,       // 是否启用 UDP 转发
    tfo: false,       // 是否启用 TCP Fast Open
    scv: true,        // 是否跳过 TLS 证书验证 (Skip Cert Verification)
    fdn: false,       // 是否过滤非法节点 (Filter Dead Nodes) - 需要后端支持
    expand: true,     // 是否展开规则集
    appendType: false,// 是否在节点名称前追加类型 (e.g., [SS])
    insert: false,    // 是否插入默认订阅的节点 (对应 insert_url)
    new_name: true,   // 是否使用 Clash 新字段名 (proxies vs Proxy)
    
    // 定制化模板参数
    tpl: {
      surge: {
        doh: false // Surge: 是否开启 DoH
      },
      clash: {
        doh: false // Clash: 是否开启 DoH
      }
    }
  });

  // 自定义参数
  const customParams = ref<CustomParam[]>([]);

  // 高级模式
  const advanced = ref("2");

  // 是否需要UDP
  const needUdp = ref(false);

  // 生成的订阅链接
  const customSubUrl = ref("");

  return {
    form,
    customParams,
    advanced,
    needUdp,
    customSubUrl
  };
}

/**
 * 添加自定义参数
 * @param {import('vue').Ref<CustomParam[]>} customParams - 自定义参数引用
 */
export function addCustomParam(customParams: import('vue').Ref<CustomParam[]>) {
  // 业务逻辑: 向参数列表中追加新的空键值对
  // 界面上会渲染为新的输入行，用户填写后将在生成链接时追加 &key=value
  customParams.value.push({
    name: "",
    value: "",
  });
}

/**
 * 保存订阅URL到本地存储
 * @param {SubscriptionForm} form - 表单对象
 */
export function saveSubUrl(form: SubscriptionForm) {
  if (form && form.sourceSubUrl !== '') {
    const ttl = Number(import.meta.env.VITE_CACHE_TTL) || 3600;
    setLocalStorageItem('sourceSubUrl', form.sourceSubUrl, ttl);
  }
}
