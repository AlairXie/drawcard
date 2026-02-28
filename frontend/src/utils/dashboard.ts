import type { RunRecord, CardDirection } from '../types';
import { DIRECTIONS } from '../types';

const RANKS = ['青铜', '白银', '黄金', '铂金', '钻石', '星耀', '王者'];

// ─── helpers ───

function toMonday(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().slice(0, 10);
}

function toMonth(dateStr: string): string {
  return dateStr.slice(0, 7);
}

function formatWeekLabel(monday: string): string {
  const d = new Date(`${monday}T00:00:00`);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

// ─── Completion rate line chart ───

export type PeriodMode = 'week' | 'month';

export interface CompletionPoint {
  label: string;
  total: number;
  wins: number;
  rate: number;
}

export function completionSeries(
  records: RunRecord[],
  mode: PeriodMode,
): CompletionPoint[] {
  const grouper = mode === 'week' ? toMonday : toMonth;
  const map = new Map<string, { total: number; wins: number }>();

  for (const r of records) {
    const key = grouper(r.date);
    const g = map.get(key) ?? { total: 0, wins: 0 };
    g.total++;
    if (r.result === 'win') g.wins++;
    map.set(key, g);
  }

  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, { total, wins }]) => ({
      label: mode === 'week' ? formatWeekLabel(key) : key,
      total,
      wins,
      rate: total ? Math.round((wins / total) * 100) : 0,
    }));
}

// ─── Heatmap calendar data ───

export interface HeatmapDay {
  date: string;
  count: number;
}

export function heatmapData(records: RunRecord[]): HeatmapDay[] {
  const map = new Map<string, number>();
  for (const r of records) {
    map.set(r.date, (map.get(r.date) ?? 0) + 1);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));
}

export function heatmapRange(records: RunRecord[]): [string, string] {
  const today = new Date().toISOString().slice(0, 10);
  if (!records.length) return [today, today];
  const dates = records.map((r) => r.date).sort();
  const earliest = dates[0];
  const d = new Date(`${earliest}T00:00:00`);
  d.setDate(d.getDate() - d.getDay() + (d.getDay() === 0 ? -6 : 1));
  return [d.toISOString().slice(0, 10), today];
}

// ─── Radar chart: direction stats ───

export interface DirectionRadar {
  direction: CardDirection;
  totalRuns: number;
  wins: number;
  winRate: number;
  avgPerDay: number;
}

export function directionRadar(records: RunRecord[]): DirectionRadar[] {
  const map = new Map<CardDirection, { total: number; wins: number; days: Set<string> }>();
  for (const d of DIRECTIONS) {
    map.set(d, { total: 0, wins: 0, days: new Set() });
  }
  for (const r of records) {
    const dir = r.direction ?? '复盘';
    const g = map.get(dir as CardDirection);
    if (!g) continue;
    g.total++;
    if (r.result === 'win') g.wins++;
    g.days.add(r.date);
  }
  return DIRECTIONS.map((d) => {
    const g = map.get(d)!;
    return {
      direction: d,
      totalRuns: g.total,
      wins: g.wins,
      winRate: g.total ? Math.round((g.wins / g.total) * 100) : 0,
      avgPerDay: g.days.size ? +(g.total / g.days.size).toFixed(1) : 0,
    };
  });
}

// ─── Rank progression curve ───

export interface RankPoint {
  date: string;
  rankIndex: number;
  rankName: string;
  stars: number;
  score: number; // composite = rankIndex * 3 + stars
}

export function rankProgression(records: RunRecord[]): RankPoint[] {
  const mixed = records
    .filter((r) => r.gameMode !== 'single')
    .sort((a, b) => a.startedAt - b.startedAt);

  if (!mixed.length) return [];

  return mixed.map((r) => {
    const ri = RANKS.indexOf(r.rankName);
    const idx = ri >= 0 ? ri : 0;
    return {
      date: r.date,
      rankIndex: idx,
      rankName: r.rankName,
      stars: r.stars,
      score: idx * 3 + r.stars,
    };
  });
}

// ─── Peak score progression ───

export interface PeakPoint {
  date: string;
  direction: CardDirection;
  score: number;
}

export function peakProgression(records: RunRecord[]): PeakPoint[] {
  return records
    .filter((r) => r.gameMode === 'single' && r.direction && r.peakScore != null)
    .sort((a, b) => a.startedAt - b.startedAt)
    .map((r) => ({
      date: r.date,
      direction: r.direction as CardDirection,
      score: r.peakScore!,
    }));
}

// ─── Summary stats ───

export interface DashboardSummary {
  totalRuns: number;
  totalWins: number;
  winRate: number;
  activeDays: number;
  currentStreak: number;
  bestStreak: number;
}

export function dashboardSummary(records: RunRecord[]): DashboardSummary {
  const totalRuns = records.length;
  const totalWins = records.filter((r) => r.result === 'win').length;
  const days = new Set(records.map((r) => r.date));

  let currentStreak = 0;
  let bestStreak = 0;
  let streak = 0;

  const sorted = [...records].sort((a, b) => a.startedAt - b.startedAt);
  for (const r of sorted) {
    if (r.result === 'win') {
      streak++;
      bestStreak = Math.max(bestStreak, streak);
    } else {
      streak = 0;
    }
  }
  currentStreak = streak;

  return {
    totalRuns,
    totalWins,
    winRate: totalRuns ? Math.round((totalWins / totalRuns) * 100) : 0,
    activeDays: days.size,
    currentStreak,
    bestStreak,
  };
}
