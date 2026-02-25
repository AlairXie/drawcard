export type CardTier = 'S' | 'M' | 'L';

export type Card = {
  id: string;
  tier: CardTier;
  title: string;
  instruction: string;
  expectedOutputHint: string;
};

export type DurationMin = 3 | 10 | 15;

export type RunRecord = {
  id: string;
  date: string;
  startedAt: number;
  durationMin: DurationMin;
  cardId: string;
  cardTier: CardTier;
  outputText: string;
  outputLink?: string;
  score: number;
  isLifeMode: boolean;
};

export type UserStats = {
  streak: number;
  lastCompletedDate?: string;
  totalRuns: number;
  xp: number;
  level: number;
};

export type TodayState = {
  card: Card;
  durationMin: DurationMin;
  rerolled: boolean;
  startedAt?: number;
  endAt?: number;
};
