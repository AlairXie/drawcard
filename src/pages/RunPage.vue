<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import CardView from '../components/CardView.vue';
import Timer from '../components/Timer.vue';
import { useGameStore } from '../stores/game';

const router = useRouter();
const store = useGameStore();

onMounted(() => {
  store.init();
  if (!store.todayState?.endAt) router.replace('/draw');
});

function done() {
  router.push('/submit');
}

function earlyFinish() {
  router.push('/submit');
}

function giveUp() {
  const record = store.abandonRun();
  if (record) {
    sessionStorage.setItem('ss_last_result', record.id);
    router.push('/result');
  }
}
</script>

<template>
  <CardView v-if="store.todayState?.card" :card="store.todayState.card" />
  <Timer v-if="store.todayState?.endAt" :end-at="store.todayState.endAt" @done="done" />
  <button @click="earlyFinish">提前完成</button>
  <button class="secondary" @click="giveUp">放弃</button>
</template>
