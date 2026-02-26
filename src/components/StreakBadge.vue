<script setup lang="ts">
withDefaults(
  defineProps<{ rankName: string; stars: number; streak: number; hasShield: boolean; mode?: 'mixed' | 'peak'; peakScore?: number }>(),
  {
    mode: 'mixed',
    peakScore: 0
  }
);
</script>

<template>
  <header class="player-header" :class="{ peak: mode === 'peak' }">
    <div class="rank-block">
      <div class="rank-icon">{{ mode === 'peak' ? '🎖' : '🏆' }}</div>
      <div v-if="mode === 'peak'">
        <p class="peak-title">巅峰积分</p>
        <p class="peak-score">{{ peakScore }}</p>
      </div>
      <div v-else>
        <p class="rank-name">{{ rankName }}</p>
        <div class="stars">
          <span v-for="i in 3" :key="i" :class="['star', { filled: i <= stars }]">★</span>
        </div>
      </div>
    </div>

    <div class="status-block">
      <div v-if="hasShield" class="shield-pill">🛡 {{ mode === 'peak' ? '巅峰保护' : '今日保星' }}</div>
      <div class="streak-pill">🔥 {{ streak }} 连胜</div>
    </div>
  </header>
</template>
