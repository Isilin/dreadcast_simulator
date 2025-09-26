import { Dialog } from '@base-ui-components/react';

import { KitCombobox } from './kit-combobox';
import styles from './kit-dialog-selector.module.css';
import { KitNumber } from './kit-number';

import { useKits } from '@/data/kit/kit.queries';
import type { Item, ItemSpot } from '@/domain/item';
import type { Kit, KitType } from '@/domain/kit';
import { useSuit } from '@/ui/hooks/use-suit';
import type { KitSelection } from '@/ui/providers/suit.provider';

interface Props {
  type: Item['type'];
}

export const KitDialogSelector = ({ type }: Props) => {
  const suit = useSuit();
  const kits =
    (suit[type as keyof typeof suit] as { kits: Array<KitSelection> })?.kits ||
    [];
  const { data: allKits } = useKits(type as KitType);

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
                  onChange={(newKit: Kit) =>
                    suit.setKit(type as ItemSpot, newKit, index)
                  }
                />
                <KitNumber
                  value={number}
                  onChange={(newNumber) =>
                    suit.setKitNumber(type as ItemSpot, index, newNumber)
                  }
                />
              </li>
            ))}
          </ul>
        )}
        {allKits && (
          <button
            className={styles.addButton}
            onClick={() => suit.addKit(type as ItemSpot, allKits[0], true)}
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
