<template>
  <div class="page-container">
    <div class="header-section">
      <h1 class="page-title">Subscription Converter</h1>
      <div class="header-actions">
        <el-button link @click="goToProject" class="github-link">
          <svg-icon icon-class="github" style="font-size: 24px" />
        </el-button>
        <el-tag v-if="backendVersion" type="info" size="small" effect="plain" class="version-tag">
          {{ backendVersion }}
        </el-tag>
      </div>
    </div>

    <!-- Main Config Card -->
    <el-card class="main-card" shadow="never">
      <el-form :model="form" label-position="top">
        
        <!-- Mode Switcher -->
        <div class="mode-selector">
          <el-radio-group v-model="advanced" size="large" fill="#409eff">
            <el-radio-button label="1">基础模式</el-radio-button>
            <el-radio-button label="2">进阶模式</el-radio-button>
          </el-radio-group>
        </div>

        <!-- Section 1: Source & Client (Always Visible) -->
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24">
            <el-form-item label="订阅链接">
              <el-input
                v-model="form.sourceSubUrl"
                type="textarea"
                :rows="3"
                placeholder="支持订阅或 ss/ssr/vmess 链接，多个链接每行一个或用 | 分隔"
                @blur="saveSubUrl"
                resize="none"
              />
            </el-form-item>
          </el-col>
          
          <el-col :xs="24" :sm="24">
            <el-form-item label="客户端">
              <el-select v-model="form.clientType" placeholder="请选择客户端" style="width: 100%">
                <el-option-group v-for="group in clientGroups" :key="group.label" :label="group.label">
                  <el-option v-for="(v, k) in group.options" :key="k" :label="k" :value="v"></el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Section 2: Advanced Tabs (Visible in Advanced Mode) -->
        <div v-if="advanced === '2'" class="advanced-tabs-container">
          <el-tabs type="border-card" class="compact-tabs">
            
            <!-- Tab 1: Basic Config -->
            <el-tab-pane label="基础配置">
              <el-row :gutter="20">
                 <el-col :xs="24" :sm="12">
                   <el-form-item label="后端地址">
                      <el-autocomplete
                        v-model="form.customBackend"
                        :fetch-suggestions="backendSearch"
                        placeholder="默认后端"
                        style="width: 100%"
                      >
                         <template #append>
                           <el-button @click="gotoGayhub" icon="Link" />
                         </template>
                      </el-autocomplete>
                   </el-form-item>
                 </el-col>
                 <el-col :xs="24" :sm="12">
                   <el-form-item label="远程配置">
                      <el-select
                        v-model="form.remoteConfig"
                        allow-create
                        filterable
                        placeholder="选择远程配置"
                        style="width: 100%"
                      >
                        <el-option-group v-for="group in options.remoteConfig" :key="group.label" :label="group.label">
                          <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-option-group>
                      </el-select>
                   </el-form-item>
                 </el-col>
              </el-row>
              <div style="text-align: right; margin-top: -10px;">
                <el-button type="primary" link size="small" @click="gotoRemoteConfig">查看配置示例</el-button>
              </div>
            </el-tab-pane>

            <!-- Tab 2: Filters -->
            <el-tab-pane label="过滤规则">
              <el-row :gutter="20">
                <el-col :xs="24" :sm="8">
                  <el-form-item label="包含 (Include)">
                    <el-input v-model="form.includeRemarks" placeholder="正则关键字" clearable />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="8">
                  <el-form-item label="排除 (Exclude)">
                    <el-input v-model="form.excludeRemarks" placeholder="正则关键字" clearable />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="8">
                  <el-form-item label="文件名">
                    <el-input v-model="form.filename" placeholder="文件名" clearable />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-tab-pane>

             <!-- Tab 3: Node Modifiers (More Options) -->
            <el-tab-pane label="节点修饰">
               <el-space wrap :size="20" class="modifier-space">
                  <el-checkbox v-model="form.nodeList" label="输出 Node List" border size="small" />
                  <el-checkbox v-model="form.emoji" label="Emoji" border size="small" />
                  <el-checkbox v-model="form.scv" label="跳过证书验证" border size="small" />
                  <el-checkbox v-model="form.udp" @change="needUdp = true" label="启用 UDP" border size="small" />
                  <el-checkbox v-model="form.appendType" label="节点类型" border size="small" />
                  <el-checkbox v-model="form.sort" label="排序节点" border size="small" />
                  <el-checkbox v-model="form.fdn" label="过滤非法节点" border size="small" />
                  <el-checkbox v-model="form.expand" label="规则展开" border size="small" />
               </el-space>
            </el-tab-pane>

            <!-- Tab 4: Custom Features (Custom Setup) -->
            <el-tab-pane label="定制功能">
              <el-space wrap :size="20">
                 <el-checkbox v-model="form.tpl.surge.doh" label="Surge.DoH" border size="small" />
                 <el-checkbox v-model="form.tpl.clash.doh" label="Clash.DoH" border size="small" />
                 <el-checkbox v-model="form.insert" label="网易云" border size="small" />
              </el-space>
              
              <el-divider content-position="left" style="margin: 15px 0 10px 0">自定义参数</el-divider>
              
              <div v-for="(param, i) in customParams" :key="i" class="custom-param-row">
                <el-input v-model="param.name" placeholder="参数名" size="small" style="width: 120px">
                  <template #prefix>:</template>
                </el-input>
                <el-input v-model="param.value" placeholder="参数值" size="small" style="flex:1" />
                <el-button type="danger" icon="Delete" circle size="small" @click="customParams.splice(i, 1)" />
              </div>
              <el-button type="primary" link @click="handleAddCustomParam" icon="Plus" size="small">添加参数</el-button>
            </el-tab-pane>
          
          </el-tabs>
        </div>

        <!-- Action Bar -->
        <div class="action-bar">
          <el-button type="danger" size="large" class="main-btn" @click="makeUrlClick" :disabled="!canGenerateUrl">
            生成订阅链接
          </el-button>
          
          <div class="secondary-actions">

            <el-button type="default" icon="Upload" @click="dialogUploadConfigVisible = true">上传配置</el-button>
            <el-button type="default" icon="CopyDocument" @click="dialogLoadConfigVisible = true">从 URL 解析</el-button>
          </div>
        </div>

      </el-form>
    </el-card>

    <!-- Result Drawer -->
    <el-drawer
      v-model="drawerVisible"
      title="生成结果"
      direction="btt"
      size="50%"
      :with-header="true"
      custom-class="result-drawer"
    >
        <div class="result-content">
             <div class="result-item">
                <div class="label">定制订阅</div>
                <el-input v-model="customSubUrl" readonly>
                  <template #append>
                    <el-button @click="copyText(customSubUrl)" icon="DocumentCopy">复制</el-button>
                  </template>
                </el-input>
             </div>
             


             <div class="result-actions">
                 <el-button type="primary" plain size="large" @click="clashInstall" :disabled="!canImportClash" style="width: 100%">
                   一键导入 Clash
                 </el-button>
             </div>
        </div>
    </el-drawer>

    <!-- Helper Dialogs -->
    <ConfigUploadDialog
      :visible="dialogUploadConfigVisible"
      :upload-config="uploadConfig"
      :loading="loading"
      @cancel="handleUploadCancel"
      @confirm="handleConfigUpload"
    />

    <UrlParseDialog
      :visible="dialogLoadConfigVisible"
      :load-config="loadConfig"
      :loading="loading"
      @cancel="handleLoadCancel"
      @confirm="handleUrlParse"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, getCurrentInstance } from 'vue';
