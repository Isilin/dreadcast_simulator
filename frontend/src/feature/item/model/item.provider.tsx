import { useMemo, useReducer, type PropsWithChildren } from 'react';

import { createItemsActions, initialState, reducer } from './item.actions';
import { DispatchCtx, StateCtx } from './item.contexts';

export const ItemsProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = useMemo(() => createItemsActions(dispatch), [dispatch]);

  return (
    <DispatchCtx.Provider value={actions}>
      <StateCtx.Provider value={state}>{children}</StateCtx.Provider>
    </DispatchCtx.Provider>
  );
};
