import type { Card, RunRecord, TodayState, UserStats } from '../types';
import { defaultCards } from '../data/cards';

const KEYS = {
  cards: 'ss_cards_v1',
  records: 'ss_records_v1',
  stats: 'ss_stats_v1',
  today: 'ss_today_state_v1'
};

const defaultStats: UserStats = {
  streak: 0,
  totalRuns: 0,
  xp: 0,
  level: 1
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
  const cards = safeRead<Card[]>(KEYS.cards, defaultCards);
  if (!cards.length) {
    safeWrite(KEYS.cards, defaultCards);
    return defaultCards;
  }
  return cards;
}

export function getRecords(): RunRecord[] {
  return safeRead<RunRecord[]>(KEYS.records, []);
}

export function saveRecords(records: RunRecord[]) {
  safeWrite(KEYS.records, records);
}

export function getStats(): UserStats {
  return safeRead<UserStats>(KEYS.stats, defaultStats);
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

export function ensureCardSeeded() {
  const cards = safeRead<Card[]>(KEYS.cards, []);
  if (!cards.length) safeWrite(KEYS.cards, defaultCards);
}
