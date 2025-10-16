import { type Implant } from './implant.types';

import { StatValues, type Stat } from '@/domain';

export const MAX_IMPLANTS = 58;

export const computeImplantsCount = (state: Record<string, number>): number =>
  Object.entries(state).reduce((acc, curr) => acc + curr[1], 0);

export const computeImplantsStatus = (
  count: number,
): 'perfect' | 'error' | 'incomplete' => {
  if (count === MAX_IMPLANTS) return 'perfect';
  else if (count > MAX_IMPLANTS) return 'error';
  else return 'incomplete';
};

export const computeImplantStatus = (
  state: Record<string, number>,
  name: string,
): 'active' | undefined => {
  if (state[name] > 0) return 'active';
  else return undefined;
};

export const computeImplantsEffects = (
  state: Record<string, number>,
  implants: Implant[] | undefined,
): Record<Stat, number> => {
  const base = Object.fromEntries(
    Object.entries(StatValues).map((s) => [s[0], 0]),
  ) as Record<Stat, number>;

  if (!implants) return base;

  implants.forEach((implant) => {
    const level = state[implant.name] ?? 0;
    if (level <= 0) return;

    const value = implant.valuePerLevel[level - 1] ?? 0;
    implant.attributes.forEach((stat) => {
      base[stat] += value;
    });
  });

  return base;
};
