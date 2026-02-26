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

const isPeak = computed(() => record.value?.gameMode === 'single');

const hasShield = computed(() => {
  const today = new Date().toISOString().slice(0, 10);
  if (store.mode === 'single') {
    return store.peakStats[store.selectedDirection].lastShieldDate !== today;
  }
  return store.stats.lastShieldDate !== today;
});

const streak = computed(() => {
  if (isPeak.value && record.value?.direction) {
    return store.peakStats[record.value.direction].streak;
  }
  return store.stats.streak;
});

const displayMode = computed(() => isPeak.value ? 'single' as const : 'mixed' as const);

const peakScoreForHeader = computed(() => {
  if (isPeak.value && record.value?.direction) {
    return store.peakStats[record.value.direction].score;
  }
  return store.currentPeakScore;
});

function peakDeltaText(delta: number | undefined): string {
  if (delta === undefined) return '';
  if (delta === 0) return '巅峰保护，不扣分！';
  return delta > 0 ? `+${delta} 分` : `${delta} 分`;
}
</script>

<template>
  <StreakBadge
    :rank-name="store.rankName"
    :stars="store.stats.stars"
    :streak="streak"
    :has-shield="hasShield"
    :mode="displayMode"
    :peak-score="peakScoreForHeader"
  />

  <div v-if="record" class="result-page" :class="record.result === 'win' ? 'win' : 'lose'">
    <h1>{{ record.result === 'win' ? 'VICTORY' : 'DEFEAT' }}</h1>

    <div class="result-card">
      <!-- Mixed mode: show rank + stars -->
      <template v-if="!isPeak">
        <p class="rank-label">{{ record.rankName }}</p>
        <div class="result-stars">
          <span v-for="i in 3" :key="i" :class="['star', { filled: i <= record.stars }]">★</span>
        </div>
        <p class="star-delta" :class="{ down: record.starDelta < 0, shield: record.starDelta === 0 }">
          {{ record.starDelta > 0 ? '+1 星' : record.starDelta < 0 ? '-1 星' : '触发保星，不掉星！' }}
        </p>
      </template>

      <!-- Peak mode: show direction + score -->
      <template v-else>
        <p class="rank-label peak-dir-label">{{ record.direction }}</p>
        <p class="peak-score-display">{{ record.peakScore ?? 0 }}</p>
        <p class="star-delta" :class="{ down: (record.peakDelta ?? 0) < 0, up: (record.peakDelta ?? 0) > 0, shield: record.peakDelta === 0 }">
          {{ peakDeltaText(record.peakDelta) }}
        </p>
      </template>

      <p class="next-step">{{ store.nextStep(record.outputText.slice(0, 12)) }}</p>
    </div>
    <button class="ghost-cta" @click="router.push('/')">返回大厅</button>
  </div>
</template>
