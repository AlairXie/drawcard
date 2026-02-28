<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart, HeatmapChart, RadarChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  CalendarComponent,
  VisualMapComponent,
  LegendComponent,
  RadarComponent,
} from 'echarts/components';
import VChart from 'vue-echarts';
import { useGameStore } from '../stores/game';
import {
  completionSeries,
  heatmapData,
  heatmapRange,
  directionRadar,
  rankProgression,
  peakProgression,
  dashboardSummary,
  type PeriodMode,
} from '../utils/dashboard';

use([
  CanvasRenderer,
  LineChart,
  HeatmapChart,
  RadarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  CalendarComponent,
  VisualMapComponent,
  LegendComponent,
  RadarComponent,
]);

const store = useGameStore();
const router = useRouter();
const periodMode = ref<PeriodMode>('week');

onMounted(() => store.init());

const summary = computed(() => dashboardSummary(store.records));

// ─── Line chart: completion rate ───

const lineOption = computed(() => {
  const data = completionSeries(store.records, periodMode.value);
  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15,25,60,0.95)',
      borderColor: '#ffd700',
      textStyle: { color: '#fff', fontSize: 12 },
      formatter(params: any) {
        const p = params[0];
        const d = data[p.dataIndex];
        return `${d.label}<br/>完成率：${d.rate}%<br/>总局数：${d.total}　胜：${d.wins}`;
      },
    },
    grid: { left: 40, right: 16, top: 16, bottom: 28 },
    xAxis: {
      type: 'category',
      data: data.map((d) => d.label),
      axisLabel: { color: '#8892b0', fontSize: 10 },
      axisLine: { lineStyle: { color: '#1e3a5f' } },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLabel: { color: '#8892b0', fontSize: 10, formatter: '{value}%' },
      splitLine: { lineStyle: { color: '#1e3a5f', type: 'dashed' } },
    },
    series: [
      {
        type: 'line',
        data: data.map((d) => d.rate),
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: '#ffd700', width: 2 },
        itemStyle: { color: '#ffd700' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(255,215,0,0.25)' },
              { offset: 1, color: 'rgba(255,215,0,0)' },
            ],
          },
        },
      },
    ],
  };
});

// ─── Heatmap calendar ───

const calendarOption = computed(() => {
  const raw = heatmapData(store.records);
  const [rangeStart, rangeEnd] = heatmapRange(store.records);
  const max = Math.max(...raw.map((d) => d.count), 1);

  return {
    tooltip: {
      backgroundColor: 'rgba(15,25,60,0.95)',
      borderColor: '#ffd700',
      textStyle: { color: '#fff', fontSize: 12 },
      formatter(params: any) {
        return `${params.value[0]}<br/>完成：${params.value[1]} 局`;
      },
    },
    visualMap: {
      show: false,
      min: 0,
      max,
      inRange: { color: ['#1a1a2e', '#2d4a22', '#3d7a2a', '#50b030', '#7ce838'] },
    },
    calendar: {
      range: [rangeStart, rangeEnd],
      cellSize: [14, 14],
      top: 30,
      left: 30,
      right: 10,
      orient: 'horizontal',
      itemStyle: {
        borderWidth: 2,
        borderColor: '#0a1536',
        color: '#111a35',
      },
      splitLine: { show: false },
      yearLabel: { show: false },
      monthLabel: {
        color: '#8892b0',
        fontSize: 10,
        nameMap: 'ZH',
      },
      dayLabel: {
        color: '#8892b0',
        fontSize: 9,
        firstDay: 1,
        nameMap: 'ZH',
      },
    },
    series: [
      {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: raw.map((d) => [d.date, d.count]),
      },
    ],
  };
});

// ─── Radar chart ───

