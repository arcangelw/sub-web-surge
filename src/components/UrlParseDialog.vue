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
        解析 Subconverter 链接
      </div>
    </template>

    <el-form label-position="left" :inline="true">
      <el-form-item prop="loadConfig" label="订阅链接：" label-width="85px">
        <el-input v-model="localLoadConfig" style="width: 565px" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleConfirm" :disabled="localLoadConfig.length === 0">
          确 定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  visible: { type: Boolean, default: false },
  loadConfig: { type: String, default: '' },
  loading: { type: Boolean, default: false }
});

const emit = defineEmits(['update:visible', 'cancel', 'confirm']);

const localLoadConfig = ref(props.loadConfig);
const localVisible = ref(props.visible);

watch(() => props.loadConfig, (newVal: string) => {
  localLoadConfig.value = newVal;
});

watch(() => props.visible, (newVal: boolean) => {
  localVisible.value = newVal;
});

watch(localVisible, (newVal: boolean) => {
  emit('update:visible', newVal);
});

const handleCancel = () => {
  emit('cancel');
};

const handleConfirm = () => {
  emit('confirm', localLoadConfig.value);
};
</script>
