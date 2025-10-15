import { useMemo } from 'react';

import { useImplants } from '../services';
import { useImplantsState } from './implant.hooks';
import { MAX_IMPLANTS } from './implant.rules';
import type { ImplantName } from './implant.types';

import { StatValues, type Stat } from '@/domain';

export const useImplantsCount = () => {
  const state = useImplantsState();
  return useMemo(() => Object.entries(state).reduce((acc, curr) => acc + curr[1], 0), [state]);
};

export const useImplantsStatus = () => {
  const count = useImplantsCount();

  if (count === MAX_IMPLANTS) return 'perfect';
  else if (count > MAX_IMPLANTS) return 'error';
  else return 'incomplete';
};

export const useImplantStatus = (name: ImplantName) => {
  const state = useImplantsState();

  if (state[name] > 0) return 'active';
  else return;
};

export const useImplantsEffects = () => {
  const state = useImplantsState();
  const { data: implants } = useImplants();

  return useMemo(() => {
    const base = Object.fromEntries(Object.entries(StatValues).map((s) => [s[0], 0])) as Record<
      Stat,
      number
    >;

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
  }, [implants, state]);
};
