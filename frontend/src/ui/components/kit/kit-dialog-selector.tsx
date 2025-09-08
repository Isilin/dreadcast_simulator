import { Dialog } from '@base-ui-components/react';

import { KitCard } from './kit-card';
import styles from './kit-dialog-selector.module.css';

import { useKits } from '@/data/kit/kit.queries';
import type { Kit } from '@/domain/kit';

interface Props {
  type?: Kit['type'];
  onKitSelect: (kit: Kit) => void;
}

export const KitDialogSelector = ({ type, onKitSelect }: Props) => {
  const { data: kits, status, error } = useKits(type);

  return (
    <Dialog.Portal>
      <Dialog.Backdrop className={styles.Backdrop} />
      <Dialog.Popup className={styles.Popup}>
        <Dialog.Title className={styles.Title}>Choisissez un kit</Dialog.Title>
        <div className={styles.Description}>
          {status === 'error' && <p>{error.message}</p>}
          {status === 'pending' && <p>Loading...</p>}
          {status === 'success' &&
            kits?.map((kit) => (
              <KitCard
                key={kit.id}
                kit={kit}
                onClick={() => onKitSelect(kit)}
              />
            ))}
        </div>
        <div className={styles.Actions}>
          <Dialog.Close className={styles.Button}>Close</Dialog.Close>
        </div>
      </Dialog.Popup>
    </Dialog.Portal>
  );
};
