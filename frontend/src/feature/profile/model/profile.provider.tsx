import { useMemo, useReducer, type PropsWithChildren } from 'react';

import {
  createProfilesActions,
  initialState,
  reducer,
} from './profile.actions';
import { DispatchCtx, StateCtx } from './profile.contexts';

export const ProfileProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = useMemo(() => createProfilesActions(dispatch), [dispatch]);

  return (
    <DispatchCtx.Provider value={actions}>
      <StateCtx.Provider value={state}>{children}</StateCtx.Provider>
    </DispatchCtx.Provider>
  );
};