const radarOption = computed(() => {
  const data = directionRadar(store.records);
  const maxRuns = Math.max(...data.map((d) => d.totalRuns), 1);

  return {
    tooltip: {
      backgroundColor: 'rgba(15,25,60,0.95)',
      borderColor: '#ffd700',
      textStyle: { color: '#fff', fontSize: 12 },
    },
    radar: {
      indicator: data.map((d) => ({
        name: d.direction,
        max: Math.max(maxRuns, 5),
      })),
      shape: 'polygon',
      splitNumber: 4,
      axisName: { color: '#ffd700', fontSize: 11 },
      splitLine: { lineStyle: { color: '#1e3a5f' } },
      splitArea: {
        areaStyle: { color: ['rgba(30,58,95,0.2)', 'rgba(30,58,95,0.4)'] },
      },
      axisLine: { lineStyle: { color: '#1e3a5f' } },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: data.map((d) => d.totalRuns),
            name: '总局数',
            lineStyle: { color: '#ffd700', width: 2 },
            itemStyle: { color: '#ffd700' },
            areaStyle: { color: 'rgba(255,215,0,0.15)' },
          },
          {
            value: data.map((d) => d.wins),
            name: '胜场',
            lineStyle: { color: '#50b030', width: 2 },
            itemStyle: { color: '#50b030' },
            areaStyle: { color: 'rgba(80,176,48,0.15)' },
          },
        ],
      },
    ],
  };
});

// ─── Rank progression ───

const rankOption = computed(() => {
  const data = rankProgression(store.records);
  const peakData = peakProgression(store.records);

  const series: any[] = [];

  if (data.length) {
    series.push({
      name: '排位段位',
      type: 'line',
      data: data.map((d) => d.score),
      smooth: true,
      symbol: 'circle',
      symbolSize: 5,
      lineStyle: { color: '#ffd700', width: 2 },
      itemStyle: { color: '#ffd700' },
    });
  }

  const dirColors: Record<string, string> = {
    '职业发展': '#ff6b6b',
    '技术能力': '#4ecdc4',
    '复盘': '#a29bfe',
  };

  const dirGroups = new Map<string, { dates: string[]; scores: number[] }>();
  for (const p of peakData) {
    const g = dirGroups.get(p.direction) ?? { dates: [], scores: [] };
    g.dates.push(p.date);
    g.scores.push(p.score);
    dirGroups.set(p.direction, g);
  }

  for (const [dir, g] of dirGroups) {
    series.push({
      name: `巅峰·${dir}`,
      type: 'line',
      data: g.scores,
      smooth: true,
      symbol: 'circle',
      symbolSize: 4,
      lineStyle: { color: dirColors[dir] ?? '#888', width: 1.5 },
      itemStyle: { color: dirColors[dir] ?? '#888' },
    });
  }

  const allDates = [
    ...data.map((d) => d.date),
    ...peakData.map((d) => d.date),
  ];
  const uniqueDates = [...new Set(allDates)].sort();

  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15,25,60,0.95)',
      borderColor: '#ffd700',
      textStyle: { color: '#fff', fontSize: 12 },
    },
    legend: {
      show: series.length > 1,
      bottom: 0,
      textStyle: { color: '#8892b0', fontSize: 10 },
      itemWidth: 12,
      itemHeight: 8,
    },
    grid: { left: 40, right: 16, top: 16, bottom: series.length > 1 ? 36 : 28 },
    xAxis: {
      type: 'category',
      data: data.length ? data.map((d) => d.date) : uniqueDates,
      axisLabel: { color: '#8892b0', fontSize: 9, rotate: 30 },
      axisLine: { lineStyle: { color: '#1e3a5f' } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#8892b0', fontSize: 10 },
      splitLine: { lineStyle: { color: '#1e3a5f', type: 'dashed' } },
    },
    series,
  };
});

const hasRecords = computed(() => store.records.length > 0);
</script>

