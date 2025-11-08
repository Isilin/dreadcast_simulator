import styles from './DeleteButton.module.css';

import { ClearIcon } from '@/ui/IconTMP';

interface Props {
  onClick: () => void;
}

export const DeleteButton = ({ onClick }: Props) => {
  return (
    <button
      type="button"
      className={styles.button}
      onClick={onClick}
      title="Supprimer"
    >
      <ClearIcon />
    </button>
  );
};
