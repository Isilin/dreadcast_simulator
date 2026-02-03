import { useContext } from 'react';

import type { ThemeActions } from './theme.actions';
import { ThemeDispatchContext, ThemeStateContext } from './theme.contexts';
import type { ThemeState } from './theme.types';

/**
 * Hook to access current theme state.
 * Must be used within ThemeProvider.
 * @throws Error if used outside ThemeProvider
 */
export const useThemeState = (): ThemeState => {
  const context = useContext(ThemeStateContext);
  if (!context) {
    throw new Error('useThemeState must be used within ThemeProvider');
  }
  return context;
};

/**
 * Hook to access theme dispatch actions.
 * Must be used within ThemeProvider.
 * @throws Error if used outside ThemeProvider
 */
export const useThemeDispatch = (): ThemeActions => {
  const context = useContext(ThemeDispatchContext);
  if (!context) {
    throw new Error('useThemeDispatch must be used within ThemeProvider');
  }
  return context;
};

/**
 * Convenience hook to access both theme state and actions.
 * Must be used within ThemeProvider.
 * @throws Error if used outside ThemeProvider
 */
export const useTheme = (): { state: ThemeState; actions: ThemeActions } => {
  const state = useThemeState();
  const actions = useThemeDispatch();
  return { state, actions };
};
