import { useDrugs } from '../../services';
import { DrugSelector } from '../DrugSelector';
import styles from './DrugsDialog.module.css';

import { Modal } from '@/ui';

export const DrugsDialog = () => {
  const { data: drugs, status, error } = useDrugs();

  return (
    <Modal>
      <Modal.Header>
        <Modal.Title>Choisissez une drogue</Modal.Title>
      </Modal.Header>
      <Modal.Content>
        {status === 'error' && <p>{error.message}</p>}
        {status === 'pending' && <p>Chargement…</p>}
        {status === 'success' && (
          <ul className={styles.list}>
            {drugs?.map((drug) => (
              <DrugSelector key={drug.id} drug={drug} />
            ))}
          </ul>
        )}
      </Modal.Content>
      <Modal.Footer>
        <Modal.Close />
      </Modal.Footer>
    </Modal>
  );
};
