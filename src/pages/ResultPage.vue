<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import StreakBadge from '../components/StreakBadge.vue';
import { useGameStore } from '../stores/game';

const store = useGameStore();
const router = useRouter();

onMounted(() => store.init());

const record = computed(() => {
  const id = sessionStorage.getItem('ss_last_result');
  if (!id) return store.lastRecord;
  return store.records.find((r) => r.id === id) ?? store.lastRecord;
});

const nextStep = computed(() => (record.value ? store.nextStepByTier(record.value.cardTier) : '明天先打开应用，完成 30 秒开局。'));
</script>

<template>
  <StreakBadge :streak="store.stats.streak" :level="store.stats.level" :xp="store.stats.xp" />

  <div v-if="record" class="panel">
    <h3>✅ 本局完成</h3>
    <p>得分：<strong>{{ record.score }}</strong></p>
    <p>产出物：{{ record.outputText }}</p>
    <p>明天 30 秒下一步：{{ nextStep }}</p>
    <button @click="router.push('/draw')">再来一局</button>
    <button class="secondary" @click="router.push('/history')">查看战利品</button>
  </div>
</template>
