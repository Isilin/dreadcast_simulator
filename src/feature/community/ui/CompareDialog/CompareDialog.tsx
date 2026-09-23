import { Dialog } from '@base-ui/react/dialog';
import { useQuery } from '@tanstack/react-query';
import { useId, useMemo, useState } from 'react';

import styles from './CompareDialog.module.css';
import {
  buildStatComparison,
  computeSnapshotStats,
  formatSignedStatValue,
  formatStatValue,
  type BuildCatalogs,
} from '../../model';
import { communitySnapshotSchema } from '../../services/community.schema';

import type { Stat } from '@/domain';
import {
  fetchRemoteBuilds,
  getDefaultBuildName,
  readLastActiveSlot,
} from '@/feature/persistence';
import { Modal, Spinner } from '@/ui';

interface CompareDialogProps {
  title: string;
  publishedStats: Record<Stat, number>;
  catalogs: BuildCatalogs;
}

/**
 * Compares a published build with one of the user's saved builds.
 */
export const CompareDialog = ({
  title,
  publishedStats,
  catalogs,
}: CompareDialogProps) => {
  const selectId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const builds = useQuery({
    queryKey: ['community', 'compare', 'my-builds'],
    queryFn: ({ signal }) => fetchRemoteBuilds(signal),
    enabled: isOpen,
    staleTime: 0,
  });

  const slots = useMemo(
    () =>
      Object.keys(builds.data ?? {}).sort(
        (slotA, slotB) => Number(slotA) - Number(slotB),
      ),
    [builds.data],
  );

  const lastSlot = readLastActiveSlot();
  const slot =
    selectedSlot ??
    (lastSlot && slots.includes(lastSlot) ? lastSlot : (slots[0] ?? null));

  const rows = useMemo(() => {
    const build = slot ? builds.data?.[slot] : undefined;
    const snapshot = communitySnapshotSchema.safeParse(build);
    if (!snapshot.success) return null;

    return buildStatComparison(
      publishedStats,
      computeSnapshotStats(snapshot.data, catalogs),
    );
  }, [builds.data, catalogs, publishedStats, slot]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger className={styles.trigger}>Comparer</Dialog.Trigger>
      <Modal>
        <Modal.Header>
          <Modal.Title>Comparer avec mon build</Modal.Title>
        </Modal.Header>
        <Modal.Content>
          <div className={styles.body}>
            {builds.isPending ? <Spinner /> : null}
            {builds.isError ? (
              <p className={styles.error} role="alert">
                Impossible de charger vos builds.
              </p>
            ) : null}
            {builds.data && slots.length === 0 ? (
              <p className={styles.muted}>Aucun build sauvegardé à comparer.</p>
            ) : null}

            {slots.length > 0 ? (
              <label htmlFor={selectId} className={styles.picker}>
                <span className={styles.label}>Mon build</span>
                <select
                  id={selectId}
                  className={styles.select}
                  value={slot ?? ''}
                  onChange={(event) => setSelectedSlot(event.target.value)}
                >
                  {slots.map((entry) => (
                    <option key={entry} value={entry}>
                      {builds.data?.[entry]?.name?.trim() ||
                        getDefaultBuildName(entry)}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

            {rows ? (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th scope="col">Stat</th>
                      <th scope="col" title={title}>
                        Publié
                      </th>
                      <th scope="col">Mon build</th>
                      <th scope="col">Écart</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.stat}>
                        <th scope="row" title={row.label}>
                          {row.tag}
                        </th>
                        <td>{formatStatValue(row.published)}</td>
                        <td>{formatStatValue(row.mine)}</td>
                        <td
                          className={
                            row.delta > 0
                              ? styles.higher
                              : row.delta < 0
                                ? styles.lower
                                : styles.equal
                          }
                        >
                          {formatSignedStatValue(row.delta)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>
        </Modal.Content>
        <Modal.Footer>
          <Modal.Close />
        </Modal.Footer>
      </Modal>
    </Dialog.Root>
  );
};
