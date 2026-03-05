import { useMemo, useReducer, type PropsWithChildren } from 'react';

import { createDrugsActions, initialState, reducer } from './drug.actions';
import { DispatchCtx, StateCtx } from './drug.contexts';

export const DrugsProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const actions = useMemo(() => createDrugsActions(dispatch), [dispatch]);

  return (
    <DispatchCtx.Provider value={actions}>
      <StateCtx.Provider value={state}>{children}</StateCtx.Provider>
    </DispatchCtx.Provider>
  );
};
