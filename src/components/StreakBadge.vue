<script setup lang="ts">
defineProps<{ rankName: string; stars: number; streak: number; coins: number; xp: number }>();
</script>

<template>
  <div class="panel">
    <span class="badge">🏆 段位 {{ rankName }}</span>
    <span class="badge">⭐ {{ stars }}/3</span>
    <span class="badge">🔥 连胜 {{ streak }}</span>
    <span class="badge">🪙 {{ coins }}</span>
    <span class="badge">✨ XP {{ xp }}</span>
  </div>
</template>
