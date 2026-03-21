import { Dialog } from '@base-ui/react';
import { useEffect, useState } from 'react';

import styles from './BuildNameEditor.module.css';
import type { BuildPersistenceState } from '../../model/persitence.hook';
import { createSharedBuildLink, getDefaultBuildName } from '../../services';

import { Modal } from '@/ui';

interface BuildNameEditorProps {
  persistence: BuildPersistenceState;
}

export const BuildNameEditor = ({ persistence }: BuildNameEditorProps) => {
  const {
    active,
    builds,
    getBuildName,
    setActiveBuildName,
    storageMode,
    hasUnlimitedSlots,
  } = persistence;
  const [draftName, setDraftName] = useState(getBuildName(active));
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [sharePath, setSharePath] = useState<string | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);

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

  const commitName = () => {
    setActiveBuildName(draftName);
  };

  const handleShareBuild = async () => {
    setIsShareDialogOpen(true);
    setIsSharing(true);
    setShareError(null);

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

  const shareUrl =
    sharePath && typeof window !== 'undefined'
      ? `${window.location.origin}${sharePath}`
      : sharePath;

  const copyShareUrl = async () => {
    if (!shareUrl || !canCopyToClipboard) {
      return;
    }

    await navigator.clipboard.writeText(shareUrl);
  };

  return (
    <>
      <div className={styles.container}>
        <label htmlFor="build-name-input" className={styles.label}>
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
          <button
            type="button"
            className={styles.shareButton}
            onClick={() => void handleShareBuild()}
          >
            Partager un build
          </button>
        ) : null}
      </div>

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
                <a href={sharePath ?? '#'} className={styles.shareLink}>
                  {shareUrl}
                </a>
                {canCopyToClipboard ? (
                  <button
                    type="button"
                    className={styles.copyButton}
                    onClick={() => void copyShareUrl()}
                  >
                    Copier le lien
                  </button>
                ) : null}
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
