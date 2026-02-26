export type CardTier = 'S' | 'M' | 'L';

export type GameMode = 'mixed' | 'peak';

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
  mode: GameMode;
  selectedTag?: string;
  starDelta: -1 | 0 | 1;
  rankName: string;
  stars: number;
  peakDelta: number;
  peakScore: number;
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
  peakScores: Record<string, number>;
};

export type TodayState = {
  card: Card;
  durationMin: DurationMin;
  rerolled: boolean;
  mode: GameMode;
  selectedTag?: string;
  startedAt?: number;
  endAt?: number;
};
