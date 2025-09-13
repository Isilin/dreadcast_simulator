import type { CSSProperties } from 'react';

import styles from './spinner.module.css';

interface SpinnerProps {
  size?: number | string;
  color?: string;
  trackColor?: string;
  thickness?: number;
  label?: string;
  className?: string;
  style?: CSSProperties;
}

export function Spinner({
  size = 20,
  color = 'currentColor',
  trackColor = 'color-mix(in oklch, currentColor 20%, transparent)',
  thickness = 2,
  label = 'Chargement…',
  className,
  style,
}: SpinnerProps) {
  const s: CSSProperties = {
    ['--sp-size' as keyof CSSProperties]:
      typeof size === 'number' ? `${size}px` : size,
    ['--sp-color' as keyof CSSProperties]: color,
    ['--sp-track' as keyof CSSProperties]: trackColor,
    ['--sp-thickness' as keyof CSSProperties]: `${thickness}px`,
    ...style,
  };

  return (
    <span
      className={`${styles.spinner} ${className ?? ''}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
      style={s}
    >
      <span className={styles.spinnerRing} aria-hidden="true" />
    </span>
  );
}
