<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import CardManager from '../components/CardManager.vue';
import StreakBadge from '../components/StreakBadge.vue';
import { useGameStore } from '../stores/game';

const store = useGameStore();
const router = useRouter();

onMounted(() => store.init());
const hasShield = computed(() => store.stats.lastShieldDate !== new Date().toISOString().slice(0, 10));
</script>

<template>
  <StreakBadge :rank-name="store.rankName" :stars="store.stats.stars" :streak="store.stats.streak" :has-shield="hasShield" />
  <div class="pool-page">
    <div class="pool-title-row">
      <h2>↺ 今日卡池</h2>
      <button class="close-btn" @click="router.push('/')">✕</button>
    </div>
    <CardManager />
  </div>
</template>
