<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGameStore } from '../stores/game';
import type { DurationMin } from '../types';

const store = useGameStore();
const router = useRouter();
const route = useRoute();

onMounted(() => {
  store.init();
  const duration = Number(route.query.duration ?? 10) as DurationMin;
  store.pickCard(duration, false);
  setTimeout(() => {
    store.startRun();
    router.replace('/run');
  }, 1500);
});
</script>

<template>
  <div class="matching-page">
    <div class="matching-ring">
      <div class="ring pulse"></div>
      <div class="ring spin"></div>
      <span>匹配中...</span>
    </div>
    <p>正在为你抽取命运的卡牌</p>
  </div>
</template>
