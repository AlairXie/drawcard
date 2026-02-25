<script setup lang="ts">
import type { Card } from '../types';
defineProps<{ card: Card }>();
</script>

<template>
  <div class="panel">
    <div class="row"><strong>{{ card.title }}</strong> <span class="badge">{{ card.tier }}</span></div>
    <p>{{ card.instruction }}</p>
    <small>产出提示：{{ card.expectedOutputHint }}</small>
    <div v-if="card.tags?.length" class="row">
      <small v-for="tag in card.tags" :key="tag" class="badge">#{{ tag }}</small>
    </div>
  </div>
</template>
