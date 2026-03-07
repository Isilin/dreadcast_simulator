/** Available theme values for the application */
export const THEME_VALUES = ['light', 'dark'] as const;

/** Type for current theme, derived from THEME_VALUES enum */
export type Theme = (typeof THEME_VALUES)[number];

/** State shape for theme management */
export interface ThemeState {
  /** Currently active theme */
  current: Theme;
  /** Whether the theme was set by system preference or user choice */
  isSystemPreference: boolean;
}

/** localStorage key for persisting theme preference */
export const STORAGE_KEY = 'dreadcast.theme.v1';
