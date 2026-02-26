export type CardTier = 'S' | 'M' | 'L';

export type GameMode = 'mixed' | 'single';

export type Card = {
  id: string;
  tier: CardTier;
  title: string;
  instruction: string;
  expectedOutputHint: string;
  tags?: string[];
  enabledToday: boolean;
};

export type DurationMin = 3 | 10 | 15;

export type RunOutcome = 'win' | 'lose';

export type RunRecord = {
  id: string;
  date: string;
  startedAt: number;
  durationMin: DurationMin;
  cardId: string;
  cardTitle: string;
  cardTier: CardTier;
  outputText: string;
  outputLink?: string;
  screenshotNote?: string;
  filePath?: string;
  result: RunOutcome;
  starDelta: -1 | 0 | 1;
  rankName: string;
  stars: number;
  isLifeMode: boolean;
  usedShield: boolean;
};

export type UserStats = {
  rankIndex: number;
  stars: number;
  streak: number;
  totalRuns: number;
  wins: number;
  losses: number;
  lastCompletedDate?: string;
  lastShieldDate?: string;
  coins: number;
  xp: number;
};

export type TodayState = {
  card: Card;
  durationMin: DurationMin;
  rerolled: boolean;
  mode: GameMode;
  startedAt?: number;
  endAt?: number;
};
