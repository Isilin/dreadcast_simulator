import { Dialog } from '@base-ui/react/dialog';
import { useEffect, useRef, useState } from 'react';

import styles from './SharePublicationButton.module.css';

import { Modal } from '@/ui';
import { CheckIcon, CopyIcon, ShareIcon } from '@/ui/Icon';
import { IconButton } from '@/ui/IconButton';
import Routes from '@/utils/routes';

interface SharePublicationButtonProps {
  publicationId: string;
}

/**
 * Share link of a Communauté publication: anyone can open it, guests get
 * the same preview as signed-in non-subscribers.
 */
export const SharePublicationButton = ({
  publicationId,
}: SharePublicationButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>(
    'idle',
  );
  const copyTimer = useRef<number | undefined>(undefined);
  const shareLinkRef = useRef<HTMLAnchorElement>(null);

  const canCopyToClipboard =
    typeof navigator !== 'undefined' && Boolean(navigator.clipboard);
  const sharePath = `${Routes.community}/${publicationId}`;
  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${sharePath}`
      : sharePath;

  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  const copyShareUrl = async () => {
    if (!canCopyToClipboard) {
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
      <IconButton
        label="Partager la publication"
        icon={<ShareIcon />}
        onClick={() => {
          setCopyState('idle');
          setIsOpen(true);
        }}
      />

      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Modal>
          <Modal.Header>
            <Modal.Title>Lien de partage</Modal.Title>
          </Modal.Header>
          <Modal.Content>
            <div className={styles.sharePanel}>
              <p>
                Ce lien ouvre la publication dans la Communauté, y compris pour
                un visiteur non connecté :
              </p>
              <div className={styles.shareRow}>
                <a
                  ref={shareLinkRef}
                  href={sharePath}
                  className={styles.shareLink}
                >
                  {shareUrl}
                </a>
                {canCopyToClipboard ? (
                  <IconButton
                    label={copyLabel}
                    icon={copyState === 'copied' ? <CheckIcon /> : <CopyIcon />}
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
          </Modal.Content>
          <Modal.Footer>
            <Modal.Close />
          </Modal.Footer>
        </Modal>
      </Dialog.Root>
    </>
  );
};
