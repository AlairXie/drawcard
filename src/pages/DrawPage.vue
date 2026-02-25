<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import CardView from '../components/CardView.vue';
import { useGameStore } from '../stores/game';
import type { DurationMin } from '../types';

const store = useGameStore();
const router = useRouter();
const duration = ref<DurationMin>(10);
const card = ref(store.todayState?.card);

onMounted(() => {
  store.init();
  if (!card.value) card.value = store.pickCard(duration.value, false);
});

function reroll() {
  if (store.todayState?.rerolled) return;
  card.value = store.pickCard(duration.value, true);
}

function confirm() {
  store.startRun();
  router.push('/run');
}
</script>

<template>
  <div class="panel">
    <label>冲刺时长</label>
    <select v-model.number="duration">
      <option :value="3">3 分钟（保命）</option>
      <option :value="10">10 分钟（默认）</option>
      <option :value="15">15 分钟（撬动）</option>
    </select>
    <button @click="card = store.pickCard(duration, false)">抽卡</button>
    <button class="secondary" :disabled="store.todayState?.rerolled" @click="reroll">重抽一次</button>
  </div>

  <CardView v-if="card" :card="card" />

  <button v-if="card" @click="confirm">确认开跑</button>
</template>
