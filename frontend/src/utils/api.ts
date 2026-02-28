import type { Card } from '../types';

const BASE = '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`API ${res.status}: ${text}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export interface CardDTO {
  id: string;
  tier: string;
  direction: string;
  title: string;
  instruction: string;
  expectedOutputHint: string;
  tags: string[];
  enabledToday: boolean;
  isDefault: boolean;
}

function toCard(dto: CardDTO): Card {
  return {
    id: dto.id,
    tier: dto.tier as Card['tier'],
    direction: dto.direction as Card['direction'],
    title: dto.title,
    instruction: dto.instruction,
    expectedOutputHint: dto.expectedOutputHint,
    tags: dto.tags,
    enabledToday: dto.enabledToday,
  };
}

export const cardApi = {
  async list(direction?: string): Promise<Card[]> {
    const query = direction ? `?direction=${encodeURIComponent(direction)}` : '';
    const dtos = await request<CardDTO[]>(`/cards${query}`);
    return dtos.map(toCard);
  },

  async create(card: Omit<CardDTO, 'id' | 'isDefault'>): Promise<Card> {
    const dto = await request<CardDTO>('/cards', {
      method: 'POST',
      body: JSON.stringify(card),
    });
    return toCard(dto);
  },

  async update(id: string, card: Omit<CardDTO, 'id' | 'isDefault'>): Promise<Card> {
    const dto = await request<CardDTO>(`/cards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(card),
    });
    return toCard(dto);
  },

  async remove(id: string): Promise<void> {
    await request<void>(`/cards/${id}`, { method: 'DELETE' });
  },

  async toggle(id: string): Promise<Card> {
    const dto = await request<CardDTO>(`/cards/${id}/toggle`, { method: 'PATCH' });
    return toCard(dto);
  },
};
