import { useItemsState } from './item.hooks';

import { ItemSpotValue, StatValues, type Stat } from '@/domain';

export const useItemsEffect = (): Record<Stat, number> => {
  const state = useItemsState();

  const res = Object.fromEntries(
    Object.entries(StatValues).map((s) => [s[0], 0]),
  ) as Record<Stat, number>;
  Object.values(ItemSpotValue).forEach((spot) =>
    state[spot]?.effects?.forEach((effect) => {
      if (res[effect.property as Stat] === undefined) {
        res[effect.property as Stat] = 0;
      }
      res[effect.property as Stat] += effect.value;
    }),
  );
  return res;
};
