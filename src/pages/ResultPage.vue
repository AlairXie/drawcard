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
const isPeakRecord = computed(() => record.value?.mode === 'peak');
const peakTitle = computed(() => (record.value?.selectedTag ? `${record.value.selectedTag} · 巅峰积分` : '巅峰赛积分'));
</script>

<template>
  <StreakBadge
    :rank-name="store.rankName"
    :stars="store.stats.stars"
    :streak="store.stats.streak"
    :has-shield="hasShield"
    :mode="isPeakRecord ? 'peak' : 'mixed'"
    :peak-score="record?.peakScore ?? 0"
  />

  <div v-if="record" class="result-page" :class="[record.result === 'win' ? 'win' : 'lose', { 'peak-theme': isPeakRecord }]">
    <h1>{{ record.result === 'win' ? 'VICTORY' : 'DEFEAT' }}</h1>
    <div class="result-card">
      <template v-if="isPeakRecord">
        <p class="rank-label peak-label">{{ peakTitle }}</p>
        <p class="peak-score-value">{{ record.peakScore }}</p>
        <p class="star-delta" :class="{ down: record.peakDelta < 0, shield: record.peakDelta === 0 }">
          {{ record.peakDelta > 0 ? `+ ${record.peakDelta} 巅峰表现分` : record.peakDelta < 0 ? `${record.peakDelta} 巅峰表现分` : '触发巅峰保护，不扣分！' }}
        </p>
      </template>
      <template v-else>
        <p class="rank-label">{{ store.rankName }}</p>
        <div class="result-stars">
          <span v-for="i in 3" :key="i" :class="['star', { filled: i <= record.stars }]">★</span>
        </div>
        <p class="star-delta" :class="{ down: record.starDelta < 0, shield: record.starDelta === 0 }">
          {{ record.starDelta > 0 ? '+1 星' : record.starDelta < 0 ? '-1 星' : '触发保星，不掉星！' }}
        </p>
      </template>
      <p class="next-step">{{ store.nextStep(record.outputText.slice(0, 12)) }}</p>
    </div>
    <button class="ghost-cta" @click="router.push('/')">返回大厅</button>
  </div>
</template>
