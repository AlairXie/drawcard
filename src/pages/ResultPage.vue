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

const hasShield = computed(() => store.stats.lastShieldDate !== new Date().toISOString().slice(0, 10));
</script>

<template>
  <StreakBadge :rank-name="store.rankName" :stars="store.stats.stars" :streak="store.stats.streak" :has-shield="hasShield" />

  <div v-if="record" class="result-page" :class="record.result === 'win' ? 'win' : 'lose'">
    <h1>{{ record.result === 'win' ? 'VICTORY' : 'DEFEAT' }}</h1>
    <div class="result-card">
      <p>{{ store.rankName }}</p>
      <p>{{ record.starDelta > 0 ? '+1 星' : record.starDelta < 0 ? '-1 星' : '触发保星，不掉星！' }}</p>
      <p class="next-step">{{ store.nextStep(record.outputText.slice(0, 12)) }}</p>
    </div>
    <button class="ghost-cta" @click="router.push('/')">返回大厅</button>
  </div>
</template>
