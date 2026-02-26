<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import StreakBadge from '../components/StreakBadge.vue';
import { useGameStore } from '../stores/game';
import type { DurationMin, GameMode } from '../types';

const store = useGameStore();
const router = useRouter();
const duration = ref<DurationMin>(10);

onMounted(() => store.init());

const hasShield = computed(() => store.stats.lastShieldDate !== new Date().toISOString().slice(0, 10));
const canStart = computed(() => store.mode === 'mixed' || Boolean(store.selectedTag));

function switchMode(mode: GameMode) {
  store.setMode(mode);
}
</script>

<template>
  <StreakBadge
    :rank-name="store.rankName"
    :stars="store.stats.stars"
    :streak="store.stats.streak"
    :has-shield="hasShield"
    :mode="store.mode"
    :peak-score="store.currentPeakScore"
  />

  <div class="dashboard" :class="{ 'peak-theme': store.mode === 'peak' }">
    <section class="hero">
      <h2>学习王者</h2>
      <p>抽卡开局 · 冲刺提交 · 连胜上段</p>
    </section>

    <section class="mode-switch">
      <button class="mode-btn" :class="{ active: store.mode === 'mixed' }" @click="switchMode('mixed')">👑 混合排位</button>
      <button class="mode-btn" :class="{ active: store.mode === 'peak' }" @click="switchMode('peak')">⚔ 专业巅峰</button>
    </section>

    <section class="settings-card">
      <div v-if="store.mode === 'peak'" class="setting-row field-row">
        <label for="tagSelect">选择挑战领域（专业方向）</label>
        <select id="tagSelect" :value="store.selectedTag" @change="store.setSelectedTag(($event.target as HTMLSelectElement).value)">
          <option value="">请选择专业方向</option>
          <option v-for="tag in store.availableTags" :key="tag" :value="tag">{{ tag }}</option>
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

    <div class="home-actions">
      <button class="primary-cta" :disabled="!canStart" @click="router.push({ path: '/draw', query: { duration } })">
        ▶ {{ store.mode === 'peak' ? '开启巅峰挑战' : '开始匹配' }}
      </button>
      <button class="ghost-cta" @click="router.push('/pool')">管理卡池 ({{ store.enabledCards.length }}/{{ store.cards.length }})</button>
      <button class="history-cta" @click="router.push('/history')">历史战绩</button>
    </div>
  </div>
</template>
