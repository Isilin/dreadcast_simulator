import type { Theme } from './theme.types';

/**
 * Detects user's theme preference from system settings.
 * Returns 'dark' if prefers-color-scheme: dark, otherwise 'light'.
 * Defaults to 'dark' in non-browser environments.
 */
export const getSystemTheme = (): Theme => {
  if (typeof window === 'undefined') return 'dark';

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
};

/**
 * Retrieves user's theme preference from localStorage.
 * Returns null if not set or if the stored value is invalid.
 * Handles storage access errors gracefully.
 */
export const getStoredTheme = (storageKey: string): Theme | null => {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(storageKey);
    return stored === 'light' || stored === 'dark' ? stored : null;
  } catch {
    return null;
  }
};

/**
 * Persists theme preference to localStorage.
 * Silently fails if storage is not available (private browsing, etc).
 */
export const saveTheme = (storageKey: string, theme: Theme): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(storageKey, theme);
  } catch {
    // Silently fail if localStorage is not available
  }
};

/**
 * Applies theme to DOM by setting data-theme attribute on document root.
 * Used in conjunction with CSS that uses :root[data-theme="light|dark"] selectors.
 */
export const applyThemeToDOM = (theme: Theme): void => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
};

/**
 * Determines initial theme following priority order:
 * 1. User's stored preference (localStorage)
 * 2. System preference (prefers-color-scheme)
 * Defaults to 'dark' if both are unavailable
 */
export const getInitialTheme = (storageKey: string): Theme => {
  const stored = getStoredTheme(storageKey);
  if (stored) return stored;

  return getSystemTheme();
};
