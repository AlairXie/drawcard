<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import OutputForm from '../components/OutputForm.vue';
import { useGameStore } from '../stores/game';

const store = useGameStore();
const router = useRouter();

onMounted(() => {
  store.init();
  if (!store.todayState?.startedAt) router.replace('/draw');
});

function submit(payload: { outputText: string; outputLink?: string }) {
  const record = store.completeRun(payload);
  if (record) {
    sessionStorage.setItem('ss_last_result', record.id);
    router.push('/result');
  }
}
</script>

<template>
  <OutputForm @submit="submit" />
</template>
