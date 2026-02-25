<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{ submit: [{ outputText: string; outputLink?: string }] }>();
const outputText = ref('');
const outputLink = ref('');

function submit() {
  if (!outputText.value.trim()) return;
  emit('submit', { outputText: outputText.value.trim(), outputLink: outputLink.value.trim() || undefined });
}
</script>

<template>
  <div class="panel">
    <label>产出物（必填一行）</label>
    <textarea v-model="outputText" rows="4" placeholder="今天具体产出了什么？" />
    <label>链接/截图说明（可选）</label>
    <input v-model="outputLink" placeholder="https://... 或 '截图已保存到相册'" />
    <button @click="submit">提交并结算</button>
  </div>
</template>
