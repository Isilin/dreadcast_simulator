import { useMemo } from 'react';

import { useImplants } from '../services';
import { computeImplantsEffects } from './implant.rules';
import { useImplantsState } from './implant.store';

export const useImplantsEffects = () => {
  const state = useImplantsState();
  const { data: implants } = useImplants();

  return useMemo(
    () => computeImplantsEffects(state, implants),
    [implants, state],
  );
};
