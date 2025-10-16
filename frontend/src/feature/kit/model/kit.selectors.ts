import { useMemo } from 'react';

import { useKitsState } from './kit.hooks';
import {
  computeSpotTechCost,
  computeSpotTotalEffect,
  computeTotalEffects,
} from './kit.rules';

import { type ItemSpot } from '@/domain';

export const useKitsOnSpot = (spot: ItemSpot) => {
  const kits = useKitsState()[spot];

  const noKits = useMemo(() => kits.length === 0, [kits]);
  const techCost = useMemo(() => computeSpotTechCost(kits), [kits]);
  const totalEffect = useMemo(() => computeSpotTotalEffect(kits), [kits]);

  return { kits, noKits, techCost, totalEffect };
};

export const useKitsEffects = () => {
  const kits = useKitsState();
  return useMemo(() => computeTotalEffects(kits), [kits]);
};
