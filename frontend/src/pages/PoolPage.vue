<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import CardManager from '../components/CardManager.vue';
import StreakBadge from '../components/StreakBadge.vue';
import { useGameStore } from '../stores/game';
import { DIRECTIONS, type CardDirection } from '../types';

const store = useGameStore();
const router = useRouter();

onMounted(() => store.init());

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

type TabValue = '混合' | CardDirection;
const activeTab = ref<TabValue>('混合');
const tabs: TabValue[] = ['混合', ...DIRECTIONS];

const filteredCards = computed(() => {
  if (activeTab.value === '混合') return store.cards;
  return store.cards.filter((c) => c.direction === activeTab.value);
});

const enabledCount = computed(() => filteredCards.value.filter((c) => c.enabledToday).length);
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
  <div class="pool-page">
    <div class="pool-title-row">
      <h2>我的卡池</h2>
      <button class="close-btn" @click="router.push('/')">✕</button>
    </div>

    <!-- Direction Tabs -->
    <div class="pool-tabs">
      <button
        v-for="tab in tabs"
        :key="tab"
        :class="['pool-tab', { active: activeTab === tab }]"
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>
    </div>

    <p class="pool-summary">已启用 {{ enabledCount }} / {{ filteredCards.length }} 张</p>

    <CardManager :cards="filteredCards" :active-tab="activeTab" />
  </div>
</template>
