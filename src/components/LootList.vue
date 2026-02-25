<script setup lang="ts">
import { computed } from 'vue';
import type { Card, RunRecord } from '../types';

const props = defineProps<{ records: RunRecord[]; cards: Card[] }>();
const cardMap = computed(() => new Map(props.cards.map((c) => [c.id, c])));
</script>

<template>
  <div class="panel">
    <h3>📦 历史战绩</h3>
    <ul>
      <li v-for="record in [...records].reverse()" :key="record.id">
        {{ record.date }} · {{ cardMap.get(record.cardId)?.title || record.cardId }} ·
        <strong>{{ record.result === 'win' ? '胜利' : '败北' }}</strong>
        · {{ record.starDelta > 0 ? '+1★' : record.starDelta < 0 ? '-1★' : '保星' }}
        <div><small>战利品：{{ record.outputText }}</small></div>
      </li>
    </ul>
  </div>
</template>
