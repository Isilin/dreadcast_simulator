import styles from './RemoveButton.module.css';
import { TrashIcon } from '../Icon';

interface RemoveButtonProps {
  /** Accessible name and tooltip, e.g. "Supprimer Lunette". */
  label: string;
  /** Placement in the parent layout. */
  className?: string;
  disabled?: boolean;
  onClick: () => void;
}

/** Red trash button that removes an element. */
export const RemoveButton = ({
  label,
  className,
  disabled = false,
  onClick,
}: RemoveButtonProps) => (
  <button
    type="button"
    className={className ? `${styles.button} ${className}` : styles.button}
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    title={label}
  >
    <TrashIcon />
  </button>
);
