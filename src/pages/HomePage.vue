<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import StreakBadge from '../components/StreakBadge.vue';
import { useGameStore } from '../stores/game';

const store = useGameStore();
const router = useRouter();

onMounted(() => store.init());
</script>

<template>
  <StreakBadge :streak="store.stats.streak" :level="store.stats.level" :xp="store.stats.xp" />

  <div class="panel">
    <h3>今日任务</h3>
    <p>1 分钟内开局，15 分钟内闭环。</p>
    <button @click="router.push('/draw')">开始一局</button>
    <button class="secondary" @click="router.push('/history')">查看历史</button>
  </div>

  <div v-if="store.lastRecord" class="panel">
    <h3>上次战利品</h3>
    <p>{{ store.lastRecord.outputText }}</p>
    <small>{{ store.lastRecord.date }} · {{ store.lastRecord.score }} 分</small>
  </div>
</template>
