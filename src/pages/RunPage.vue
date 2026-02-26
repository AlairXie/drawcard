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

const hasShield = computed(() => store.stats.lastShieldDate !== new Date().toISOString().slice(0, 10));
</script>

<template>
  <StreakBadge :rank-name="store.rankName" :stars="store.stats.stars" :streak="store.stats.streak" :has-shield="hasShield" :mode="store.mode" :peak-score="store.currentPeakScore" />

  <div class="battle-page" v-if="store.todayState?.card && store.todayState?.endAt">
    <Timer :end-at="store.todayState.endAt" @done="done" />
    <CardView :card="store.todayState.card" />

    <div class="battle-actions">
      <button class="giveup-btn" @click="goDefeat">✕ 放弃 (可能掉星)</button>
      <button class="finish-btn" @click="earlyFinish">✓ 提前完成</button>
    </div>
  </div>
</template>
