import { useState } from 'react';

import { MAX_IMPLANTS, useImplantsCount } from '../..';
import { ImplantsDialog } from '../ImplantsDialog';
import styles from './ImplantsButton.module.css';

import { StatusCounterBadge } from '@/ui/StatusCounterBadge';

export const ImplantsButton = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const implantsCount = useImplantsCount();

  return (
    <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
      <Dialog.Trigger className={styles.button}>
        Implants{' '}
        <StatusCounterBadge value={implantsCount} maxValue={MAX_IMPLANTS} />
      </Dialog.Trigger>
      <ImplantsDialog />
    </Dialog>
  );
};
