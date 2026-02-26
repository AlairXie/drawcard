<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import OutputForm from '../components/OutputForm.vue';
import StreakBadge from '../components/StreakBadge.vue';
import { useGameStore } from '../stores/game';

const store = useGameStore();
const router = useRouter();

onMounted(() => {
  store.init();
  if (!store.todayState?.startedAt) router.replace('/');
});

function submit(payload: { outputText: string; outputLink?: string; screenshotNote?: string; filePath?: string }) {
  const record = store.settleRun({ ...payload, outcome: 'win' });
  if (record) {
    sessionStorage.setItem('ss_last_result', record.id);
    router.push('/result');
  }
}

const runMode = computed(() => store.todayState?.mode ?? store.mode);

const hasShield = computed(() => {
  const today = new Date().toISOString().slice(0, 10);
  if (runMode.value === 'single' && store.todayState?.direction) {
    return store.peakStats[store.todayState.direction].lastShieldDate !== today;
  }
  return store.stats.lastShieldDate !== today;
});

const streak = computed(() => {
  if (runMode.value === 'single' && store.todayState?.direction) {
    return store.peakStats[store.todayState.direction].streak;
  }
  return store.stats.streak;
});

const peakScore = computed(() => {
  if (runMode.value === 'single' && store.todayState?.direction) {
    return store.peakStats[store.todayState.direction].score;
  }
  return store.currentPeakScore;
});
</script>

<template>
  <StreakBadge
    :rank-name="store.rankName"
    :stars="store.stats.stars"
    :streak="streak"
    :has-shield="hasShield"
    :mode="runMode"
    :peak-score="peakScore"
  />

  <div class="submit-page" v-if="store.todayState?.card">
    <h2>提交战利品</h2>
    <p>证明你完成了【{{ store.todayState.card.title }}】</p>
    <OutputForm :hint="store.todayState.card.expectedOutputHint" @submit="submit" />
  </div>
</template>
