<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import LootList from '../components/LootList.vue';
import { useGameStore } from '../stores/game';

const store = useGameStore();
const router = useRouter();

onMounted(() => store.init());
</script>

<template>
  <LootList :records="store.records" :cards="store.cards" />
  <button class="secondary" @click="router.push('/')">返回首页</button>
</template>
