import type { Card, GameMode, RunRecord, TodayState, UserStats } from '../types';
import { defaultCards } from '../data/cards';

const KEYS = {
  cards: 'ss_cards_v1',
  records: 'ss_records_v1',
  stats: 'ss_stats_v1',
  today: 'ss_today_state_v1',
  mode: 'ss_mode_v1',
  selectedTag: 'ss_selected_tag_v1'
};

const DEFAULT_TODAY_POOL_SIZE = 5;

const defaultStats: UserStats = {
  rankIndex: 0,
  stars: 0,
  streak: 0,
  totalRuns: 0,
  wins: 0,
  losses: 0,
  coins: 0,
  xp: 0,
  peakScores: {}
};

function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage write errors
  }
}

export function getCards(): Card[] {
  const cards = safeRead<Card[]>(KEYS.cards, []);
  if (!cards.length) {
    const seeded = defaultCards.map((card, index) => ({ ...card, enabledToday: index < DEFAULT_TODAY_POOL_SIZE }));
    safeWrite(KEYS.cards, seeded);
    return seeded;
  }

  const hasEnabledFlag = cards.some((c) => typeof c.enabledToday === 'boolean');
  if (!hasEnabledFlag) {
    const normalized = cards.map((card, index) => ({ ...card, enabledToday: index < DEFAULT_TODAY_POOL_SIZE }));
    safeWrite(KEYS.cards, normalized);
    return normalized;
  }

  return cards.map((c) => ({ ...c, enabledToday: c.enabledToday ?? false }));
}

export function saveCards(cards: Card[]) {
  safeWrite(KEYS.cards, cards);
}

export function getRecords(): RunRecord[] {
  return safeRead<RunRecord[]>(KEYS.records, []);
}

export function saveRecords(records: RunRecord[]) {
  safeWrite(KEYS.records, records);
}

export function getStats(): UserStats {
  const stats = safeRead<UserStats>(KEYS.stats, defaultStats);
  return { ...defaultStats, ...stats, peakScores: stats.peakScores ?? {} };
}

export function saveStats(stats: UserStats) {
  safeWrite(KEYS.stats, stats);
}

export function getTodayState(): TodayState | null {
  return safeRead<TodayState | null>(KEYS.today, null);
}

export function saveTodayState(state: TodayState | null) {
  if (!state) {
    localStorage.removeItem(KEYS.today);
    return;
  }
  safeWrite(KEYS.today, state);
}

export function getStoredMode(): GameMode {
  const mode = safeRead<GameMode>(KEYS.mode, 'mixed');
  return mode === 'peak' ? 'peak' : 'mixed';
}

export function saveStoredMode(mode: GameMode) {
  safeWrite(KEYS.mode, mode);
}

export function getSelectedTag(): string {
  return safeRead<string>(KEYS.selectedTag, '');
}

export function saveSelectedTag(tag: string) {
  safeWrite(KEYS.selectedTag, tag);
}

export function ensureCardSeeded() {
  const cards = safeRead<Card[]>(KEYS.cards, []);
  if (!cards.length) {
    const seeded = defaultCards.map((card, index) => ({ ...card, enabledToday: index < DEFAULT_TODAY_POOL_SIZE }));
    safeWrite(KEYS.cards, seeded);
  }
}
