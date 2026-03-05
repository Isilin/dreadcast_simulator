import { createContext } from 'react';

import type { createDrugsActions } from './drug.actions';
import type { DrugsState } from './drug.types';

export const StateCtx = createContext<DrugsState | undefined>(undefined);
export const DispatchCtx = createContext<ReturnType<
  typeof createDrugsActions
> | null>(null);
