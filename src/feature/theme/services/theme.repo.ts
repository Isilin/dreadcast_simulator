import {
  applyThemeToDOM,
  getInitialTheme,
  saveTheme,
} from '../model/theme.rules';
import type { Theme } from '../model/theme.types';
import { STORAGE_KEY } from '../model/theme.types';

/**
 * Initializes theme on application startup.
 * Loads from localStorage if available, otherwise detects system preference.
 * Applies theme to DOM immediately.
 */
export const initializeTheme = (): Theme => {
  const theme = getInitialTheme(STORAGE_KEY);
  applyThemeToDOM(theme);
  return theme;
};

/**
 * Persists theme preference to storage and applies it to DOM.
 * Called whenever the user changes the theme.
 */
export const persistTheme = (theme: Theme): void => {
  saveTheme(STORAGE_KEY, theme);
  applyThemeToDOM(theme);
};
