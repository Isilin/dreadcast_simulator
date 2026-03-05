import { Dialog } from '@base-ui/react';
import { useState } from 'react';

import { useDrugsState } from '../../model/drug.hooks';
import { DrugsDialog } from '../DrugsDialog';
import styles from './DrugsButton.module.css';

export const DrugsButton = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const selectedDrug = useDrugsState();

  return (
    <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
      <Dialog.Trigger className={styles.button}>
        Drogues {selectedDrug ? '(1)' : '(0)'}
      </Dialog.Trigger>
      <DrugsDialog />
    </Dialog.Root>
  );
};
