import { useThemeActionsValues, useThemeStateValues } from './theme.store';
import type { ThemeActions } from './theme.store';
import type { ThemeState } from './theme.types';

/**
 * Hook to access current theme state.
 */
export const useThemeState = (): ThemeState => useThemeStateValues();

/**
 * Hook to access theme actions.
 */
export const useThemeDispatch = (): ThemeActions => useThemeActionsValues();

/**
 * Convenience hook to access both theme state and actions.
 */
export const useTheme = (): { state: ThemeState; actions: ThemeActions } => ({
  state: useThemeStateValues(),
  actions: useThemeActionsValues(),
});
