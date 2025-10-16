import { useMemo } from 'react';

import { useImplants } from '../services';
import { useImplantsState } from './implant.hooks';
import {
  computeImplantStatus,
  computeImplantsCount,
  computeImplantsEffects,
  computeImplantsStatus,
} from './implant.rules';
import type { ImplantName } from './implant.types';

export const useImplantsCount = () => {
  const state = useImplantsState();
  return useMemo(() => computeImplantsCount(state), [state]);
};

export const useImplantsStatus = () => {
  const count = useImplantsCount();
  return useMemo(() => computeImplantsStatus(count), [count]);
};

export const useImplantStatus = (name: ImplantName) => {
  const state = useImplantsState();
  return useMemo(() => computeImplantStatus(state, name), [state, name]);
};

export const useImplantsEffects = () => {
  const state = useImplantsState();
  const { data: implants } = useImplants();

  return useMemo(
    () => computeImplantsEffects(state, implants),
    [implants, state],
  );
};
