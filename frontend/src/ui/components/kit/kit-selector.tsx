import { Dialog } from '@base-ui-components/react';
import { useState } from 'react';

import { KitCard } from './kit-card';
import { KitDialogSelector } from './kit-dialog-selector';
import styles from './kit-selector.module.css';

import type { Kit } from '@/domain/kit';

interface Props {
  type?: Kit['type'];
}

export const KitSelector = ({ type }: Props) => {
  const [currentKit, setCurrentKit] = useState<Kit | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const onKitSelect = (kit: Kit) => {
    setCurrentKit(kit);
    setDialogOpen(false);
  };

  return (
    <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
      <Dialog.Trigger className={styles.card} disabled={!!currentKit}>
        {currentKit ? <KitCard kit={currentKit} /> : 'Choisir un kit'}
      </Dialog.Trigger>
      <KitDialogSelector onKitSelect={onKitSelect} type={type} />
    </Dialog.Root>
  );
};
