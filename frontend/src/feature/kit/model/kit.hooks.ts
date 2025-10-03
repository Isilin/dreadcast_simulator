import { useContext } from 'react';

import type { createKitsActions } from './kit.actions';
import { DispatchCtx, StateCtx } from './kit.contexts';
import type { KitsState } from './kit.types';

export const useKitsState = (): KitsState => {
  const state = useContext(StateCtx);
  if (!state) {
    throw new Error('Missing KitsProvider');
  }
  return state;
};

export const useKitsDispatch = (): ReturnType<typeof createKitsActions> => {
  const dispatch = useContext(DispatchCtx);
  if (!dispatch) {
    throw new Error('Missing KitsProvider');
  }
  return dispatch;
};
