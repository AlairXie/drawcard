<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useGameStore } from '../stores/game';
import { DIRECTIONS, type Card, type CardDirection } from '../types';

const props = defineProps<{
  cards: Card[];
  activeTab: '混合' | CardDirection;
}>();

const store = useGameStore();

const isCreating = ref(false);
const newCard = reactive({
  title: '',
  instruction: '',
  expectedOutputHint: '',
  tier: 'S' as 'S' | 'M' | 'L',
  direction: '职业发展' as CardDirection,
  tagsText: ''
});

function resetForm() {
  newCard.title = '';
  newCard.instruction = '';
  newCard.expectedOutputHint = '';
  newCard.tier = 'S';
  newCard.direction = props.activeTab !== '混合' ? props.activeTab : '职业发展';
  newCard.tagsText = '';
}

function openCreate() {
  resetForm();
  isCreating.value = true;
}

function submitCard() {
  if (!newCard.title.trim() || !newCard.instruction.trim() || !newCard.expectedOutputHint.trim()) return;
  const tags = newCard.tagsText
    .split(/[,，\s]+/)
    .map((tag) => tag.trim())
    .filter(Boolean);
  store.upsertCard({
    title: newCard.title.trim(),
    instruction: newCard.instruction.trim(),
    expectedOutputHint: newCard.expectedOutputHint.trim(),
    tier: newCard.tier,
    direction: newCard.direction,
    tags
  });
  isCreating.value = false;
  resetForm();
}
</script>

<template>
  <div class="pool-list">
    <div v-for="card in cards" :key="card.id" class="pool-item" :class="{ disabled: !card.enabledToday }">
      <div class="pool-item-body">
        <div class="pool-item-head">
          <h3>{{ card.title }}</h3>
          <span class="direction-tag">{{ card.direction }}</span>
        </div>
        <p>{{ card.instruction }}</p>
      </div>
      <div class="pool-actions">
        <label class="toggle-switch">
          <input type="checkbox" :checked="card.enabledToday" @change="store.toggleCardEnabled(card.id)" />
          <span></span>
        </label>
        <button class="delete-btn" type="button" @click="store.removeCard(card.id)">删除</button>
      </div>
    </div>

    <div v-if="isCreating" class="create-card-panel">
      <input v-model="newCard.title" type="text" placeholder="最小行动标题（如：写1句总结）" />
      <textarea v-model="newCard.instruction" rows="3" placeholder="行动说明" />
      <input v-model="newCard.expectedOutputHint" type="text" placeholder="产出提示（如：粘贴修改后的句子）" />
      <input v-model="newCard.tagsText" type="text" placeholder="标签（可选，逗号分隔）" />
      <div class="tier-row">
        <span>难度</span>
        <div class="tier-buttons">
          <button type="button" :class="{ active: newCard.tier === 'S' }" @click="newCard.tier = 'S'">S</button>
          <button type="button" :class="{ active: newCard.tier === 'M' }" @click="newCard.tier = 'M'">M</button>
          <button type="button" :class="{ active: newCard.tier === 'L' }" @click="newCard.tier = 'L'">L</button>
        </div>
      </div>
      <div class="tier-row">
        <span>方向</span>
        <div class="tier-buttons direction-buttons">
          <button
            v-for="d in DIRECTIONS"
            :key="d"
            type="button"
            :class="{ active: newCard.direction === d }"
            @click="newCard.direction = d"
          >{{ d }}</button>
        </div>
      </div>
      <div class="create-actions">
        <button type="button" class="cancel-btn" @click="isCreating = false">取消</button>
        <button type="button" class="confirm-btn" @click="submitCard">保存</button>
      </div>
    </div>

    <button class="add-card-btn" type="button" @click="openCreate">
      {{ isCreating ? '收起新增面板' : '＋ 新增最小行动' }}
    </button>
  </div>
</template>
