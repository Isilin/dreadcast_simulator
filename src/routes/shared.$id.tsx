import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

import './App.css';
import layoutStyles from './index.module.css';
import styles from './shared.$id.module.css';

import { DrugsButton } from '@/feature/drug';
import { ImplantsButton } from '@/feature/implant';
import { useItems } from '@/feature/item';
import { useKits } from '@/feature/kit';
import {
  BuildReadOnlyProvider,
  fetchSharedBuildById,
  restoreSharedBuild,
} from '@/feature/persistence';
import { GenderSelector, RaceSelector, Silhouette } from '@/feature/profile';
import { Skills } from '@/feature/stats';
import { TitlesButton } from '@/feature/title';
import { Sidebar, SlotPair, Spinner } from '@/ui';
import Routes from '@/utils/routes';

export const Route = createFileRoute('/shared/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { id } = Route.useParams();
  const { data: allItems } = useItems();
  const { data: allKits } = useKits();

  const {
    data: sharedBuild,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['shared-build', id],
    queryFn: ({ signal }) => fetchSharedBuildById({ id, signal }),
    retry: false,
  });

  useEffect(() => {
    if (!sharedBuild || !allItems || !allKits) {
      return;
    }

    restoreSharedBuild(sharedBuild, allItems, allKits);
  }, [allItems, allKits, sharedBuild]);

  if (isLoading) {
    return (
      <main className={styles.centeredState}>
        <Spinner />
        <p>Chargement du build partagé...</p>
      </main>
    );
  }

  if (isError || !sharedBuild) {
    return (
      <main className={styles.centeredState}>
        <h1>Build partagé indisponible</h1>
        <p>
          {error instanceof Error ? error.message : 'Lien invalide ou expire.'}
        </p>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => void navigate({ to: Routes.home })}
        >
          Retour au simulateur
        </button>
      </main>
    );
  }

  const title = sharedBuild.name?.trim() || 'Build partagé';

  return (
    <BuildReadOnlyProvider value>
      <div className={styles.sharedHeader}>
        <p className={styles.sharedLabel}>Build partagé · Lecture seule</p>
        <h1 className={styles.sharedTitle}>{title}</h1>
      </div>

      <div className={`${layoutStyles.layout} ${styles.readOnlyLayout}`}>
        <Sidebar>
          <GenderSelector />
          <RaceSelector />
          <Skills />
          <ImplantsButton />
          <DrugsButton />
          <TitlesButton />
        </Sidebar>
        <div className={layoutStyles.mainContent}>
          <div className={layoutStyles.equipmentSection}>
            <div className={layoutStyles.bodySlots}>
              <SlotPair spot="head" />
              <SlotPair spot="chest" />
              <SlotPair spot="legs" />
              <SlotPair spot="feet" />
            </div>

            <div className={layoutStyles.weaponSlots}>
              <SlotPair spot="leftArm" reversed />
              <SlotPair spot="rightArm" reversed />
              <SlotPair spot="secondary" reversed />
            </div>
          </div>
          <Silhouette />
        </div>
      </div>
    </BuildReadOnlyProvider>
  );
}
