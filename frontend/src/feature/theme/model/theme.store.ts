import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import type { Theme, ThemeState } from './theme.types';
import { STORAGE_KEY } from './theme.types';

import { getStoredTheme } from '@/feature/theme/model/theme.rules';
import {
  initializeTheme,
  persistTheme,
} from '@/feature/theme/services/theme.repo';

export interface ThemeActions {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

interface ThemeStore extends ThemeState, ThemeActions {}

// Apply theme to DOM synchronously at module load (no flash of wrong theme)
const initialTheme = initializeTheme();

export const useThemeStore = create<ThemeStore>((set, get) => ({
  current: initialTheme,
  // true when no stored preference exists and theme comes from system
  isSystemPreference: getStoredTheme(STORAGE_KEY) === null,
  setTheme: (theme) => {
    persistTheme(theme);
    set({ current: theme, isSystemPreference: false });
  },
  toggleTheme: () => {
    const next = get().current === 'dark' ? 'light' : 'dark';
    persistTheme(next);
    set({ current: next, isSystemPreference: false });
  },
}));

export const useThemeState = (): ThemeState =>
  useThemeStore(
    useShallow((s) => ({
      current: s.current,
      isSystemPreference: s.isSystemPreference,
    })),
  );

export const useThemeActions = (): ThemeActions =>
  useThemeStore(
    useShallow((s) => ({ setTheme: s.setTheme, toggleTheme: s.toggleTheme })),
  );

export const useTheme = (): { state: ThemeState; actions: ThemeActions } => ({
  state: useThemeState(),
  actions: useThemeActions(),
});
