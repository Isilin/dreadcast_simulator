import { useContext } from 'react';

import type { createImplantsActions } from './implant.actions';
import { DispatchCtx, StateCtx } from './implant.contexts';
import type { ImplantsState } from './implant.types';

export const useImplantsState = (): ImplantsState => {
  const state = useContext(StateCtx);
  if (!state) {
    throw new Error('Missing ImplantsProvider');
  }
  return state;
};

export const useImplantsDispatch = (): ReturnType<typeof createImplantsActions> => {
  const dispatch = useContext(DispatchCtx);
  if (!dispatch) {
    throw new Error('Missing ImplantsProvider');
  }
  return dispatch;
};
