<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import StreakBadge from '../components/StreakBadge.vue';
import { useGameStore } from '../stores/game';

const store = useGameStore();
const router = useRouter();

onMounted(() => store.init());

const record = computed(() => {
  const id = sessionStorage.getItem('ss_last_result');
  if (!id) return store.lastRecord;
  return store.records.find((r) => r.id === id) ?? store.lastRecord;
});

const nextStep = computed(() => {
  if (!record.value) return '明天 30 秒下一步：打开应用点开始匹配。';
  return store.nextStep(record.value.outputText.slice(0, 12));
});
</script>

<template>
  <StreakBadge :rank-name="store.rankName" :stars="store.stats.stars" :streak="store.stats.streak" :coins="store.stats.coins" :xp="store.stats.xp" />

  <div v-if="record" class="panel">
    <h3>{{ record.result === 'win' ? '✅ 胜利' : '❌ 败北' }}</h3>
    <p>星星变化：{{ record.starDelta > 0 ? '+1★' : record.starDelta < 0 ? '-1★' : '保星' }}</p>
    <p v-if="record.usedShield">🛡️ 今日首次败北触发保星卡。</p>
    <p>连胜：x{{ store.stats.streak }}</p>
    <p>战利品：{{ record.outputText }}</p>
    <p>{{ nextStep }}</p>
    <button @click="router.push('/draw')">再开一局</button>
    <button class="secondary" @click="router.push('/history')">查看历史</button>
    <button class="secondary" @click="router.push('/')">返回首页</button>
  </div>
</template>
