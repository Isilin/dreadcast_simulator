import type { ReactNode } from 'react';
import { useLayoutEffect, useMemo, useReducer } from 'react';

import { initializeTheme, persistTheme } from '../services/theme.repo';
import {
  createThemeActions,
  initialState,
  themeReducer,
} from './theme.actions';
import { ThemeDispatchContext, ThemeStateContext } from './theme.contexts';

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Provider component for theme management.
 * Handles theme initialization, persistence, and system preference synchronization.
 *
 * Features:
 * - Detects and applies system theme preference on mount using useLayoutEffect (no flash)
 * - Persists user's theme choice to localStorage
 * - Listens for system theme changes and updates accordingly
 * - Wraps actions in useMemo to prevent unnecessary re-renders
 *
 * Uses useLayoutEffect to ensure theme is applied before browser paint,
 * preventing flash of wrong theme color.
 */
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);
  const actions = useMemo(() => createThemeActions(dispatch), [dispatch]);

  // Apply theme synchronously before paint to prevent flash
  useLayoutEffect(() => {
    const initialTheme = initializeTheme();
    actions.initTheme(initialTheme);
  }, [actions]);

  // Persist theme to localStorage whenever it changes
  useLayoutEffect(() => {
    persistTheme(state.current);
  }, [state]);

  // Listen for system theme preference changes
  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? 'dark' : 'light';
      actions.setTheme(newTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [actions]);

  return (
    <ThemeDispatchContext.Provider value={actions}>
      <ThemeStateContext.Provider value={state}>
        {children}
      </ThemeStateContext.Provider>
    </ThemeDispatchContext.Provider>
  );
};
