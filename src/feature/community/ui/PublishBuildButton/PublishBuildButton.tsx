import { Link } from '@tanstack/react-router';
import { useState } from 'react';

import styles from './PublishBuildButton.module.css';
import type { MyPublication } from '../../model';
import { useMyPublications } from '../../services';
import { PublishBuildDialog } from '../PublishBuildDialog';

import type { useBuildPersistence } from '@/feature/persistence';
import { useActiveSubscription } from '@/feature/subscription';
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

  if (publication?.frozen) {
    return (
      <div className={styles.container}>
        <p className={styles.frozen}>Publication figée : abonnement expiré.</p>
        <Link
          to={Routes.communityById}
          params={{ id: publication.id }}
          className={styles.link}
        >
          Voir la publication
        </Link>
      </div>
    );
  }

  if (!isSubscriber && !publication) {
    return (
      <div className={styles.container}>
        <Link to={Routes.subscription} className={styles.upsell}>
          Publier dans la Communauté · abonnés
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.button}
        onClick={() => setDialog({ publication })}
      >
        {publication
          ? 'Mettre à jour la publication'
          : 'Publier dans la Communauté'}
      </button>
      {publication ? (
        <Link
          to={Routes.communityById}
          params={{ id: publication.id }}
          className={styles.link}
        >
          Voir la publication
        </Link>
      ) : null}
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
