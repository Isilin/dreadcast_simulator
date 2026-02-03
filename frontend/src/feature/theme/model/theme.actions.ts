import type { Dispatch } from 'react';

import type { Theme, ThemeState } from './theme.types';

/** Union type for all theme reducer actions */
export type ThemeAction =
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'TOGGLE_THEME' }
  | { type: 'INIT_THEME'; payload: Theme };

/** Initial state: theme defaults to dark with system preference flag */
export const initialState: ThemeState = {
  current: 'dark',
  isSystemPreference: true,
};

/**
 * Reducer for theme state management.
 * Handles theme changes and initialization with proper state transitions.
 */
export const themeReducer = (
  state: ThemeState,
  action: ThemeAction,
): ThemeState => {
  switch (action.type) {
    case 'SET_THEME':
      return {
        current: action.payload,
        isSystemPreference: false,
      };

    case 'TOGGLE_THEME':
      return {
        current: state.current === 'dark' ? 'light' : 'dark',
        isSystemPreference: false,
      };

    case 'INIT_THEME':
      return {
        current: action.payload,
        isSystemPreference: false,
      };

    default:
      return state;
  }
};

/** Public API for theme dispatch actions */
export interface ThemeActions {
  /** Set theme to a specific value and persist to localStorage */
  setTheme: (theme: Theme) => void;
  /** Toggle between light and dark themes */
  toggleTheme: () => void;
  /** Initialize theme on app startup (called by provider) */
  initTheme: (theme: Theme) => void;
}

/**
 * Factory function to create theme action dispatchers.
 * Used in provider to wrap actions with proper error handling and dispatch logic.
 */
export const createThemeActions = (
  dispatch: Dispatch<ThemeAction>,
): ThemeActions => ({
  setTheme: (theme: Theme) => {
    dispatch({ type: 'SET_THEME', payload: theme });
  },
  toggleTheme: () => {
    dispatch({ type: 'TOGGLE_THEME' });
  },
  initTheme: (theme: Theme) => {
    dispatch({ type: 'INIT_THEME', payload: theme });
  },
});
