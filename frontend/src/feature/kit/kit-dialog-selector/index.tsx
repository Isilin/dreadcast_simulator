import { Dialog } from '@base-ui-components/react';
import { useMemo } from 'react';

import { KitCombobox } from '../kit-combobox';
import { KitNumber } from '../kit-number';
import styles from './kit-dialog-selector.module.css';

import { useKits } from '@/data/kit';
import { toKitType, toType, type ItemSpot, type Kit } from '@/domain';
import { DeleteButton } from '@/ui/delete-button';
import { useSuit } from '@/ui/hooks/use-suit';

interface Props {
  spot: ItemSpot;
}

export const KitDialogSelector = ({ spot }: Props) => {
  const suit = useSuit();
  const type = useMemo(() => toType(spot), [spot]);
  const kits = suit[spot]?.kits || [];
  const { data: allKits } = useKits(toKitType(type));

  return (
    <Dialog.Portal>
      <Dialog.Backdrop className={styles.Backdrop} />
      <Dialog.Popup className={styles.Popup}>
        <Dialog.Title className={styles.Title}>Choisissez un kit</Dialog.Title>
        {kits.length > 0 && (
          <ul className={styles.KitList}>
            {kits.map(({ kit, number }, index) => (
              <li key={index} className={styles.KitListItem}>
                <KitCombobox
                  type={type}
                  kit={kit}
                  onChange={(newKit: Kit) => suit.setKit(spot, newKit, index)}
                />
                <KitNumber
                  value={number}
                  onChange={(newNumber) =>
                    suit.setKitNumber(spot, index, newNumber)
                  }
                />
                <DeleteButton onClick={() => suit.removeKit(spot, index)} />
              </li>
            ))}
          </ul>
        )}
        {allKits && (
          <button
            className={styles.addButton}
            onClick={() => suit.addKit(spot, allKits[0], true)}
          >
            +
          </button>
        )}
        <div className={styles.Actions}>
          <Dialog.Close className={styles.Button}>Close</Dialog.Close>
        </div>
      </Dialog.Popup>
    </Dialog.Portal>
  );
};
