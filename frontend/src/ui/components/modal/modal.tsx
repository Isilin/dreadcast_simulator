import { Dialog } from '@base-ui-components/react';
import type { PropsWithChildren } from 'react';

import styles from './modal.module.css';

interface Props {}

export const Modal = ({ children }: PropsWithChildren<Props>) => {
  return (
    <Dialog.Portal>
      <Dialog.Backdrop className={styles.backdrop} />
      <Dialog.Popup className={styles.popup}>{children}</Dialog.Popup>
    </Dialog.Portal>
  );
};

Modal.Close = Dialog.Close;
Modal.Description = Dialog.Description;
Modal.Title = Dialog.Title;
Modal.Header = ({ children }: PropsWithChildren) => {
  return <div className={styles.header}>{children}</div>;
};
Modal.Footer = ({ children }: PropsWithChildren) => {
  return <div className={styles.footer}>{children}</div>;
};
Modal.Content = ({ children }: PropsWithChildren) => {
  return <div className={styles.content}>{children}</div>;
};
