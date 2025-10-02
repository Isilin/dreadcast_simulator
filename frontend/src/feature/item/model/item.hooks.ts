import { useContext } from 'react';

import type { createItemsActions } from './item.actions';
import { DispatchCtx, StateCtx } from './item.contexts';
import type { ItemsState } from './item.types';

export const useItemsState = (): ItemsState => {
  const state = useContext(StateCtx);
  if (!state) {
    throw new Error('Missing ItemsProvider');
  }
  return state;
};

export const useItemsDispatch = (): ReturnType<typeof createItemsActions> => {
  const dispatch = useContext(DispatchCtx);
  if (!dispatch) {
    throw new Error('Missing ItemsProvider');
  }
  return dispatch;
};
