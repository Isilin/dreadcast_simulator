import { createContext } from 'react';

import type { createKitsActions } from './kit.actions';
import type { KitsState } from './kit.types';

export const StateCtx = createContext<KitsState | null>(null);
export const DispatchCtx = createContext<ReturnType<
  typeof createKitsActions
> | null>(null);
