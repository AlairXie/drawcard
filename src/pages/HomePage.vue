<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import StreakBadge from '../components/StreakBadge.vue';
import { useGameStore } from '../stores/game';
import { DIRECTIONS, type CardDirection, type DurationMin } from '../types';

const store = useGameStore();
const router = useRouter();
const duration = ref<DurationMin>(10);

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

function switchMode(mode: 'mixed' | 'single') {
  store.setMode(mode);
}

function selectDirection(dir: CardDirection) {
  store.setDirection(dir);
}

function startMatch() {
  router.push({ path: '/draw', query: { duration: duration.value } });
}
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

  <div class="dashboard">
    <section class="hero">
      <h2>学习王者</h2>
      <p>抽卡开局 · 冲刺提交 · 连胜上段</p>
    </section>

    <!-- Mode Toggle -->
    <div class="mode-toggle">
      <button
        :class="['mode-btn', { active: store.mode === 'mixed' }]"
        @click="switchMode('mixed')"
      >
        🏆 混合排位
      </button>
      <button
        :class="['mode-btn', { active: store.mode === 'single' }]"
        @click="switchMode('single')"
      >
        ⚔ 专业巅峰
      </button>
    </div>

    <!-- Settings Card: Peak Mode -->
    <section class="settings-card" v-if="store.mode === 'single'">
      <p class="settings-title">⚔ 选择挑战领域 (专业方向)</p>
      <div class="direction-select">
        <select :value="store.selectedDirection" @change="selectDirection(($event.target as HTMLSelectElement).value as CardDirection)">
          <option v-for="d in DIRECTIONS" :key="d" :value="d">🔥 专项突破：{{ d }}</option>
        </select>
      </div>
      <div class="setting-row">
        <span>冲刺时长</span>
        <div class="duration-group">
          <button v-for="t in [3, 10, 15]" :key="t" class="duration-btn" :class="{ active: duration === t }" @click="duration = t as DurationMin">
            {{ t }}m
          </button>
        </div>
      </div>
    </section>

    <!-- Settings Card: Mixed Mode -->
    <section class="settings-card" v-else>
      <div class="setting-row">
        <span>冲刺时长</span>
        <div class="duration-group">
          <button v-for="t in [3, 10, 15]" :key="t" class="duration-btn" :class="{ active: duration === t }" @click="duration = t as DurationMin">
            {{ t }}m
          </button>
        </div>
      </div>
      <div class="setting-row">
        <span>随机机制</span>
        <span class="mode-text">全卡池盲抽（避免逃避）</span>
      </div>
    </section>

    <div class="home-actions">
      <button
        :class="['primary-cta', store.mode === 'single' ? 'cta-single' : 'cta-mixed']"
        @click="startMatch"
      >
        ▶ {{ store.mode === 'single' ? '开启巅峰挑战' : '开始排位匹配' }}
      </button>
      <button class="ghost-cta" @click="router.push('/pool')">管理卡池 ({{ store.enabledCards.length }}/{{ store.cards.length }})</button>
      <button class="ghost-cta" @click="router.push('/history')">历史战绩</button>
    </div>
  </div>
</template>
