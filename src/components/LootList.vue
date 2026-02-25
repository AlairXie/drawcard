<script setup lang="ts">
import type { Card, RunRecord } from '../types';

const props = defineProps<{ records: RunRecord[]; cards: Card[] }>();

const cardMap = new Map(props.cards.map((c) => [c.id, c]));
</script>

<template>
  <div class="panel">
    <h3>📦 战利品历史</h3>
    <ul>
      <li v-for="record in [...records].reverse()" :key="record.id">
        {{ record.date }} · {{ cardMap.get(record.cardId)?.title || record.cardId }} · {{ record.score }} 分
        <div><small>{{ record.outputText }}</small></div>
      </li>
    </ul>
  </div>
</template>
