import type { Card, CardDirection, PeakDirectionStats, PeakStats, RunRecord, TodayState, UserStats } from '../types';
import { DIRECTIONS } from '../types';
import { defaultCards } from '../data/cards';

const KEYS = {
  cards: 'ss_cards_v1',
  records: 'ss_records_v1',
  stats: 'ss_stats_v1',
  peakStats: 'ss_peak_stats_v1',
  today: 'ss_today_state_v1'
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
  xp: 0
};

function defaultPeakDir(): PeakDirectionStats {
  return { score: 0, streak: 0, totalRuns: 0, wins: 0, losses: 0 };
}

function defaultPeakStats(): PeakStats {
  return Object.fromEntries(DIRECTIONS.map((d) => [d, defaultPeakDir()])) as PeakStats;
}

const TAG_TO_DIRECTION: Record<string, CardDirection> = {
  '简历': '职业发展',
  '表达': '职业发展',
  '写作': '职业发展',
  '面试': '职业发展',
  '算法': '技术能力',
  '八股': '技术能力',
  '学习': '技术能力',
  '工程': '技术能力',
  '复盘': '复盘',
  '效率': '复盘',
  '数据': '复盘',
  '保命': '复盘',
};

function inferDirection(card: Card & { direction?: CardDirection }): CardDirection {
  if (card.direction) return card.direction;
  const tag = card.tags?.[0] ?? '';
  return TAG_TO_DIRECTION[tag] ?? '复盘';
}

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

  const needsMigration = cards.some((c) => !(c as Card & { direction?: string }).direction);
  const normalized = cards.map((c, index) => ({
    ...c,
    enabledToday: typeof c.enabledToday === 'boolean' ? c.enabledToday : index < DEFAULT_TODAY_POOL_SIZE,
    direction: inferDirection(c),
  }));

  if (needsMigration) {
    safeWrite(KEYS.cards, normalized);
  }

  return normalized;
}

export function saveCards(cards: Card[]) {
  safeWrite(KEYS.cards, cards);
}

export function getRecords(): RunRecord[] {
  const records = safeRead<RunRecord[]>(KEYS.records, []);
  const needsMigration = records.length > 0 && records.some((r) => !r.gameMode);
  if (needsMigration) {
    const migrated = records.map((r) => ({
      ...r,
      gameMode: r.gameMode ?? ('mixed' as const),
    }));
    safeWrite(KEYS.records, migrated);
    return migrated;
  }
  return records;
}

export function saveRecords(records: RunRecord[]) {
  safeWrite(KEYS.records, records);
}

export function getStats(): UserStats {
  return { ...defaultStats, ...safeRead<UserStats>(KEYS.stats, defaultStats) };
}

export function saveStats(stats: UserStats) {
  safeWrite(KEYS.stats, stats);
}

export function getPeakStats(): PeakStats {
  const stored = safeRead<Partial<PeakStats>>(KEYS.peakStats, {});
  const base = defaultPeakStats();
  for (const d of DIRECTIONS) {
    if (stored[d]) {
      base[d] = { ...defaultPeakDir(), ...stored[d] };
    }
  }
  return base;
}

export function savePeakStats(stats: PeakStats) {
  safeWrite(KEYS.peakStats, stats);
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
  if (!cards.length) {
    const seeded = defaultCards.map((card, index) => ({ ...card, enabledToday: index < DEFAULT_TODAY_POOL_SIZE }));
    safeWrite(KEYS.cards, seeded);
  }
}
