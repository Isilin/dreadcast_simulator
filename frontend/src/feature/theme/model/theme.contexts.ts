import { createContext } from 'react';

import type { ThemeActions } from './theme.actions';
import type { ThemeState } from './theme.types';

/** Context for reading current theme state */
export const ThemeStateContext = createContext<ThemeState | null>(null);
/** Context for dispatching theme actions (separate for performance optimization) */
export const ThemeDispatchContext = createContext<ThemeActions | null>(null);

ThemeStateContext.displayName = 'ThemeStateContext';
ThemeDispatchContext.displayName = 'ThemeDispatchContext';
