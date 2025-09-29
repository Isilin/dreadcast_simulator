import { useMemo } from 'react';

import { useImplantsState } from './implant.hooks';
import { MAX_IMPLANTS } from './implant.rules';
import type { ImplantName } from './implant.types';

export const useImplantsCount = () => {
  const state = useImplantsState();
  return useMemo(
    () => Object.entries(state).reduce((acc, curr) => acc + curr[1], 0),
    [state],
  );
};

export const useImplantsStatus = () => {
  const count = useImplantsCount();

  if (count === MAX_IMPLANTS) return 'perfect';
  else if (count > MAX_IMPLANTS) return 'error';
  else return 'incomplete';
};

export const useImplantStatus = (name: ImplantName) => {
  const state = useImplantsState();

  if (state[name] > 0) return 'active';
  else return;
};
