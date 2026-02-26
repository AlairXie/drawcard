<template>
  <div class="app-shell">
    <router-view />
    <PwaUpdatePrompt />
  </div>
</template>

<script setup lang="ts">
import PwaUpdatePrompt from './components/PwaUpdatePrompt.vue';
</script>
