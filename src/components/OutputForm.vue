<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{ submit: [{ outputText: string; outputLink?: string; screenshotNote?: string; filePath?: string }] }>();
const outputText = ref('');
const outputLink = ref('');
const screenshotNote = ref('');
const filePath = ref('');

function submit() {
  if (!outputText.value.trim()) return;
  emit('submit', {
    outputText: outputText.value.trim(),
    outputLink: outputLink.value.trim() || undefined,
    screenshotNote: screenshotNote.value.trim() || undefined,
    filePath: filePath.value.trim() || undefined
  });
}
</script>

<template>
  <div class="panel">
    <label>文本战利品（必填，至少 1 行）</label>
    <textarea v-model="outputText" rows="3" placeholder="今天完成了什么最小行动？" />
    <label>链接（可选）</label>
    <input v-model="outputLink" placeholder="https://..." />
    <label>截图说明（可选）</label>
    <input v-model="screenshotNote" placeholder="例如：IMG_2048 在相册/学习王者文件夹" />
    <label>文件名/路径（可选）</label>
    <input v-model="filePath" placeholder="例如：notes/resume-v2.md" />
    <button @click="submit">提交战利品并结算</button>
  </div>
</template>
