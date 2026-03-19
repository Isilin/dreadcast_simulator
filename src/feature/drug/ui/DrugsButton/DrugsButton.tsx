import { Dialog } from '@base-ui/react';
import { useState } from 'react';

import { useDrugId } from '../../model/drug.store';
import { DrugsDialog } from '../DrugsDialog';
import styles from './DrugsButton.module.css';

import { StatusCounterBadge } from '@/ui/StatusCounterBadge';

export const DrugsButton = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const selectedDrug = useDrugId();

  return (
    <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
      <Dialog.Trigger className={styles.button}>
        Drogues
        <StatusCounterBadge value={selectedDrug ? 1 : 0} maxValue={1} />
      </Dialog.Trigger>
      <DrugsDialog />
    </Dialog.Root>
  );
};
