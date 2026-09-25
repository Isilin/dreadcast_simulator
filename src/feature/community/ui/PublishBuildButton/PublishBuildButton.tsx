import { Link } from '@tanstack/react-router';
import { useState } from 'react';

import styles from './PublishBuildButton.module.css';
import type { MyPublication } from '../../model';
import { useMyPublications } from '../../services';
import { PublishBuildDialog } from '../PublishBuildDialog';
import { SharePublicationButton } from '../SharePublicationButton';

import type { useBuildPersistence } from '@/feature/persistence';
import { useActiveSubscription } from '@/feature/subscription';
import {
  EyeIcon,
  LockIcon,
  RefreshIcon,
  SnowflakeIcon,
  UploadIcon,
} from '@/ui/Icon';
import { IconButton, IconTooltip, iconButtonClassName } from '@/ui/IconButton';
import Routes from '@/utils/routes';

interface PublishBuildButtonProps {
  persistence: ReturnType<typeof useBuildPersistence>;
}

/**
 * Workbench entry point of the Communauté for the active build slot:
 * publish, update, frozen publication or subscription upsell.
 */
export const PublishBuildButton = ({
  persistence,
}: PublishBuildButtonProps) => {
  // The target publication is captured when the dialog opens: publishing
  // refetches "my publications" and must not switch the dialog to "update".
  const [dialog, setDialog] = useState<{
    publication: MyPublication | undefined;
  } | null>(null);
  const { isSubscriber, isLoading } = useActiveSubscription();
  const isRemote = persistence.storageMode === 'remote';
  const { data: publications } = useMyPublications({ enabled: isRemote });

  if (!isRemote || isLoading) {
    return null;
  }

  const publication = publications?.find(
    (entry) => entry.sourceSlot === persistence.active,
  );

  const viewLink = publication ? (
    <>
      <IconTooltip label="Voir la publication">
        <Link
          to={Routes.communityById}
          params={{ id: publication.id }}
          className={iconButtonClassName}
          aria-label="Voir la publication"
        >
          <EyeIcon />
        </Link>
      </IconTooltip>
      <SharePublicationButton publicationId={publication.id} />
    </>
  ) : null;

  if (publication?.frozen) {
    return (
      <div className={styles.container}>
        <IconTooltip label="Publication figée : abonnement expiré">
          <span
            className={iconButtonClassName}
            data-variant="warning"
            role="img"
            tabIndex={0}
            aria-label="Publication figée : abonnement expiré"
          >
            <SnowflakeIcon />
          </span>
        </IconTooltip>
        {viewLink}
      </div>
    );
  }

  if (!isSubscriber && !publication) {
    return (
      <div className={styles.container}>
        <IconTooltip label="Publier dans la Communauté · réservé aux abonnés">
          <Link
            to={Routes.subscription}
            className={iconButtonClassName}
            data-variant="muted"
            aria-label="Publier dans la Communauté · réservé aux abonnés"
          >
            <LockIcon />
          </Link>
        </IconTooltip>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <IconButton
        label={
          publication
            ? 'Mettre à jour la publication'
            : 'Publier dans la Communauté'
        }
        icon={publication ? <RefreshIcon /> : <UploadIcon />}
        variant="primary"
        onClick={() => setDialog({ publication })}
      />
      {viewLink}
      <PublishBuildDialog
        persistence={persistence}
        publication={dialog?.publication}
        open={dialog !== null}
        onOpenChange={(open) => {
          if (!open) setDialog(null);
        }}
      />
    </div>
  );
};
