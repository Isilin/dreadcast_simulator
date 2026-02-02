import { useContext } from 'react';

import type { createProfilesActions } from './profile.actions';
import { DispatchCtx, StateCtx } from './profile.contexts';
import type { ProfileState } from './profile.types';

export const useProfileState = (): ProfileState => {
  const state = useContext(StateCtx);
  if (!state) {
    throw new Error('Missing ProfileProvider');
  }
  return state;
};

export const useProfileDispatch = (): ReturnType<
  typeof createProfilesActions
> => {
  const dispatch = useContext(DispatchCtx);
  if (!dispatch) {
    throw new Error('Missing ProfileProvider');
  }
  return dispatch;
};
