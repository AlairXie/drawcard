<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import CardView from '../components/CardView.vue';
import StreakBadge from '../components/StreakBadge.vue';
import Timer from '../components/Timer.vue';
import { useGameStore } from '../stores/game';

const router = useRouter();
const store = useGameStore();

onMounted(() => {
  store.init();
  if (!store.todayState?.endAt) router.replace('/');
});

function done() {
  goDefeat();
}

function earlyFinish() {
  router.push('/submit');
}

function goDefeat() {
  const record = store.abandonRun();
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

  <div class="battle-page" v-if="store.todayState?.card && store.todayState?.endAt">
    <Timer :end-at="store.todayState.endAt" @done="done" />
    <CardView :card="store.todayState.card" />

    <div class="battle-actions">
      <button class="giveup-btn" @click="goDefeat">
        ✕ 放弃 {{ runMode === 'single' ? '(可能扣分)' : '(可能掉星)' }}
      </button>
      <button class="finish-btn" @click="earlyFinish">✓ 提前完成</button>
    </div>
  </div>
</template>