import { ElMessage, ElNotification } from 'element-plus';
import useClipboard from 'vue-clipboard3';
import { CONSTANTS } from '@/config/constants';
import { CLIENT_TYPES } from '@/config/client-types';
import { REMOTE_CONFIGS } from '@/config/remote-configs';
import { useSubscriptionForm, addCustomParam, saveSubUrl as saveSubscriptionUrl } from '@/composables/useSubscriptionForm';
import { useSubscription } from '@/composables/useSubscription';
import { useUrlParser } from '@/composables/useUrlParser';
import { getLocalStorageItem } from '@/utils/storage';
import { BackendService } from '@/services/backendService';

import { ConfigUploadService } from '@/services/configUploadService';
import ConfigUploadDialog from '@/components/ConfigUploadDialog.vue';
import UrlParseDialog from '@/components/UrlParseDialog.vue';
import { Link, Plus, Delete, Upload, CopyDocument, DocumentCopy, Select } from '@element-plus/icons-vue';

const { proxy } = getCurrentInstance()!;
const $axios = proxy!.$axios;
const { toClipboard } = useClipboard();

const { form, customParams, advanced, needUdp, customSubUrl } = useSubscriptionForm();
const { makeUrl } = useSubscription();
const { parseUrl } = useUrlParser();

const loading = ref(false);

