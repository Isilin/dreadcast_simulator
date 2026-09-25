import { Dialog } from '@base-ui/react/dialog';
import { useState } from 'react';

import styles from './TitlesButton.module.css';
import { useTitlesState } from '../../model/title.store';
import { TitlesPanel } from '../TitlesPanel';

import { Modal } from '@/ui';

export const TitlesButton = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const titlesCount = useTitlesState().length;

  return (
    <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
      <Dialog.Trigger className={styles.button}>
        Titres ({titlesCount})
      </Dialog.Trigger>
      <Modal>
        <Modal.Header>
          <Modal.Title>Titres débloqués</Modal.Title>
        </Modal.Header>
        <Modal.Content>
          <TitlesPanel />
        </Modal.Content>
        <Modal.Footer>
          <Modal.Close />
        </Modal.Footer>
      </Modal>
    </Dialog.Root>
  );
};
