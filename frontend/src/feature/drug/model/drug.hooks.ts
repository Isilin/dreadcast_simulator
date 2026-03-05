import { useContext } from 'react';

import type { createDrugsActions } from './drug.actions';
import { DispatchCtx, StateCtx } from './drug.contexts';
import type { DrugsState } from './drug.types';

export const useDrugsState = (): DrugsState => {
  const state = useContext(StateCtx);
  if (state === undefined) {
    throw new Error('Missing DrugsProvider');
  }
  return state;
};

export const useDrugsDispatch = (): ReturnType<typeof createDrugsActions> => {
  const dispatch = useContext(DispatchCtx);
  if (!dispatch) {
    throw new Error('Missing DrugsProvider');
  }
  return dispatch;
};