const dialogUploadConfigVisible = ref(false);
const loadConfig = ref("");
const dialogLoadConfigVisible = ref(false);
const uploadConfig = ref("");
const backendVersion = ref("");
const isPC = ref(true);

// Result Drawer visibility
const drawerVisible = ref(false);

const options = reactive({
  clientTypes: CLIENT_TYPES,
  backendOptions: [{ value: "http://127.0.0.1:25500/sub?" }],
  remoteConfig: REMOTE_CONFIGS
});

// Client Grouping Logic
const quickClientKeys = ['Clash', 'Surge', 'QuantumultX', 'Loon', 'ss', 'V2Ray'];
const clientGroups = computed(() => {
  const hotClients: Record<string, string> = {};
  const otherClients: Record<string, string> = {};

  for (const [key, value] of Object.entries(options.clientTypes)) {
    const strValue = value as string;
    if (quickClientKeys.includes(key)) {
      hotClients[key] = strValue;
    } else {
      otherClients[key] = strValue;
    }
  }
  
  return [
    { label: '热门客户端 (Hot)', options: hotClients },
    { label: '更多客户端 (More)', options: otherClients }
  ];
});


const canGenerateUrl = computed(() => form.sourceSubUrl.length > 0 && form.clientType);
const canImportClash = computed(() => customSubUrl.value.length > 0);
const processedSubUrl = computed(() => form.sourceSubUrl.replace(/(\n|\r|\n\r)/g, "|"));
const currentBackend = computed(() => form.customBackend || CONSTANTS.DEFAULT_BACKEND);

const saveSubUrl = () => {
  saveSubscriptionUrl(form);
};

const handleAddCustomParam = () => {
  addCustomParam(customParams);
};

const copyText = async (text: string) => {
  try {
    await toClipboard(text);
    ElMessage.success("Copied!");
  } catch (e) {
    ElMessage.error("Copy failed");
  }
};

const goToProject = () => {
  window.open(CONSTANTS.PROJECT);
};

const gotoGayhub = () => {
  window.open(CONSTANTS.BACKEND_RELEASE);
};

const gotoRemoteConfig = () => {
  window.open(CONSTANTS.REMOTE_CONFIG_SAMPLE);
};

const clashInstall = () => {
  if (customSubUrl.value === "") {
    ElMessage.error("请先填写必填项，生成订阅链接");
    return;
  }
  const url = "clash://install-config?url=";
  window.open(
    url + encodeURIComponent(customSubUrl.value)
  );
};

const makeUrlClick = () => {
  const url = makeUrl(form, advanced.value, processedSubUrl.value, currentBackend.value, customParams.value, needUdp.value);
  if (url) {
    customSubUrl.value = url;
    drawerVisible.value = true; // Open drawer on success
    ElMessage.success("定制订阅已生成");
  } else {
    ElMessage.error("订阅链接与客户端为必填项");
  }
};



const confirmUploadConfig = () => {
  if (uploadConfig.value === "") {
    ElMessage.warning("远程配置不能为空");
    return;
  }
  loading.value = true;
  ConfigUploadService.uploadConfig($axios, uploadConfig.value)
    .then(res => {
      const result = ConfigUploadService.handleUploadSuccess(res, toClipboard, ElMessage);
      if (result.success) {
        form.remoteConfig = result.url;
        copyText(form.remoteConfig);
        dialogUploadConfigVisible.value = false;
        uploadConfig.value = "";
      }
    })
    .catch(error => {
      ElMessage.error("远程配置上传失败: " + error.message);
    })
    .finally(() => {
      loading.value = false;
    });
};

const handleUploadCancel = () => {
  uploadConfig.value = "";
  dialogUploadConfigVisible.value = false;
};

const handleConfigUpload = (configContent: string) => {
  uploadConfig.value = configContent;
  confirmUploadConfig();
};

const handleLoadCancel = () => {
  loadConfig.value = "";
  dialogLoadConfigVisible.value = false;
};

