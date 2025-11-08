import { Dialog } from '@base-ui-components/react';
import { useMemo } from 'react';

import type { Kit } from '../../model';
import { useKitsDispatch } from '../../model/kit.hooks';
import { useKitsOnSpot } from '../../model/kit.selectors';
import { useKits } from '../../services';
import { KitCombobox } from '../KitCombobox';
import { KitNumber } from '../KitNumber';
import styles from './KitDialogSelector.module.css';

import { type ItemSpot } from '@/domain';
import { getItemTypes } from '@/feature/item';
import { DeleteButton } from '@/ui/DeleteButton';

interface Props {
  spot: ItemSpot;
}

export const KitDialogSelector = ({ spot }: Props) => {
  const types = useMemo(() => getItemTypes(spot), [spot]);
  const { kits } = useKitsOnSpot(spot);
  const dispatch = useKitsDispatch();
  const { data: allKits } = useKits(types);

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
                  type={types}
                  kit={kit}
                  onChange={(newKit: Kit) =>
                    dispatch.setKit(spot, index, newKit)
                  }
                />
                <KitNumber
                  value={number}
                  onChange={(newNumber) =>
                    dispatch.setKitNumber(spot, index, newNumber)
                  }
                />
                <DeleteButton onClick={() => dispatch.deleteKit(spot, index)} />
              </li>
            ))}
          </ul>
        )}
        {allKits && (
          <button
            className={styles.addButton}
            onClick={() => dispatch.addKit(spot, allKits[0], true)}
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
