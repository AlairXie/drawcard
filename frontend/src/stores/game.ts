import { defineStore } from 'pinia';
import type { Card, CardDirection, CardTier, DurationMin, GameMode, PeakStats, RunOutcome, RunRecord, TodayState, UserStats } from '../types';
import { DIRECTIONS } from '../types';
import {
  ensureCardSeeded, getCards, getPeakStats, getRecords, getStats,
  getTodayState, saveCards, savePeakStats, saveRecords, saveStats, saveTodayState
} from '../utils/storage';
import { cardApi } from '../utils/api';

const RANKS = ['青铜', '白银', '黄金', '铂金', '钻石', '星耀', '王者'];
const STARS_PER_RANK = 3;

// 巅峰赛积分规则 (参考王者荣耀巅峰赛)
const PEAK_WIN_BASE = 10;
const PEAK_STREAK_BONUS = 2;
const PEAK_STREAK_BONUS_CAP = 6;
const PEAK_LOSE_BASE = 7;

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

function calcPeakWin(streak: number): number {
  const bonus = Math.min(streak * PEAK_STREAK_BONUS, PEAK_STREAK_BONUS_CAP);
  return PEAK_WIN_BASE + bonus;
}

function defaultPeakStats(): PeakStats {
  return Object.fromEntries(DIRECTIONS.map((d) => [d, {
    score: 0, streak: 0, totalRuns: 0, wins: 0, losses: 0
  }])) as PeakStats;
}

