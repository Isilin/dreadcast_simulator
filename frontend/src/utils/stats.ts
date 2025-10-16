import { StatValues, type Stat } from '@/domain';

/**
 * Creates an object with all stats initialized to 0
 */
export const createEmptyStats = (): Record<Stat, number> => {
  return Object.fromEntries(
    Object.entries(StatValues).map((s) => [s[0], 0]),
  ) as Record<Stat, number>;
};
