import { Dialog } from '@base-ui/react/dialog';
import { useEffect, useRef, useState } from 'react';

import styles from './SharePublicationButton.module.css';

import { Modal } from '@/ui';
import { CheckIcon, ShareIcon } from '@/ui/Icon';
import Routes from '@/utils/routes';

interface SharePublicationButtonProps {
  publicationId: string;
}

/**
 * Copies the link of a Communauté publication: anyone can open it, guests
 * get the same preview as signed-in non-subscribers.
 */
export const SharePublicationButton = ({
  publicationId,
}: SharePublicationButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isFallbackOpen, setIsFallbackOpen] = useState(false);
  const copyTimer = useRef<number | undefined>(undefined);

  const shareUrl = `${window.location.origin}${Routes.community}/${publicationId}`;

  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // Clipboard missing or refused (permissions, embedded browser): show
      // the link, selected, so it can be copied by hand.
      setIsFallbackOpen(true);
      return;
    }

    setIsCopied(true);
    window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <>
      <button
        type="button"
        className={styles.button}
        onClick={() => void copyLink()}
      >
        {isCopied ? (
          <CheckIcon className={styles.icon} />
        ) : (
          <ShareIcon className={styles.icon} />
        )}
        <span>{isCopied ? 'Lien copié' : 'Copier le lien'}</span>
      </button>
      <p className="visuallyHidden" aria-live="polite">
        {isCopied ? 'Lien de la publication copié.' : ''}
      </p>

      <Dialog.Root open={isFallbackOpen} onOpenChange={setIsFallbackOpen}>
        <Modal>
          <Modal.Header>
            <Modal.Title>Lien de la publication</Modal.Title>
          </Modal.Header>
          <Modal.Content>
            <div className={styles.fallback}>
              <p>
                Copie automatique impossible : le lien est sélectionné, faites
                Ctrl+C.
              </p>
              <input
                type="text"
                readOnly
                aria-label="Lien de la publication"
                className={styles.link}
                value={shareUrl}
                onFocus={(event) => event.currentTarget.select()}
              />
            </div>
          </Modal.Content>
          <Modal.Footer>
            <Modal.Close />
          </Modal.Footer>
        </Modal>
      </Dialog.Root>
    </>
  );
};
