<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from './stores/game';

const store = useGameStore();
const appClass = computed(() => (store.mode === 'peak' ? 'pro' : ''));
</script>

<template>
  <div class="app-shell" :class="appClass">
    <router-view />
  </div>
</template>
