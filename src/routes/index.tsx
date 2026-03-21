import { createFileRoute } from '@tanstack/react-router';

import './App.css';
import styles from './index.module.css';

import { DrugsButton } from '@/feature/drug';
import { ImplantsButton } from '@/feature/implant';
import { useItems } from '@/feature/item';
import { useKits } from '@/feature/kit';
import {
  BuildNameEditor,
  IconBar,
  TabsBar,
  useBuildPersistence,
} from '@/feature/persistence';
import { GenderSelector, RaceSelector, Silhouette } from '@/feature/profile';
import { Skills } from '@/feature/stats';
import { Footer, Sidebar, SlotPair } from '@/ui';
import Routes from '@/utils/routes';

export const Route = createFileRoute(Routes.home)({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: allItems } = useItems();
  const { data: allKits } = useKits();

  const persistence = useBuildPersistence({
    allItems,
    allKits,
  });

  return (
    <>
      <BuildNameEditor persistence={persistence} />
      <div className={styles.layout}>
        <Sidebar>
          <GenderSelector />
          <RaceSelector />
          <Skills />
          <ImplantsButton />
          <DrugsButton />
        </Sidebar>
        <div className={styles.mainContent}>
          <div className={styles.equipmentSection}>
            <div className={styles.bodySlots}>
              <SlotPair spot="head" />
              <SlotPair spot="chest" />
              <SlotPair spot="legs" />
              <SlotPair spot="feet" />
            </div>

            <div className={styles.weaponSlots}>
              <SlotPair spot="leftArm" reversed />
              <SlotPair spot="rightArm" reversed />
              <SlotPair spot="secondary" reversed />
            </div>
          </div>
          <Silhouette />
        </div>
        <Footer>
          <TabsBar persistence={persistence} />
          <IconBar />
        </Footer>
      </div>
    </>
  );
}
