import { Dialog } from '@base-ui-components/react';

import styles from './implant-dialog-selector.module.css';
import { ImplantSelector } from './implant-selector';

import { useImplants } from '@/data/implant/implant.queries';

export const ImplantDialogSElector = () => {
  const { data: implants, status, error } = useImplants();

  return (
    <Dialog.Portal>
      <Dialog.Backdrop className={styles.Backdrop} />
      <Dialog.Popup className={styles.Popup}>
        <Dialog.Title>Choisissez vos implants</Dialog.Title>
        <div className={styles.content}>
          {status === 'error' && <p>{error.message}</p>}
          {status === 'pending' && <p>Loading...</p>}
          {status === 'success' &&
            implants?.map((i) => <ImplantSelector implant={i} key={i.name} />)}
        </div>
        <div className={styles.Actions}>
          <Dialog.Close className={styles.Button}>Close</Dialog.Close>
        </div>
      </Dialog.Popup>
    </Dialog.Portal>
  );
};
