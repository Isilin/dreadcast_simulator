import { useMemo } from 'react';

import { computeTotalEffects } from './kit.rules';
import { useKitsState } from './kit.store';

export const useKitsEffects = () => {
  const kits = useKitsState();
  return useMemo(() => computeTotalEffects(kits), [kits]);
};
