<script setup lang="ts">
import { computed } from 'vue';
import type { Card, RunRecord } from '../types';

const props = defineProps<{ records: RunRecord[]; cards: Card[] }>();
const cardMap = computed(() => new Map(props.cards.map((c) => [c.id, c])));
const reversedRecords = computed(() => [...props.records].reverse());
</script>

<template>
  <div class="history-list-wrap">
    <p v-if="!records.length" class="empty-history">还没有历史记录，先开一局吧。</p>

    <ul v-else class="history-list">
      <li v-for="record in reversedRecords" :key="record.id" class="history-item">
        <div class="history-item-top">
          <strong>{{ cardMap.get(record.cardId)?.title || '未知卡牌' }}</strong>
          <span :class="['result-badge', record.result === 'win' ? 'win' : 'lose']">
            {{ record.result === 'win' ? '胜利' : '败北' }}
          </span>
        </div>
        <p class="history-meta">{{ record.date }} · {{ record.durationMin }} 分钟 · {{ record.starDelta > 0 ? '+1★' : record.starDelta < 0 ? '-1★' : '保星' }}</p>
        <p class="history-loot">战利品：{{ record.outputText }}</p>
      </li>
    </ul>
  </div>
</template>
