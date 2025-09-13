import { Dialog } from '@base-ui-components/react';
import { useState } from 'react';

import { ImplantDialogSElector } from './implant-dialog-selector';
import { ImplantsCounter } from './implants-counter';
import styles from './implants.module.css';

export const Implants = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
      <Dialog.Trigger className={styles.button}>
        Implants <ImplantsCounter />
      </Dialog.Trigger>
      <ImplantDialogSElector />
    </Dialog.Root>
  );
};
