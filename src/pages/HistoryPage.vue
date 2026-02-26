<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import LootList from '../components/LootList.vue';
import StreakBadge from '../components/StreakBadge.vue';
import { useGameStore } from '../stores/game';

const store = useGameStore();
const router = useRouter();

onMounted(() => store.init());
const hasShield = computed(() => store.stats.lastShieldDate !== new Date().toISOString().slice(0, 10));
</script>

<template>
  <StreakBadge :rank-name="store.rankName" :stars="store.stats.stars" :streak="store.stats.streak" :has-shield="hasShield" />

  <div class="history-page">
    <div class="pool-title-row">
      <h2>历史战绩</h2>
      <button class="close-btn" @click="router.push('/')">✕</button>
    </div>

    <LootList :records="store.records" :cards="store.cards" />
  </div>
</template>
