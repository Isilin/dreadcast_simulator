import { useMemo, useReducer, type PropsWithChildren } from 'react';

import { createImplantsActions, initialState, reducer } from './implant.actions';
import { DispatchCtx, StateCtx } from './implant.contexts';

export const ImplantsProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = useMemo(() => createImplantsActions(dispatch), [dispatch]);

  return (
    <DispatchCtx.Provider value={actions}>
      <StateCtx.Provider value={state}>{children}</StateCtx.Provider>
    </DispatchCtx.Provider>
  );
};
