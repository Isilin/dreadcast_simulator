import { useMemo } from 'react';

import { useDrugs } from '../services';
import { useDrugsState } from './drug.hooks';
import { computeDrugsEffects } from './drug.rules';

export const useDrugsEffects = () => {
  const state = useDrugsState();
  const { data: drugs } = useDrugs();
  return useMemo(() => computeDrugsEffects(state, drugs), [state, drugs]);
};
