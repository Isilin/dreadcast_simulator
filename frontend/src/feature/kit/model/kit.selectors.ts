import { useMemo } from 'react';

import { useKitsState } from './kit.hooks';

import type { ItemSpot, Stat } from '@/domain';

export const useKitsOnSpot = (spot: ItemSpot) => {
  const kits = useKitsState()[spot];

  const noKits = useMemo(() => kits.length === 0, [kits]);
  const techCost = useMemo(
    () => kits.reduce((acc, curr) => acc + curr.kit.tech * curr.number, 0),
    [kits],
  );
  const totalEffect = useMemo(
    () =>
      kits.reduce(
        (acc, curr) => {
          curr.kit.effects.forEach((e) => {
            if (acc[e.property] === undefined) {
              acc[e.property] = e.value * curr.number;
            } else {
              acc[e.property] += e.value * curr.number;
            }
          });
          return acc;
        },
        {} as Record<Stat, number>,
      ),
    [kits],
  );

  return { kits, noKits, techCost, totalEffect };
};
