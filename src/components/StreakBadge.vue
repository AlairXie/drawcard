<script setup lang="ts">
defineProps<{ streak: number; level: number; xp: number }>();
</script>

<template>
  <div class="panel">
    <span class="badge">🔥 连胜 {{ streak }}</span>
    <span class="badge">⭐ Lv.{{ level }}</span>
    <span class="badge">XP {{ xp }}</span>
  </div>
</template>
