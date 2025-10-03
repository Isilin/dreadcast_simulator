import { useItemsState } from './item.hooks';

import { ItemSpotValue } from '@/domain';
import type { Stat } from '@/feature/implant';

export const useItemsEffect = (): Record<Stat, number> => {
  const state = useItemsState();

  const res = {} as Record<Stat, number>;
  Object.values(ItemSpotValue).map((spot) =>
    state[spot]?.effects?.forEach((effect) => {
      if (res[effect.property as Stat] === undefined) {
        res[effect.property as Stat] = 0;
      }
      res[effect.property as Stat] += effect.value;
    }),
  );
  return res;
};
