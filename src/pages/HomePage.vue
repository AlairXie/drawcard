<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import CardManager from '../components/CardManager.vue';
import StreakBadge from '../components/StreakBadge.vue';
import { useGameStore } from '../stores/game';

const store = useGameStore();
const router = useRouter();

onMounted(() => store.init());
</script>

<template>
  <StreakBadge :rank-name="store.rankName" :stars="store.stats.stars" :streak="store.stats.streak" :coins="store.stats.coins" :xp="store.stats.xp" />

  <div class="panel">
    <h3>学习王者 · 今日开局</h3>
    <p>默认混合模式：不选方向，直接抽卡开战。</p>
    <div class="row">
      <label><input type="radio" value="mixed" :checked="store.mode === 'mixed'" @change="store.setMode('mixed')" /> 混合模式</label>
      <label><input type="radio" value="single" :checked="store.mode === 'single'" @change="store.setMode('single')" /> 单模式</label>
      <input v-if="store.mode === 'single'" v-model="store.selectedTag" placeholder="输入标签，如 算法" />
    </div>
    <button @click="router.push('/draw')">开始匹配</button>
    <button class="secondary" @click="router.push('/history')">历史战绩</button>
  </div>

  <div v-if="store.lastRecord" class="panel">
    <h3>上局战报</h3>
    <p>{{ store.lastRecord.result === 'win' ? '胜利' : '败北' }} · {{ store.lastRecord.starDelta > 0 ? '+1★' : store.lastRecord.starDelta < 0 ? '-1★' : '保星' }}</p>
    <small>{{ store.lastRecord.outputText }}</small>
  </div>

  <CardManager />
</template>
