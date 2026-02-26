<script setup lang="ts">
import { useGameStore } from '../stores/game';

const store = useGameStore();
</script>

<template>
  <div class="pool-list">
    <div v-for="card in store.cards" :key="card.id" class="pool-item" :class="{ disabled: !card.enabledToday }">
      <div>
        <h3>{{ card.title }}</h3>
        <p>{{ card.instruction }}</p>
      </div>
      <label class="toggle-switch">
        <input type="checkbox" :checked="card.enabledToday" @change="store.toggleCardEnabled(card.id)" />
        <span></span>
      </label>
    </div>

    <button class="add-card-btn" type="button">＋ 新增最小行动 (MVP)</button>
  </div>
</template>
