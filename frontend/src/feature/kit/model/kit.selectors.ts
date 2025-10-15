import { useMemo } from 'react';

import { useKitsState } from './kit.hooks';

import { ItemSpotValue, StatValues, type ItemSpot, type Stat } from '@/domain';

export const useKitsOnSpot = (spot: ItemSpot) => {
  const kits = useKitsState()[spot];

  const noKits = useMemo(() => kits.length === 0, [kits]);
  const techCost = useMemo(
    () => kits.reduce((acc, curr) => acc + curr.kit.tech * curr.number, 0),
    [kits]
  );
  const totalEffect = useMemo(() => {
    const base = Object.fromEntries(Object.entries(StatValues).map((s) => [s[0], 0])) as Record<
      Stat,
      number
    >;

    kits.forEach((kit) =>
      kit.kit.effects.forEach((e) => (base[e.property] += e.value * kit.number))
    );

    return base;
  }, [kits]);

  return { kits, noKits, techCost, totalEffect };
};

export const useKitsEffects = () => {
  const kits = useKitsState();

  return useMemo(() => {
    const base = Object.fromEntries(Object.entries(StatValues).map((s) => [s[0], 0])) as Record<
      Stat,
      number
    >;

    ItemSpotValue.forEach((spot) =>
      kits[spot].forEach((kit) =>
        kit.kit.effects.forEach((e) => (base[e.property] += e.value * kit.number))
      )
    );

    return base;
  }, [kits]);
};
