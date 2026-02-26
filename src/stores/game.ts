import { defineStore } from 'pinia';
import type { Card, CardTier, DurationMin, GameMode, RunOutcome, RunRecord, TodayState } from '../types';
import {
  ensureCardSeeded,
  getCards,
  getRecords,
  getSelectedTag,
  getStats,
  getStoredMode,
  getTodayState,
  saveCards,
  saveRecords,
  saveSelectedTag,
  saveStats,
  saveStoredMode,
  saveTodayState
} from '../utils/storage';

const RANKS = ['青铜', '白银', '黄金', '铂金', '钻石', '星耀', '王者'];
const STARS_PER_RANK = 3;

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
    todayState: getTodayState() as TodayState | null,
    mode: getStoredMode() as GameMode,
    selectedTag: getSelectedTag()
  }),
  getters: {
    rankName: (state) => RANKS[state.stats.rankIndex] ?? '王者',
    lastRecord: (state) => state.records.at(-1),
    enabledCards: (state) => state.cards.filter((c) => c.enabledToday),
    availableTags: (state) =>
      Array.from(new Set(state.cards.flatMap((card) => card.tags ?? []).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'zh-CN')),
    currentPeakScore: (state) => (state.selectedTag ? state.stats.peakScores[state.selectedTag] ?? 0 : 0)
  },
  actions: {
    init() {
      ensureCardSeeded();
      this.cards = getCards();
      this.records = getRecords();
      this.stats = getStats();
      this.todayState = getTodayState();
      this.mode = getStoredMode();
      this.selectedTag = getSelectedTag();
    },
    setMode(mode: GameMode) {
      this.mode = mode;
      saveStoredMode(mode);
    },
    setSelectedTag(tag: string) {
      this.selectedTag = tag;
      saveSelectedTag(tag);
    },
    upsertCard(input: Partial<Card> & Pick<Card, 'title' | 'instruction' | 'expectedOutputHint' | 'tier'>) {
      if (input.id) {
        this.cards = this.cards.map((card) => (card.id === input.id ? { ...card, ...input } : card));
      } else {
        this.cards.push({
          id: crypto.randomUUID(),
          tier: input.tier,
          title: input.title,
          instruction: input.instruction,
          expectedOutputHint: input.expectedOutputHint,
          tags: input.tags ?? [],
          enabledToday: true
        });
      }
      saveCards(this.cards);
    },
    removeCard(id: string) {
      this.cards = this.cards.filter((c) => c.id !== id);
      saveCards(this.cards);
    },
    toggleCardEnabled(id: string) {
      this.cards = this.cards.map((c) => (c.id === id ? { ...c, enabledToday: !c.enabledToday } : c));
      saveCards(this.cards);
    },
    pickCard(durationMin: DurationMin, rerolled = false) {
      const pool = this.enabledCards.length ? this.enabledCards : this.cards;
      const today = todayDate();
      const failDays = this.stats.lastCompletedDate ? Math.max(0, daysDiff(this.stats.lastCompletedDate, today) - 1) : 0;
      const tier = weightedTier(failDays);
      const tierPool = pool.filter((c) => c.tier === tier);
      const shouldFilterByTag = this.mode === 'peak' && this.selectedTag;
      const tagPool = shouldFilterByTag ? tierPool.filter((c) => c.tags?.includes(this.selectedTag)) : tierPool;
      const fallbackTagPool = shouldFilterByTag ? pool.filter((c) => c.tags?.includes(this.selectedTag)) : [];
      const finalPool = tagPool.length ? tagPool : fallbackTagPool.length ? fallbackTagPool : tierPool.length ? tierPool : pool;
      const card = finalPool[Math.floor(Math.random() * finalPool.length)] ?? this.cards[0];
      this.todayState = { card, durationMin, rerolled, mode: this.mode, selectedTag: this.mode === 'peak' ? this.selectedTag : undefined };
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
    resolveRank(starDelta: -1 | 0 | 1) {
      let rankIndex = this.stats.rankIndex;
      let stars = this.stats.stars + starDelta;

      if (stars >= STARS_PER_RANK && rankIndex < RANKS.length - 1) {
        rankIndex += 1;
        stars = 0;
      }
      if (stars < 0 && rankIndex > 0) {
        rankIndex -= 1;
        stars = STARS_PER_RANK - 1;
      }
      if (stars < 0) stars = 0;

      this.stats.rankIndex = rankIndex;
      this.stats.stars = Math.min(stars, STARS_PER_RANK);
    },
    settleRun(payload: {
      outcome: RunOutcome;
      outputText: string;
      outputLink?: string;
      screenshotNote?: string;
      filePath?: string;
      isEarlyFinish?: boolean;
    }) {
      if (!this.todayState?.startedAt) return null;
      const today = todayDate();
      const isLifeMode = this.todayState.durationMin === 3 || this.todayState.card.tier === 'S';
      const isPeakMode = this.todayState.mode === 'peak';

      let starDelta: -1 | 0 | 1 = payload.outcome === 'win' ? 1 : -1;
      let peakDelta = payload.outcome === 'win' ? 15 + Math.floor(Math.random() * 6) : -15;
      let usedShield = false;

      const isAbandon = payload.isEarlyFinish ?? false;
      if (payload.outcome === 'lose' && isAbandon && this.stats.lastShieldDate !== today) {
        starDelta = 0;
        peakDelta = 0;
        usedShield = true;
        this.stats.lastShieldDate = today;
      }

      if (isPeakMode) {
        const key = this.todayState.selectedTag || 'default';
        const current = this.stats.peakScores[key] ?? 0;
        this.stats.peakScores[key] = Math.max(0, current + peakDelta);
      } else {
        this.resolveRank(starDelta);
      }

      const win = payload.outcome === 'win';
      this.stats.totalRuns += 1;
      this.stats.lastCompletedDate = today;
      this.stats.streak = win ? this.stats.streak + 1 : 0;
      this.stats.wins += win ? 1 : 0;
      this.stats.losses += win ? 0 : 1;
      this.stats.coins += win ? (this.stats.streak >= 2 ? 2 : 1) : 0;
      this.stats.xp += win ? (isLifeMode ? 1 : 2) : 0;
      saveStats(this.stats);

      const peakScore = this.todayState.selectedTag ? this.stats.peakScores[this.todayState.selectedTag] ?? 0 : 0;
      const record: RunRecord = {
        id: crypto.randomUUID(),
        date: today,
        startedAt: this.todayState.startedAt,
        durationMin: this.todayState.durationMin,
        cardId: this.todayState.card.id,
        cardTitle: this.todayState.card.title,
        cardTier: this.todayState.card.tier,
        outputText: payload.outputText,
        outputLink: payload.outputLink,
        screenshotNote: payload.screenshotNote,
        filePath: payload.filePath,
        result: payload.outcome,
        mode: this.todayState.mode,
        selectedTag: this.todayState.selectedTag,
        starDelta,
        rankName: this.rankName,
        stars: this.stats.stars,
        peakDelta,
        peakScore,
        isLifeMode,
        usedShield
      };

      this.records.push(record);
      saveRecords(this.records);
      this.todayState = null;
      saveTodayState(null);
      return record;
    },
    abandonRun() {
      return this.settleRun({ outcome: 'lose', outputText: '本局放弃', isEarlyFinish: true });
    },
    nextStep(cardTitle: string) {
      return `明天 30 秒下一步：先打开「${cardTitle}」相关文档，补 1 行即可。`;
    }
  }
});
