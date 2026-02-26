<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import StreakBadge from '../components/StreakBadge.vue';
import { useGameStore } from '../stores/game';
import type { DurationMin } from '../types';

const store = useGameStore();
const router = useRouter();
const duration = ref<DurationMin>(10);

onMounted(() => store.init());

const hasShield = computed(() => store.stats.lastShieldDate !== new Date().toISOString().slice(0, 10));
</script>

<template>
  <StreakBadge :rank-name="store.rankName" :stars="store.stats.stars" :streak="store.stats.streak" :has-shield="hasShield" />

  <div class="dashboard">
    <section class="hero">
      <h2>学习王者</h2>
      <p>抽卡开局 · 冲刺提交 · 连胜上段</p>
    </section>

    <section class="settings-card">
      <div class="setting-row">
        <span>冲刺时长</span>
        <div class="duration-group">
          <button v-for="t in [3, 10, 15]" :key="t" class="duration-btn" :class="{ active: duration === t }" @click="duration = t as DurationMin">
            {{ t }}m
          </button>
        </div>
      </div>
      <div class="setting-row">
        <span>卡池模式</span>
        <span class="mode-text">混合模式 (默认)</span>
      </div>
    </section>

    <div class="home-actions">
      <button class="primary-cta" @click="router.push({ path: '/draw', query: { duration } })">▶ 开始匹配</button>
      <button class="ghost-cta" @click="router.push('/pool')">管理卡池 ({{ store.enabledCards.length }}/{{ store.cards.length }})</button>
      <button class="history-cta" @click="router.push('/history')">历史战绩</button>
    </div>
  </div>
</template>
