import type { ReactNode } from 'react';
import { useLayoutEffect } from 'react';

import { useThemeActions } from './theme.store';

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Thin provider that wires up the system theme preference listener.
 * Theme state is managed by the Zustand store (theme.store.ts) and initialized
 * eagerly at module load — no flash of wrong theme possible.
 */
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { setTheme } = useThemeActions();

  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setTheme]);

  return <>{children}</>;
};
