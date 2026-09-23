import { Dialog } from '@base-ui/react/dialog';

import styles from './PseudoDialog.module.css';
import { usePseudoDialog } from '../../model';
import { useAccountProfile } from '../../services';
import { PseudoForm } from '../PseudoForm';

import { Modal, Spinner } from '@/ui';

/**
 * Account pseudo dialog, mounted once at the root and opened through
 * usePseudoDialog().
 */
export const PseudoDialog = () => {
  const { isOpen, close } = usePseudoDialog();
  const { data: profile, isLoading } = useAccountProfile();

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <Modal>
        <Modal.Header>
          <Modal.Title>Pseudo de la Communauté</Modal.Title>
        </Modal.Header>
        <Modal.Content>
          {isLoading ? <Spinner /> : null}
          {!isLoading && profile?.pseudo ? (
            <div className={styles.current}>
              <p>
                Votre pseudo : <strong>{profile.pseudo}</strong>
              </p>
              <p className={styles.note}>
                Le pseudo est définitif et ne peut plus être modifié.
              </p>
            </div>
          ) : null}
          {!isLoading && !profile?.pseudo ? (
            <PseudoForm onCreated={close} />
          ) : null}
        </Modal.Content>
        <Modal.Footer>
          <Modal.Close />
        </Modal.Footer>
      </Modal>
    </Dialog.Root>
  );
};
