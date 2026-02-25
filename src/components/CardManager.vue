<script setup lang="ts">
import { ref } from 'vue';
import { useGameStore } from '../stores/game';
import type { CardTier } from '../types';

const store = useGameStore();
const title = ref('');
const instruction = ref('');
const expectedOutputHint = ref('');
const tier = ref<CardTier>('M');
const tags = ref('');

function addCard() {
  if (!title.value.trim() || !instruction.value.trim()) return;
  store.upsertCard({
    title: title.value.trim(),
    instruction: instruction.value.trim(),
    expectedOutputHint: expectedOutputHint.value.trim() || '提交任意可见战利品。',
    tier: tier.value,
    tags: tags.value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  });
  title.value = '';
  instruction.value = '';
  expectedOutputHint.value = '';
  tags.value = '';
}
</script>

<template>
  <div class="panel">
    <h3>🃏 卡池管理（今日启用）</h3>
    <div class="row">
      <input v-model="title" placeholder="卡名" />
      <select v-model="tier">
        <option value="S">S</option>
        <option value="M">M</option>
        <option value="L">L</option>
      </select>
    </div>
    <input v-model="instruction" placeholder="最小行动描述（≤15 分钟）" />
    <input v-model="expectedOutputHint" placeholder="产出物提示" />
    <input v-model="tags" placeholder="标签（逗号分隔，可选）" />
    <button @click="addCard">新增卡牌</button>

    <ul>
      <li v-for="card in store.cards" :key="card.id">
        <input type="checkbox" :checked="card.enabledToday" @change="store.toggleCardEnabled(card.id)" />
        {{ card.title }} ({{ card.tier }})
        <button class="secondary" @click="store.removeCard(card.id)">删除</button>
      </li>
    </ul>
  </div>
</template>
