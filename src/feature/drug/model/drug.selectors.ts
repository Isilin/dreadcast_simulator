import { useMemo } from 'react';

import { useDrug } from '../services';
import { computeDrugEffects } from './drug.rules';
import { useDrugId } from './drug.store';

export const useDrugEffects = () => {
  const drugId = useDrugId();
  const { data: drug } = useDrug(drugId);
  return useMemo(() => computeDrugEffects(drug), [drug]);
};
