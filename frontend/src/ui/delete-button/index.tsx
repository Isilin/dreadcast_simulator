import styles from './delete-button.module.css';

import { ClearIcon } from '@/ui/icons';

interface Props {
  onClick: () => void;
}

export const DeleteButton = ({ onClick }: Props) => {
  return (
    <button
      type="button"
      className={styles.iconDanger}
      onClick={onClick}
      title="Supprimer"
    >
      <ClearIcon />
    </button>
  );
};
