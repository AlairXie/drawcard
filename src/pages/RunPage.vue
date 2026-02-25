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
</script>

<template>
  <CardView v-if="store.todayState?.card" :card="store.todayState.card" />
  <Timer v-if="store.todayState?.endAt" :end-at="store.todayState.endAt" @done="done" />
  <button class="secondary" @click="store.abandonRun(); router.push('/')">放弃本局</button>
</template>
