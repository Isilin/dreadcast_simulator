import type { Drug } from './drug.types';

import type { Stat } from '@/domain';
import { createEmptyStats } from '@/utils/stats';

export const computeDrugEffects = (
  drug: Drug | undefined,
): Record<Stat, number> => {
  const stats = createEmptyStats();
  if (!drug) return stats;

  for (const effect of drug.sideEffects) {
    stats[effect.property] += effect.value;
  }

  return stats;
};
