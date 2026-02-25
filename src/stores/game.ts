import { defineStore } from 'pinia';
import type { Card, CardTier, DurationMin, RunRecord, TodayState } from '../types';
import { ensureCardSeeded, getCards, getRecords, getStats, getTodayState, saveRecords, saveStats, saveTodayState } from '../utils/storage';

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

function daysDiff(from: string, to: string): number {
  const a = new Date(`${from}T00:00:00`).getTime();
  const b = new Date(`${to}T00:00:00`).getTime();
  return Math.floor((b - a) / (1000 * 60 * 60 * 24));
}

function weightedTier(failDays: number): CardTier {
  const roll = Math.random();
  const weights = failDays >= 2 ? { S: 0.4, M: 0.5, L: 0.1 } : { S: 0.2, M: 0.7, L: 0.1 };
  if (roll < weights.S) return 'S';
  if (roll < weights.S + weights.M) return 'M';
  return 'L';
}

export const useGameStore = defineStore('game', {
  state: () => ({
    cards: [] as Card[],
    records: [] as RunRecord[],
    stats: getStats(),
    todayState: getTodayState() as TodayState | null
  }),
  getters: {
    lastRecord: (state) => state.records.at(-1),
    todayRecord: (state) => state.records.find((r) => r.date === todayDate())
  },
  actions: {
    init() {
      ensureCardSeeded();
      this.cards = getCards();
      this.records = getRecords();
      this.stats = getStats();
      this.todayState = getTodayState();
    },
    pickCard(durationMin: DurationMin, rerolled = false) {
      const today = todayDate();
      const failDays = this.stats.lastCompletedDate ? Math.max(0, daysDiff(this.stats.lastCompletedDate, today) - 1) : 0;
      const tier = weightedTier(failDays);
      const bucket = this.cards.filter((c) => c.tier === tier);
      const card = bucket[Math.floor(Math.random() * bucket.length)] ?? this.cards[0];
      this.todayState = { card, durationMin, rerolled };
      saveTodayState(this.todayState);
      return card;
    },
    startRun() {
      if (!this.todayState) return;
      const startedAt = Date.now();
      this.todayState = {
        ...this.todayState,
        startedAt,
        endAt: startedAt + this.todayState.durationMin * 60 * 1000
      };
      saveTodayState(this.todayState);
    },
    completeRun(payload: { outputText: string; outputLink?: string }) {
      if (!this.todayState?.startedAt) return null;
      const streakBefore = this.computeTodayStreak();
      const score = this.computeScore(this.todayState.card.tier, payload.outputText, streakBefore);
      const record: RunRecord = {
        id: crypto.randomUUID(),
        date: todayDate(),
        startedAt: this.todayState.startedAt,
        durationMin: this.todayState.durationMin,
        cardId: this.todayState.card.id,
        cardTier: this.todayState.card.tier,
        outputText: payload.outputText,
        outputLink: payload.outputLink,
        score,
        isLifeMode: this.todayState.card.tier === 'S'
      };
      this.records.push(record);
      saveRecords(this.records);
      this.updateStats(score);
      this.todayState = null;
      saveTodayState(null);
      return record;
    },
    abandonRun() {
      this.todayState = null;
      saveTodayState(null);
    },
    computeTodayStreak() {
      const today = todayDate();
      const last = this.stats.lastCompletedDate;
      if (!last) return 1;
      const diff = daysDiff(last, today);
      if (diff === 0) return this.stats.streak;
      if (diff === 1) return this.stats.streak + 1;
      return 1;
    },
    updateStats(score: number) {
      const today = todayDate();
      const newStreak = this.computeTodayStreak();
      this.stats.streak = newStreak;
      this.stats.lastCompletedDate = today;
      this.stats.totalRuns += 1;
      this.stats.xp += score;
      this.stats.level = Math.floor(this.stats.xp / 100) + 1;
      saveStats(this.stats);
    },
    computeScore(tier: CardTier, outputText: string, streak: number) {
      const base = 10;
      const tierBonus = tier === 'L' ? 2 : tier === 'M' ? 1 : 0;
      const len = outputText.trim().length;
      const textBonus = len >= 60 ? 4 : len >= 20 ? 2 : 0;
      const streakBonus = Math.min(streak, 10);
      return base + tierBonus + textBonus + streakBonus;
    },
    nextStepByTier(tier: CardTier) {
      if (tier === 'S') return '明天只要打开简历/题库，停留 30 秒就算开局成功。';
      if (tier === 'M') return '明天复用今天主题，再做一个更小一步（例如补 3 行）。';
      return '明天把今天产出物再补一行数字、截图说明或标题优化。';
    }
  }
});
