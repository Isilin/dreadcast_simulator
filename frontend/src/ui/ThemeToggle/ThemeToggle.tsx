import styles from './ThemeToggle.module.css';

import { useTheme } from '@/feature/theme';
import { MoonIcon, SunIcon } from '@/ui';

/**
 * Theme toggle switch component.
 * Displays a sliding toggle between light and dark modes.
 * Positioned in the top-right corner, fixed to the viewport.
 *
 * Features:
 * - Smooth animation when toggling between themes
 * - Displays sun/moon icons inside the sliding thumb
 * - Accessible with proper ARIA attributes
 * - Auto-detects and respects system theme preference
 */
export const ThemeToggle = () => {
  const { state, actions } = useTheme();
  const isDark = state.current === 'dark';

  return (
    <button
      className={styles.switchContainer}
      onClick={actions.toggleTheme}
      aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
      title={isDark ? 'Mode clair' : 'Mode sombre'}
      role="switch"
      aria-checked={isDark}
    >
      <div className={styles.switchTrack}>
        <div
          className={`${styles.switchThumb} ${isDark ? styles.isDark : styles.isLight}`}
        >
          <div className={styles.iconWrapper}>
            {isDark ? <MoonIcon /> : <SunIcon />}
          </div>
        </div>
      </div>
    </button>
  );
};
