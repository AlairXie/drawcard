<script setup lang="ts">
import type { Card } from '../types';
defineProps<{ card: Card }>();
</script>

<template>
  <div class="panel">
    <div class="row"><strong>{{ card.title }}</strong> <span class="badge">{{ card.tier }}</span></div>
    <p>{{ card.instruction }}</p>
    <small>产出提示：{{ card.expectedOutputHint }}</small>
  </div>
</template>
