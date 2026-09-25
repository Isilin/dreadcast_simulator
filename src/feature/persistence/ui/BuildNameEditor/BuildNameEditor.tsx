import { Dialog } from '@base-ui/react/dialog';
import { useEffect, useRef, useState } from 'react';

import styles from './BuildNameEditor.module.css';
import type { BuildPersistenceState } from '../../model/persitence.hook';
import { createSharedBuildLink, getDefaultBuildName } from '../../services';

import { Modal } from '@/ui';
import { CheckIcon, CopyIcon, ShareIcon } from '@/ui/Icon';
import { IconButton } from '@/ui/IconButton';
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
    hasUnlimitedSlots,
  } = persistence;
  const [draftName, setDraftName] = useState(getBuildName(active));
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [sharePath, setSharePath] = useState<string | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>(
    'idle',
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const copyTimer = useRef<number | undefined>(undefined);
  const shareLinkRef = useRef<HTMLAnchorElement>(null);

  const canShareBuild = storageMode === 'remote' && hasUnlimitedSlots;
  const canCopyToClipboard =
    typeof navigator !== 'undefined' && Boolean(navigator.clipboard);

  useEffect(() => {
    const persistedName = builds[active]?.name?.trim();
    setDraftName(
      persistedName && persistedName.length > 0
        ? persistedName
        : getDefaultBuildName(active),
    );
  }, [active, builds]);

  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  const commitName = () => {
    setActiveBuildName(draftName);
  };

  const handleShareBuild = async () => {
    setIsShareDialogOpen(true);
    setIsSharing(true);
    setShareError(null);
    setCopyState('idle');

    try {
      const sharedId = await createSharedBuildLink({ slot: active });
      setSharePath(`/shared/${sharedId}`);
    } catch {
      setShareError('Impossible de generer le lien de partage pour ce build.');
      setSharePath(null);
    } finally {
      setIsSharing(false);
    }
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

  const shareUrl =
    sharePath && typeof window !== 'undefined'
      ? `${window.location.origin}${sharePath}`
      : sharePath;

  const copyShareUrl = async () => {
    if (!shareUrl || !canCopyToClipboard) {
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyState('copied');
    } catch {
      // Clipboard refused (permissions, embedded browser): select the link so
      // it can be copied by hand.
      const link = shareLinkRef.current;
      if (link) window.getSelection()?.selectAllChildren(link);
      setCopyState('failed');
    }
    window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopyState('idle'), 2500);
  };

  const copyLabel =
    copyState === 'copied'
      ? 'Lien copié'
      : copyState === 'failed'
        ? 'Copie impossible : lien sélectionné, faites Ctrl+C'
        : 'Copier le lien';

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

        {canShareBuild ? (
          <IconButton
            label="Partager ce build (lien en lecture seule)"
            icon={<ShareIcon />}
            onClick={() => void handleShareBuild()}
          />
        ) : null}

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
                  Les builds suivants remontent d’un rang. Ses liens de partage
                  ne fonctionneront plus ; s’il est publié dans la Communauté,
                  la publication reste en ligne mais ne pourra plus être mise à
                  jour.
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

      <Dialog.Root
        open={isShareDialogOpen}
        onOpenChange={(open) => {
          setIsShareDialogOpen(open);
        }}
      >
        <Modal>
          <Modal.Header>
            <Modal.Title>Lien de partage</Modal.Title>
          </Modal.Header>
          <Modal.Content>
            {isSharing ? <p>Generation du lien de partage...</p> : null}
            {!isSharing && shareError ? <p>{shareError}</p> : null}
            {!isSharing && shareUrl ? (
              <div className={styles.sharePanel}>
                <p>Ce lien ouvre votre build en lecture seule:</p>
                <div className={styles.shareRow}>
                  <a
                    ref={shareLinkRef}
                    href={sharePath ?? '#'}
                    className={styles.shareLink}
                  >
                    {shareUrl}
                  </a>
                  {canCopyToClipboard ? (
                    <IconButton
                      label={copyLabel}
                      icon={
                        copyState === 'copied' ? <CheckIcon /> : <CopyIcon />
                      }
                      variant={
                        copyState === 'copied'
                          ? 'primary'
                          : copyState === 'failed'
                            ? 'warning'
                            : 'default'
                      }
                      onClick={() => void copyShareUrl()}
                    />
                  ) : null}
                </div>
                <p className="visuallyHidden" aria-live="polite">
                  {copyState === 'idle' ? '' : `${copyLabel}.`}
                </p>
              </div>
            ) : null}
          </Modal.Content>
          <Modal.Footer>
            <Modal.Close />
          </Modal.Footer>
        </Modal>
      </Dialog.Root>
    </>
  );
};

export default BuildNameEditor;
