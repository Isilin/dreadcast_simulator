import { useMemo } from 'react';

import type { Kit } from '../../model';
import { useKitsOnSpot } from '../../model/kit.selectors';
import { useKitsActions } from '../../model/kit.store';
import { useKits } from '../../services';
import { KitCombobox } from '../KitCombobox';
import { KitNumber } from '../KitNumber';
import styles from './KitDialogSelector.module.css';

import { type ItemSpot } from '@/domain';
import { getItemTypes } from '@/feature/item';
import { DeleteButton, Modal, Spinner } from '@/ui';

interface Props {
  spot: ItemSpot;
}

export const KitDialogSelector = ({ spot }: Props) => {
  const types = useMemo(() => getItemTypes(spot), [spot]);
  const { kits } = useKitsOnSpot(spot);
  const actions = useKitsActions();
  const {
    data: allKits,
    status: kitsStatus,
    error: kitsError,
  } = useKits(types);

  return (
    <Modal>
      <Modal.Header>
        <Modal.Title>Choisissez un kit</Modal.Title>
      </Modal.Header>
      <Modal.Content>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {kits.length > 0 && (
            <ul className={styles.KitList}>
              {kits.map(({ kit, number }, index) => (
                <li key={index} className={styles.KitListItem}>
                  <KitCombobox
                    type={types}
                    kit={kit}
                    onChange={(newKit: Kit | null) => {
                      if (newKit !== null) actions.setKit(spot, index, newKit);
                    }}
                  />
                  <KitNumber
                    value={number}
                    onChange={(newNumber) =>
                      actions.setKitNumber(spot, index, newNumber)
                    }
                  />
                  <DeleteButton
                    onClick={() => actions.deleteKit(spot, index)}
                  />
                </li>
              ))}
            </ul>
          )}
          {kitsStatus === 'error' && <p>{kitsError.message}</p>}
          {kitsStatus === 'pending' && <Spinner />}
          {kitsStatus === 'success' && allKits && (
            <button
              className={styles.addButton}
              onClick={() => actions.addKit(spot, allKits[0], true)}
            >
              +
            </button>
          )}
        </div>
      </Modal.Content>
      <Modal.Footer>
        <Modal.Close />
      </Modal.Footer>
    </Modal>
  );
};
