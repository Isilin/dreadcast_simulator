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
 * Computes the overall implants installation status
 */
export const computeImplantsStatus = (count: number): ImplantsStatus => {
  if (count === MAX_IMPLANTS) return 'perfect';
  if (count > MAX_IMPLANTS) return 'error';
  return 'incomplete';
};

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
 * Computes the total effects from all active implants
 */
export const computeImplantsEffects = (
  state: Record<string, number>,
  implants: Implant[] | undefined,
): Record<Stat, number> => {
  const stats = createEmptyStats();

  if (!implants) return stats;

  implants.forEach((implant) => {
    const level = state[implant.name] ?? 0;
    if (level <= 0) return;

    const value = implant.valuePerLevel[level - 1] ?? 0;
    implant.attributes.forEach((stat) => {
      stats[stat] += value;
    });
  });

  return stats;
};