<template>
  <div class="dashboard-page">
    <div class="pool-title-row">
      <h2>数据仪表盘</h2>
      <button class="close-btn" @click="router.push('/')">✕</button>
    </div>

    <div v-if="!hasRecords" class="empty-state">
      <p class="empty-icon">📊</p>
      <p>暂无数据</p>
      <p class="empty-hint">完成几局对战后，这里将展示你的学习数据</p>
    </div>

    <template v-else>
      <!-- Summary Cards -->
      <div class="stat-grid">
        <div class="stat-card">
          <span class="stat-value">{{ summary.totalRuns }}</span>
          <span class="stat-label">总对局</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ summary.winRate }}%</span>
          <span class="stat-label">胜率</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ summary.activeDays }}</span>
          <span class="stat-label">活跃天</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ summary.bestStreak }}</span>
          <span class="stat-label">最佳连胜</span>
        </div>
      </div>

      <!-- Completion Rate -->
      <section class="chart-section">
        <div class="chart-header">
          <h3>完成率趋势</h3>
          <div class="period-toggle">
            <button
              :class="['toggle-btn', { active: periodMode === 'week' }]"
              @click="periodMode = 'week'"
            >周</button>
            <button
              :class="['toggle-btn', { active: periodMode === 'month' }]"
              @click="periodMode = 'month'"
            >月</button>
          </div>
        </div>
        <v-chart class="chart" :option="lineOption" autoresize />
      </section>

      <!-- Heatmap Calendar -->
      <section class="chart-section">
        <h3>活跃日历</h3>
        <div class="calendar-wrap">
          <v-chart class="chart chart-calendar" :option="calendarOption" autoresize />
        </div>
      </section>

      <!-- Radar Chart -->
      <section class="chart-section">
        <h3>方向雷达</h3>
        <v-chart class="chart" :option="radarOption" autoresize />
      </section>

      <!-- Rank Progression -->
      <section class="chart-section">
        <h3>段位 & 巅峰分变化</h3>
        <v-chart class="chart" :option="rankOption" autoresize />
      </section>
    </template>
  </div>
</template>

<style scoped>
.dashboard-page {
  padding: 16px;
  max-width: 430px;
  margin: 0 auto;
  min-height: 100dvh;
}

.pool-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.pool-title-row h2 {
  font-size: 1.25rem;
  color: #ffd700;
  margin: 0;
}

.close-btn {
  background: none;
  border: 1px solid #334;
  color: #8892b0;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  border-color: #ffd700;
  color: #ffd700;
}

/* ── Empty state ── */

.empty-state {
  text-align: center;
  padding: 48px 0;
  color: #8892b0;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 8px;
}

.empty-hint {
  font-size: 0.8rem;
  opacity: 0.7;
  margin-top: 4px;
}

/* ── Stat Grid ── */

.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 20px;
}

.stat-card {
  background: linear-gradient(135deg, #111a35 0%, #0d1529 100%);
  border: 1px solid #1e3a5f;
  border-radius: 10px;
  padding: 12px 6px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-value {
  font-size: 1.3rem;
  font-weight: 700;
  color: #ffd700;
}

.stat-label {
  font-size: 0.7rem;
  color: #8892b0;
}

/* ── Chart Section ── */

.chart-section {
  background: linear-gradient(135deg, #111a35 0%, #0d1529 100%);
  border: 1px solid #1e3a5f;
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 16px;
}

.chart-section h3 {
  font-size: 0.9rem;
  color: #ccd6f6;
  margin: 0 0 10px;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.chart-header h3 {
  margin: 0;
}

.chart {
  width: 100%;
  height: 220px;
}

.chart-calendar {
  height: 180px;
}

.calendar-wrap {
  overflow-x: auto;
}

/* ── Period Toggle ── */

.period-toggle {
  display: flex;
  gap: 4px;
  background: #0a1020;
  border-radius: 6px;
  padding: 2px;
}

.toggle-btn {
  background: none;
  border: none;
  color: #8892b0;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
  transition: all 0.2s;
}

.toggle-btn.active {
  background: #1e3a5f;
  color: #ffd700;
}
</style>
