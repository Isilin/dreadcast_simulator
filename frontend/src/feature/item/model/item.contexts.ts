import { createContext } from 'react';

import type { createItemsActions } from './item.actions';
import type { ItemsState } from './item.types';

export const StateCtx = createContext<ItemsState | null>(null);
export const DispatchCtx = createContext<ReturnType<typeof createItemsActions> | null>(null);
