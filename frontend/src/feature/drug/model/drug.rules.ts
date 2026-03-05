import type { Drug, DrugsState } from './drug.types';

import type { Stat } from '@/domain';
import { createEmptyStats } from '@/utils/stats';

export const computeDrugsEffects = (
  state: DrugsState,
  drugs: Drug[] | undefined,
): Record<Stat, number> => {
  const stats = createEmptyStats();
  if (!state || !drugs) return stats;
  const drug = drugs.find((d) => d.id === state);
  if (!drug) return stats;
  drug.sideEffects.forEach((effect) => {
    stats[effect.property] += effect.value;
  });
  return stats;
};