export const useGameStore = defineStore('game', {
  state: () => ({
    cards: [] as Card[],
    records: [] as RunRecord[],
    stats: getStats(),
    peakStats: defaultPeakStats() as PeakStats,
    todayState: getTodayState() as TodayState | null,
    mode: 'mixed' as GameMode,
    selectedDirection: '职业发展' as CardDirection,
  }),
  getters: {
    rankName: (state) => RANKS[state.stats.rankIndex] ?? '王者',
    lastRecord: (state) => state.records.at(-1),
    enabledCards: (state) => state.cards.filter((c) => c.enabledToday),
    cardsByDirection: (state) => {
      return (dir: CardDirection) => state.cards.filter((c) => c.direction === dir);
    },

    currentPeakDir(state) {
      return state.peakStats[state.selectedDirection];
    },
    currentPeakScore(): number {
      return this.currentPeakDir.score;
    },
    currentPeakStreak(): number {
      return this.currentPeakDir.streak;
    },

    currentStreak(state): number {
      if (state.mode === 'single') return state.peakStats[state.selectedDirection].streak;
      return state.stats.streak;
    },

    mixedRecords: (state) => state.records.filter((r) => r.gameMode !== 'single'),
    peakRecords: (state) => state.records.filter((r) => r.gameMode === 'single'),
  },
  actions: {
    async init() {
      try {
        this.cards = await cardApi.list();
      } catch {
        ensureCardSeeded();
        this.cards = getCards();
      }
      this.records = getRecords();
      this.stats = getStats();
      this.peakStats = getPeakStats();
      this.todayState = getTodayState();
    },
    setMode(mode: GameMode) {
      this.mode = mode;
    },
    setDirection(dir: CardDirection) {
      this.selectedDirection = dir;
    },
    async upsertCard(input: Partial<Card> & Pick<Card, 'title' | 'instruction' | 'expectedOutputHint' | 'tier' | 'direction'>) {
      const payload = {
        tier: input.tier,
        direction: input.direction,
        title: input.title,
        instruction: input.instruction,
        expectedOutputHint: input.expectedOutputHint,
        tags: input.tags ?? [],
        enabledToday: input.enabledToday ?? true,
      };
      try {
        if (input.id) {
          const updated = await cardApi.update(input.id, payload);
          this.cards = this.cards.map((c) => (c.id === updated.id ? updated : c));
        } else {
          const created = await cardApi.create(payload);
          this.cards.push(created);
        }
      } catch {
        if (input.id) {
          this.cards = this.cards.map((card) => (card.id === input.id ? { ...card, ...input } : card));
        } else {
          this.cards.push({
            id: crypto.randomUUID(),
            tier: input.tier, direction: input.direction, title: input.title,
            instruction: input.instruction, expectedOutputHint: input.expectedOutputHint,
            tags: input.tags ?? [], enabledToday: true,
          });
        }
        saveCards(this.cards);
      }
    },
    async removeCard(id: string) {
      try {
        await cardApi.remove(id);
      } catch { /* fallback */ }
      this.cards = this.cards.filter((c) => c.id !== id);
      saveCards(this.cards);
    },
    async toggleCardEnabled(id: string) {
      try {
        const updated = await cardApi.toggle(id);
        this.cards = this.cards.map((c) => (c.id === updated.id ? updated : c));
        return;
      } catch { /* fallback */ }
      this.cards = this.cards.map((c) => (c.id === id ? { ...c, enabledToday: !c.enabledToday } : c));
      saveCards(this.cards);
    },
    pickCard(durationMin: DurationMin, rerolled = false) {
      const pool = this.enabledCards.length ? this.enabledCards : this.cards;
      const today = todayDate();
      const failDays = this.stats.lastCompletedDate ? Math.max(0, daysDiff(this.stats.lastCompletedDate, today) - 1) : 0;
      const tier = weightedTier(failDays);
      const tierPool = pool.filter((c) => c.tier === tier);

      let dirPool = tierPool;
      if (this.mode === 'single') {
        const filtered = tierPool.filter((c) => c.direction === this.selectedDirection);
        if (filtered.length) dirPool = filtered;
      }

      const finalPool = dirPool.length ? dirPool : tierPool.length ? tierPool : pool;
      const card = finalPool[Math.floor(Math.random() * finalPool.length)] ?? this.cards[0];
      this.todayState = {
        card, durationMin, rerolled,
        mode: this.mode,
        direction: this.mode === 'single' ? this.selectedDirection : undefined,
      };
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

    // ── Mixed mode: rank/star resolution ──
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

    // ── Peak mode: score resolution ──
    resolvePeak(direction: CardDirection, outcome: RunOutcome, usedShield: boolean): number {
      const ds = this.peakStats[direction];
      const win = outcome === 'win';

      if (usedShield) return 0;

      let delta: number;
      if (win) {
        delta = calcPeakWin(ds.streak);
      } else {
        delta = -PEAK_LOSE_BASE;
      }

      ds.score = Math.max(0, ds.score + delta);
      return delta;
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
      const runMode = this.todayState.mode;
      const direction = this.todayState.direction;
      const isLifeMode = this.todayState.durationMin === 3 || this.todayState.card.tier === 'S';
      const isAbandon = payload.isEarlyFinish ?? false;
      const win = payload.outcome === 'win';

      let starDelta: -1 | 0 | 1 = 0;
      let peakDelta = 0;
      let usedShield = false;

      if (runMode === 'single' && direction) {
        // ── Peak mode settle ──
        const ds = this.peakStats[direction];

        if (!win && isAbandon && ds.lastShieldDate !== today) {
          usedShield = true;
          ds.lastShieldDate = today;
        }

        peakDelta = this.resolvePeak(direction, payload.outcome, usedShield);

        ds.totalRuns += 1;
        ds.lastCompletedDate = today;
        ds.streak = win ? ds.streak + 1 : 0;
        ds.wins += win ? 1 : 0;
        ds.losses += win ? 0 : 1;
        savePeakStats(this.peakStats);
      } else {
        // ── Mixed mode settle ──
        starDelta = win ? 1 : -1;

        if (!win && isAbandon && this.stats.lastShieldDate !== today) {
          starDelta = 0;
          usedShield = true;
          this.stats.lastShieldDate = today;
        }

        this.resolveRank(starDelta);

        this.stats.totalRuns += 1;
        this.stats.lastCompletedDate = today;
        this.stats.streak = win ? this.stats.streak + 1 : 0;
        this.stats.wins += win ? 1 : 0;
        this.stats.losses += win ? 0 : 1;
        this.stats.coins += win ? (this.stats.streak >= 2 ? 2 : 1) : 0;
        this.stats.xp += win ? (isLifeMode ? 1 : 2) : 0;
        saveStats(this.stats);
      }

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
        gameMode: runMode,
        direction,
        starDelta,
        rankName: this.rankName,
        stars: this.stats.stars,
        peakDelta: runMode === 'single' ? peakDelta : undefined,
        peakScore: runMode === 'single' && direction ? this.peakStats[direction].score : undefined,
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
