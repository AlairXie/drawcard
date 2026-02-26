<script setup lang="ts">
defineProps<{ rankName: string; stars: number; streak: number; hasShield: boolean }>();
</script>

<template>
  <header class="player-header">
    <div class="rank-block">
      <div class="rank-icon">🏆</div>
      <div>
        <p class="rank-name">{{ rankName }}</p>
        <div class="stars">
          <span v-for="i in 3" :key="i" :class="['star', { filled: i <= stars }]">★</span>
        </div>
      </div>
    </div>

    <div class="status-block">
      <div v-if="hasShield" class="shield-pill">🛡 今日保星</div>
      <div class="streak-pill">🔥 {{ streak }} 连胜</div>
    </div>
  </header>
</template>
