import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

import './App.css';
import layoutStyles from './index.module.css';
import styles from './shared.$id.module.css';

import { DrugsButton, useDrugStore } from '@/feature/drug';
import { ImplantsButton, useImplantStore } from '@/feature/implant';
import { useItems, useItemStore } from '@/feature/item';
import { useKits, useKitStore } from '@/feature/kit';
import {
  IconBar,
  fetchSharedBuildById,
  restoreItems,
  restoreKits,
} from '@/feature/persistence';
import { GenderSelector, RaceSelector, Silhouette } from '@/feature/profile';
import { useProfileStore } from '@/feature/profile/model/profile.store';
import { Skills } from '@/feature/stats';
import { Footer, Sidebar, SlotPair, Spinner } from '@/ui';
import { setBuildReadOnlyMode } from '@/utils/build-read-only';
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
    setBuildReadOnlyMode(true);

    return () => {
      setBuildReadOnlyMode(false);
    };
  }, []);

  useEffect(() => {
    if (!sharedBuild || !allItems || !allKits) {
      return;
    }

    useProfileStore.getState().replaceProfile(sharedBuild.profile);
    useImplantStore.getState().replaceImplants(sharedBuild.implants);
    useItemStore
      .getState()
      .replaceItems(restoreItems(sharedBuild.items, allItems));
    useKitStore.getState().replaceKits(restoreKits(sharedBuild.kits, allKits));
    useDrugStore.getState().replaceDrug(sharedBuild.drug);
  }, [allItems, allKits, sharedBuild]);

  if (isLoading) {
    return (
      <main className={styles.centeredState}>
        <Spinner />
        <p>Chargement du build partage...</p>
      </main>
    );
  }

  if (isError || !sharedBuild) {
    return (
      <main className={styles.centeredState}>
        <h1>Build partage indisponible</h1>
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

  const title = sharedBuild.name?.trim() || 'Build partage';

  return (
    <>
      <div className={styles.sharedHeader}>
        <p className={styles.sharedLabel}>Mode lecture seule</p>
        <h1 className={styles.sharedTitle}>{title}</h1>
      </div>

      <div className={`${layoutStyles.layout} ${styles.readOnlyLayout}`}>
        <Sidebar>
          <GenderSelector />
          <RaceSelector />
          <Skills />
          <ImplantsButton />
          <DrugsButton />
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

      <Footer>
        <IconBar />
      </Footer>
    </>
  );
}
