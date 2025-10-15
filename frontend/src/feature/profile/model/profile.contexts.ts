import { createContext } from 'react';

import type { createProfilesActions } from './profile.actions';
import type { ProfileState } from './profile.types';

export const StateCtx = createContext<ProfileState | null>(null);
export const DispatchCtx = createContext<ReturnType<
  typeof createProfilesActions
> | null>(null);
