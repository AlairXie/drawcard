<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ hint?: string }>();
const emit = defineEmits<{ submit: [{ outputText: string; outputLink?: string; screenshotNote?: string; filePath?: string }] }>();
const outputText = ref('');

function submit() {
  if (!outputText.value.trim()) return;
  emit('submit', { outputText: outputText.value.trim() });
}
</script>

<template>
  <div class="submit-form">
    <textarea v-model="outputText" rows="8" :placeholder="hint || '在此输入文本、链接或描述截图位置...'" />
    <p>* MVP阶段暂不支持图片上传，请用文字描述。例如：“已改好，保存在D盘简历.pdf”</p>
    <button @click="submit">提交结算</button>
  </div>
</template>
