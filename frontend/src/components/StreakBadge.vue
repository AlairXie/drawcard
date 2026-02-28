<script setup lang="ts">
import type { GameMode } from '../types';

defineProps<{
  rankName: string;
  stars: number;
  streak: number;
  hasShield: boolean;
  mode?: GameMode;
  peakScore?: number;
}>();
</script>

<template>
  <header class="player-header" :class="mode === 'single' ? 'mode-single' : 'mode-mixed'">
    <div class="rank-block">
      <div class="rank-icon">{{ mode === 'single' ? '⚔' : '🏆' }}</div>
      <div v-if="mode === 'single'">
        <p class="rank-label-sub">巅峰积分</p>
        <p class="rank-name xp-value">{{ peakScore ?? 0 }}</p>
      </div>
      <div v-else>
        <p class="rank-name">{{ rankName }}</p>
        <div class="stars">
          <span v-for="i in 3" :key="i" :class="['star', { filled: i <= stars }]">★</span>
        </div>
      </div>
    </div>

    <div class="status-block">
      <div v-if="hasShield" class="shield-pill">
        {{ mode === 'single' ? '◇ 巅峰保护' : '◇ 今日保星' }}
      </div>
      <div class="streak-pill">🔥 {{ streak }} 连胜</div>
    </div>
  </header>
</template>
