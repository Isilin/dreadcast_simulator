import { Tooltip } from '@base-ui/react/tooltip';
import type { ReactElement, ReactNode } from 'react';

import styles from './IconButton.module.css';

export type IconButtonVariant = 'default' | 'primary' | 'muted' | 'warning';

interface IconTooltipProps {
  /** Tooltip text, also used as the accessible name of the trigger. */
  label: string;
  /** Trigger element (button, router link...), receives the tooltip props. */
  children: ReactElement<Record<string, unknown>>;
}

/** Shows `label` in a tooltip over any focusable element. */
export const IconTooltip = ({ label, children }: IconTooltipProps) => (
  <Tooltip.Root>
    <Tooltip.Trigger delay={250} render={children} />
    <Tooltip.Portal>
      <Tooltip.Positioner
        className={styles.positioner}
        side="bottom"
        sideOffset={6}
      >
        <Tooltip.Popup className={styles.popup}>{label}</Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  </Tooltip.Root>
);

interface IconButtonProps {
  label: string;
  icon: ReactNode;
  variant?: IconButtonVariant;
  disabled?: boolean;
  onClick?: () => void;
}

/** Square button showing only an icon, its label lives in a tooltip. */
export const IconButton = ({
  label,
  icon,
  variant = 'default',
  disabled = false,
  onClick,
}: IconButtonProps) => (
  <IconTooltip label={label}>
    <button
      type="button"
      className={styles.button}
      data-variant={variant}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
    >
      {icon}
    </button>
  </IconTooltip>
);

/** Class names to style a link (e.g. a router Link) as an icon button. */
export const iconButtonClassName = styles.button;
