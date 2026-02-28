<script setup lang="ts">
import type { Card } from '../types';
defineProps<{ card: Card }>();
</script>

<template>
  <div class="battle-card">
    <div class="card-tag">{{ card.tags?.[0] || card.tier }}</div>
    <h2>{{ card.title }}</h2>
    <p>{{ card.instruction }}</p>
    <div class="output-box">
      <small>产出要求：</small>
      <div>{{ card.expectedOutputHint }}</div>
    </div>
  </div>
</template>
