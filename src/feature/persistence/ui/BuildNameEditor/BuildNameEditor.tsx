import { Dialog } from '@base-ui/react/dialog';
import { useEffect, useState } from 'react';

import styles from './BuildNameEditor.module.css';
import type { BuildPersistenceState } from '../../model/persitence.hook';
import { getDefaultBuildName } from '../../services';

import { Modal } from '@/ui';
import { RemoveButton } from '@/ui/RemoveButton';

interface BuildNameEditorProps {
  persistence: BuildPersistenceState;
}

export const BuildNameEditor = ({ persistence }: BuildNameEditorProps) => {
  const {
    active,
    builds,
    getBuildName,
    setActiveBuildName,
    deleteActiveBuild,
    storageMode,
  } = persistence;
  const [draftName, setDraftName] = useState(getBuildName(active));
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const persistedName = builds[active]?.name?.trim();
    setDraftName(
      persistedName && persistedName.length > 0
        ? persistedName
        : getDefaultBuildName(active),
    );
  }, [active, builds]);

  const commitName = () => {
    setActiveBuildName(draftName);
  };

  const handleDeleteBuild = async () => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteActiveBuild();
      setIsDeleteDialogOpen(false);
    } catch {
      setDeleteError('Impossible de supprimer ce build. Réessayez plus tard.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <label htmlFor="build-name-input" className="visuallyHidden">
          Nom du build
        </label>
        <input
          id="build-name-input"
          type="text"
          className={styles.input}
          value={draftName}
          onChange={(event) => setDraftName(event.target.value)}
          onBlur={commitName}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.currentTarget.blur();
              return;
            }

            if (event.key === 'Escape') {
              setDraftName(getBuildName(active));
              event.currentTarget.blur();
            }
          }}
          aria-label="Nom du build"
          title={getBuildName(active)}
          maxLength={64}
        />

        <RemoveButton
          label="Supprimer ce build"
          disabled={!builds[active]}
          onClick={() => {
            setDeleteError(null);
            setIsDeleteDialogOpen(true);
          }}
        />
      </div>

      <Dialog.Root
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!isDeleting) setIsDeleteDialogOpen(open);
        }}
      >
        <Modal>
          <Modal.Header>
            <Modal.Title>Supprimer le build</Modal.Title>
          </Modal.Header>
          <Modal.Content>
            <div className={styles.deletePanel}>
              <p>« {getBuildName(active)} » sera supprimé définitivement.</p>
              {storageMode === 'remote' ? (
                <p>
                  Les builds suivants remontent d’un rang. S’il est publié dans
                  la Communauté, la publication reste en ligne mais ne pourra
                  plus être mise à jour.
                </p>
              ) : null}
              {deleteError ? <p role="alert">{deleteError}</p> : null}
            </div>
          </Modal.Content>
          <Modal.Footer>
            <Modal.Close />
            <button
              type="button"
              className={styles.confirmDelete}
              disabled={isDeleting}
              onClick={() => void handleDeleteBuild()}
            >
              {isDeleting ? 'Suppression…' : 'Supprimer'}
            </button>
          </Modal.Footer>
        </Modal>
      </Dialog.Root>
    </>
  );
};