const confirmLoadConfig = () => {
  loading.value = true;
  parseUrl(
    loadConfig.value,
    form,
    customParams.value,
    () => {
      dialogLoadConfigVisible.value = false;
      loadConfig.value = "";
      ElMessage.success("长/短链接已成功解析为订阅信息");
    },
    (errorMsg) => {
      ElMessage.error(errorMsg);
    }
  ).then(() => {
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  });
};

const handleUrlParse = (url: string) => {
  loadConfig.value = url;
  confirmLoadConfig();
};

const backendSearchSuggestions = (queryString: string, backends: Array<{ value: string }>) => {
  if (queryString) {
    return backends.filter(backend => {
      return backend.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
    });
  }
  return backends;
};

const backendSearch = (queryString: string, cb: (results: any[]) => void) => {
  const results = backendSearchSuggestions(queryString, options.backendOptions);
  cb(results);
};

const getBackendVersion = async () => {
  backendVersion.value = await BackendService.getBackendVersion($axios);
};

const notify = () => {
  ElNotification({
    title: "免责声明",
    type: "warning",
    duration: 10000,
    dangerouslyUseHTMLString: true,
    message: '<div style="font-size: 13px; line-height: 1.5; color: #606266;">' +
             '<p><strong>1. 仅供学习研究</strong>：本项目严禁用于任何非法用途。</p>' +
             '<p><strong>2. 无服务提供</strong>：不提供任何后端服务或代理节点。</p>' +
             '<p><strong>3. 免责条款</strong>：使用者需自行承担风险，作者不承担任何法律责任。</p>' +
             '</div>'
  });
};

onMounted(() => {
  document.title = "Subscription Converter";
  isPC.value = proxy!.$getOS ? proxy!.$getOS().isPc : true;
  if (import.meta.env.VITE_USE_STORAGE === 'true') {
    const cachedUrl = getLocalStorageItem('sourceSubUrl');
    if (cachedUrl) {
      form.sourceSubUrl = cachedUrl as string;
    }
  }
  form.clientType = CONSTANTS.DEFAULT_CLIENT_TYPE;
  getBackendVersion();
  setTimeout(() => {
    notify();
  }, 1000);
});
</script>

<style scoped lang="scss">
.page-container {
  max-width: 720px;
  margin: 30px auto;
  padding: 0 16px;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .page-title {
    font-size: 24px;
    font-weight: 600;
    color: #303133;
    margin: 0;
  }
  
  .header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.main-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}

.mode-selector {
  text-align: center;
  margin-bottom: 24px;
}

.client-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 15px;
}

.client-card {
  position: relative;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  padding: 18px 0;
  text-align: center;
  cursor: pointer;
  background-color: #ffffff;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
  
  .client-name {
    font-size: 14px;
    font-weight: 500;
    color: #606266;
    transition: color 0.3s;
  }

  .check-icon {
    position: absolute;
    top: 6px;
    right: 6px;
    font-size: 14px;
    color: #409eff;
  }

  &:hover {
    border-color: #c6e2ff;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(64, 158, 255, 0.1);
    
    .client-name {
      color: #303133;
    }
  }

  &.active {
    border-color: #409eff;
    background-color: #ecf5ff;
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
    
    .client-name {
      color: #409eff;
      font-weight: 600;
    }
  }
}

.advanced-tabs-container {
  margin-top: 10px;
  margin-bottom: 20px;
}

.compact-tabs {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: none !important;
  border: 1px solid #e4e7ed;

  :deep(.el-tabs__header) {
    background-color: #f5f7fa;
  }

  :deep(.el-tabs__content) {
    padding: 15px;
  }
  
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}

.modifier-space {
  width: 100%;
}

.custom-param-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.action-bar {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  .main-btn {
    width: 200px;
    border-radius: 50px;
    box-shadow: 0 4px 10px rgba(245, 108, 108, 0.3);
  }
  
  .secondary-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
  }
}

.result-content {
  padding: 0 20px 20px;
}

.result-item {
  margin-bottom: 20px;
  
  .label {
    font-size: 14px;
    color: #606266;
    margin-bottom: 8px;
  }
}

.result-actions {
  margin-top: 30px;
}

/* Mobile */
@media (max-width: 600px) {
  .page-container {
    margin-top: 15px;
  }
  
  .main-btn {
    width: 100% !important;
  }
  
  .secondary-actions .el-button {
    flex: 1;
    margin: 0 !important;
  }
  
  .compact-tabs :deep(.el-tabs__item) {
    padding: 0 10px;
    font-size: 13px;
  }
}
</style>
