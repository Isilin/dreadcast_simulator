export const BUILDS_KEY = 'dreadcast.builds.v1';
export const DEFAULT_SLOTS = 10;

export interface BuildSnapshot {
  profile: unknown;
  implants: unknown;
  items: unknown;
  kits: unknown;
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
