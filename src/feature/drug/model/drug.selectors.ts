import { useMemo } from 'react';

import { useDrugs } from '../services';
import { computeDrugsEffects } from './drug.rules';
import { useDrugId } from './drug.store';

export const useDrugsEffects = () => {
  const state = useDrugId();
  const { data: drugs } = useDrugs();
  return useMemo(() => computeDrugsEffects(state, drugs), [state, drugs]);
};
