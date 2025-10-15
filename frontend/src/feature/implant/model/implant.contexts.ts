import { createContext } from 'react';

import type { createImplantsActions } from './implant.actions';
import type { ImplantsState } from './implant.types';

export const StateCtx = createContext<ImplantsState | null>(null);
export const DispatchCtx = createContext<ReturnType<
  typeof createImplantsActions
> | null>(null);
