import { useMemo, useReducer, type PropsWithChildren } from 'react';

import { createKitsActions, initialState, reducer } from './kit.actions';
import { DispatchCtx, StateCtx } from './kit.contexts';

export const KitsProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = useMemo(() => createKitsActions(dispatch), [dispatch]);

  return (
    <DispatchCtx.Provider value={actions}>
      <StateCtx.Provider value={state}>{children}</StateCtx.Provider>
    </DispatchCtx.Provider>
  );
};
