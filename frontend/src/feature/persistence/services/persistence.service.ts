import type { ImplantsState } from '@/feature/implant';
import type { ItemsState } from '@/feature/item';
import type { KitsState } from '@/feature/kit';
import type { ProfileState } from '@/feature/profile';

export const BUILDS_KEY = 'dreadcast.builds.v1';
export const DEFAULT_SLOTS = 5;

export interface BuildSnapshot {
  profile: ProfileState;
  implants: ImplantsState;
  items: ItemsState;
  kits: KitsState;
  savedAt?: number;
}

export const readBuilds = (): Record<string, BuildSnapshot> => {
  try {
    const raw = localStorage.getItem(BUILDS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, BuildSnapshot>;
  } catch {
    return {};
  }
};

export const writeBuilds = (s: Record<string, BuildSnapshot>) =>
  localStorage.setItem(BUILDS_KEY, JSON.stringify(s));
