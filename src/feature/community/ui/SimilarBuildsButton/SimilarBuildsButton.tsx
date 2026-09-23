import { Dialog } from '@base-ui/react/dialog';
import { useState } from 'react';

import styles from './SimilarBuildsButton.module.css';
import { roundStats } from '../../model';
import { useCommunityMeta, useSimilarBuilds } from '../../services';
import { CommunityBuildCard } from '../CommunityBuildCard';

import type { Stat } from '@/domain';
import { useActiveSubscription } from '@/feature/subscription';
import { useSuitSelector } from '@/feature/suit';
import { Modal, Spinner } from '@/ui';

/**
 * "Builds proches du mien": Communauté builds whose stat profile is the
 * closest to the build being edited. Subscribers only.
 */
export const SimilarBuildsButton = () => {
  const { isSubscriber } = useActiveSubscription();
  const stats = useSuitSelector();
  const [requestedStats, setRequestedStats] = useState<Record<
    Stat,
    number
  > | null>(null);

  if (!isSubscriber) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        className={styles.button}
        onClick={() => setRequestedStats(roundStats(stats))}
      >
        Builds proches du mien
      </button>
      <Dialog.Root
        open={requestedStats !== null}
        onOpenChange={(open) => {
          if (!open) setRequestedStats(null);
        }}
      >
        <Modal>
          <Modal.Header>
            <Modal.Title>Builds proches du mien</Modal.Title>
          </Modal.Header>
          <Modal.Content>
            {requestedStats ? (
              <SimilarBuildsList stats={requestedStats} />
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

const SimilarBuildsList = ({ stats }: { stats: Record<Stat, number> }) => {
  const { data, isPending, isError, error } = useSimilarBuilds(stats);
  const { data: meta } = useCommunityMeta();

  if (isPending) {
    return <Spinner />;
  }

  if (isError) {
    return (
      <p className={styles.error} role="alert">
        {error.message}
      </p>
    );
  }

  if (data.items.length === 0) {
    return (
      <p className={styles.muted}>
        Aucun build publié à comparer pour le moment.
      </p>
    );
  }

  return (
    <ul className={styles.list}>
      {data.items.map((build) => (
        <li key={build.id}>
          <CommunityBuildCard
            build={build}
            currentVersion={meta?.currentVersion}
            canFavorite
            similarity={build.similarity}
          />
        </li>
      ))}
    </ul>
  );
};
