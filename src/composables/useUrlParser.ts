import type { SubscriptionForm, CustomParam } from '@/composables/useSubscriptionForm';


/**
 * URL解析逻辑
 */
export function useUrlParser() {
  /**
   * 异步分析URL
   * @param {string} loadConfig - 待分析的URL
   * @returns {Promise<string>} 分析结果
   */
  const analyzeUrl = async (loadConfig: string): Promise<string> => {
    // 检查 loadConfig 是否包含 "target"
    if (loadConfig.includes("target")) {
      // 如果包含，直接返回
      return loadConfig;
    } else {
      // 否则，使用 GET 请求获取数据并跟随重定向
      try {
        let response = await fetch(loadConfig, {
          method: "GET",
          redirect: "follow",
        });
        // 返回响应中的 URL
        return response.url;
      } catch (e) {
        throw new Error("解析短链接失败，请检查短链接服务端是否配置跨域：" + e);
      }
    }
  };

  /**
   * 确认并加载配置
   * @param {string} loadConfig - 待解析的配置URL
   * @param {SubscriptionForm} form - 表单对象
   * @param {CustomParam[]} customParams - 自定义参数数组
   * @param {Function} onSuccess - 成功回调
   * @param {Function} onError - 错误回调
   * @returns {Promise<boolean>} 是否成功
   */
  const parseUrl = async (
    loadConfig: string,
    form: SubscriptionForm,
    customParams: CustomParam[],
    onSuccess: () => void,
    onError: (msg: string) => void
  ): Promise<boolean> => {
    // 检查 loadConfig 是否为空
    if (loadConfig.trim() === "") {
      onError("订阅链接不能为空");
      return false;
    }

    try {
      // 分析 URL 并提取组件
      const url = new URL(await analyzeUrl(loadConfig));

      // 设置自定义后端地址
      form.customBackend = url.origin + url.pathname + "?";

      // 解析 URL 参数
      const params = new URLSearchParams(url.search);

      // 记录已读取的参数
      const getParam = params.get.bind(params);
      const excludeParams = new Set<string>();
      params.get = (key: string) => {
        excludeParams.add(key);
        return getParam(key);
      };

      // 获取 'target' 参数
      const target = params.get("target");

      // 根据 'target' 参数设置客户端类型
      if (target === "surge") {
        const ver = params.get("ver") || "4";
        form.clientType = target + "&ver=" + ver;
      } else {
        form.clientType = target || "";
      }

      // 根据 URL 参数设置其他表单属性
      form.sourceSubUrl = (params.get("url") || "").replace(/\|/g, "\n");
      form.insert = params.get("insert") === "true";
      form.remoteConfig = params.get("config") || "";
      form.excludeRemarks = params.get("exclude") || "";
      form.includeRemarks = params.get("include") || "";
      form.filename = params.get("filename") || "";
      form.appendType = params.get("append_type") === "true";
      form.emoji = params.get("emoji") === "true";
      form.nodeList = params.get("list") === "true";
      form.tfo = params.get("tfo") === "true";
      form.scv = params.get("scv") === "true";
      form.fdn = params.get("fdn") === "true";
      form.sort = params.get("sort") === "true";
      form.udp = params.get("udp") === "true";
      form.expand = params.get("expand") === "true";
      if (form.tpl.surge) {
         form.tpl.surge.doh = params.get("surge.doh") === "true";
      }
      if (form.tpl.clash) {
         form.tpl.clash.doh = params.get("clash.doh") === "true";
      }
      form.new_name = params.get("new_name") === "true";

      // 过滤自定义参数
      customParams.splice(0, customParams.length);
      Array.from(params
        .entries())
        .filter(e => !excludeParams.has(e[0]))
        .map(e => ({ name: e[0], value: e[1] }))
        .forEach(param => customParams.push(param));

      onSuccess();
      return true;
    } catch (error) {
      onError("请输入正确的订阅地址!");
      return false;
    }
  };

  return {
    analyzeUrl,
    parseUrl
  };
}
