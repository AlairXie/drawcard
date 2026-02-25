<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';

const props = defineProps<{ endAt: number }>();
const emit = defineEmits<{ done: [] }>();
const now = ref(Date.now());
let iv: number | undefined;

const remainMs = computed(() => Math.max(0, props.endAt - now.value));
const formatted = computed(() => {
  const total = Math.floor(remainMs.value / 1000);
  const m = String(Math.floor(total / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return `${m}:${s}`;
});

onMounted(() => {
  iv = window.setInterval(() => {
    now.value = Date.now();
    if (remainMs.value <= 0) emit('done');
  }, 250);
});

onUnmounted(() => {
  if (iv) clearInterval(iv);
});
</script>

<template>
  <div class="panel">
    <div class="timer">{{ formatted }}</div>
  </div>
</template>
