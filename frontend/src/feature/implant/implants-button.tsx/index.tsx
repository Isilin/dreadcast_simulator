import { Dialog } from '@base-ui-components/react';
import { useState } from 'react';

import { ImplantDialogSelector } from '../implant-dialog-selector';
import { ImplantsCounter } from '../implants-counter';
import styles from './implants-button.module.css';

export const ImplantsButton = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
      <Dialog.Trigger className={styles.button}>
        Implants <ImplantsCounter />
      </Dialog.Trigger>
      <ImplantDialogSelector />
    </Dialog.Root>
  );
};
