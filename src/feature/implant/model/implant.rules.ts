import { type Implant } from './implant.types';

import { type Stat } from '@/domain';
import { createEmptyStats } from '@/utils/stats';

/**
 * Maximum number of implants allowed
 */
export const MAX_IMPLANTS = 58;

/**
 * Computes the total number of implants installed
 */
export const computeImplantsCount = (state: Record<string, number>): number =>
  Object.entries(state).reduce((acc, [, value]) => acc + value, 0);

/**
 * Type representing the possible implants installation status
 */
export type ImplantsStatus = 'perfect' | 'error' | 'incomplete';

/**
 * Checks if a specific implant is active
 */
export const computeImplantStatus = (
  state: Record<string, number>,
  name: string,
): 'active' | undefined => {
  return state[name] > 0 ? 'active' : undefined;
};

/**
 * Bonus of an implant on each of its attributes at a level (not cumulative:
 * the value of the level is the whole bonus). 0 when not installed.
 */
export const computeImplantLevelValue = (
  implant: Pick<Implant, 'valuePerLevel'>,
  level: number,
): number => (level > 0 ? (implant.valuePerLevel[level - 1] ?? 0) : 0);

/**
 * Computes the total effects from all active implants
 */
export const computeImplantsEffects = (
  state: Record<string, number>,
  implants: Implant[] | undefined,
): Record<Stat, number> => {
  const stats = createEmptyStats();

  if (!implants) return stats;

  implants.forEach((implant) => {
    const value = computeImplantLevelValue(implant, state[implant.name] ?? 0);
    if (value === 0) return;

    implant.attributes.forEach((stat) => {
      stats[stat] += value;
    });
  });

  return stats;
};

/**
 * Highest level an implant can reach without exceeding the level max of the
 * implant nor the total implant limit.
 */
export const computeImplantLevelCap = (
  state: Record<string, number>,
  implant: Pick<Implant, 'name' | 'levelMax'>,
): number => {
  const current = state[implant.name] ?? 0;
  const remaining = MAX_IMPLANTS - computeImplantsCount(state);
  return Math.max(current, Math.min(implant.levelMax, current + remaining));
};
