<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import LootList from '../components/LootList.vue';
import StreakBadge from '../components/StreakBadge.vue';
import { useGameStore } from '../stores/game';

const store = useGameStore();
const router = useRouter();

onMounted(() => store.init());

const historyTab = ref<'mixed' | 'peak'>(store.mode === 'single' ? 'peak' : 'mixed');

const hasShield = computed(() => {
  const today = new Date().toISOString().slice(0, 10);
  if (store.mode === 'single') {
    return store.peakStats[store.selectedDirection].lastShieldDate !== today;
  }
  return store.stats.lastShieldDate !== today;
});

const streak = computed(() => {
  if (store.mode === 'single') return store.currentPeakStreak;
  return store.stats.streak;
});

const filteredRecords = computed(() => {
  return historyTab.value === 'peak' ? store.peakRecords : store.mixedRecords;
});
</script>

<template>
  <StreakBadge
    :rank-name="store.rankName"
    :stars="store.stats.stars"
    :streak="streak"
    :has-shield="hasShield"
    :mode="store.mode"
    :peak-score="store.currentPeakScore"
  />

  <div class="history-page">
    <div class="pool-title-row">
      <h2>历史战绩</h2>
      <button class="close-btn" @click="router.push('/')">✕</button>
    </div>

    <!-- Mode Tabs -->
    <div class="history-tabs">
      <button :class="['history-tab', { active: historyTab === 'mixed' }]" @click="historyTab = 'mixed'">
        🏆 排位赛
      </button>
      <button :class="['history-tab', { active: historyTab === 'peak' }]" @click="historyTab = 'peak'">
        ⚔ 巅峰赛
      </button>
    </div>

    <LootList :records="filteredRecords" :cards="store.cards" :is-peak="historyTab === 'peak'" />
  </div>
</template>
