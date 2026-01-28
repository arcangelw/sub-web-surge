<template>
  <el-dialog
    v-model="localVisible"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="700px"
  >
    <template #title>
      <div>
        Remote config upload
        <el-popover trigger="hover" placement="right" style="margin-left: 10px">
          <el-link type="primary" :href="sampleConfig" target="_blank" icon="el-icon-info">参考配置</el-link>
          <template #reference>
            <i class="el-icon-question"></i>
          </template>
        </el-popover>
      </div>
    </template>

    <el-form label-position="left">
      <el-form-item prop="uploadConfig">
        <el-input
          v-model="localUploadConfig"
          type="textarea"
          :autosize="{ minRows: 15, maxRows: 30 }"
          maxlength="10000"
          show-word-limit
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleConfirm" :disabled="localUploadConfig.length === 0">
          确 定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { CONSTANTS } from '@/config/constants';

const props = defineProps({
  visible: { type: Boolean, default: false },
  uploadConfig: { type: String, default: '' },
  loading: { type: Boolean, default: false }
});

const emit = defineEmits(['update:visible', 'cancel', 'confirm']);

const sampleConfig = CONSTANTS.REMOTE_CONFIG_SAMPLE;
const localUploadConfig = ref(props.uploadConfig);
const localVisible = ref(props.visible);

// 监听 props.uploadConfig 变化
watch(() => props.uploadConfig, (newVal: string) => {
  localUploadConfig.value = newVal;
});

// 监听 props.visible 变化
watch(() => props.visible, (newVal: boolean) => {
  localVisible.value = newVal;
});

// 监听 localVisible 变化并通知父组件
watch(localVisible, (newVal: boolean) => {
  emit('update:visible', newVal);
});

// 取消操作
const handleCancel = () => {
  emit('cancel');
};

// 确认上传
const handleConfirm = () => {
  emit('confirm', localUploadConfig.value);
};
</script>
