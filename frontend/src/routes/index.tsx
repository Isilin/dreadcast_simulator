import { createFileRoute } from '@tanstack/react-router';

import './App.css';
import styles from './index.module.css';

import { ImplantsButton } from '@/feature/implant';
import { IconBar, TabsBar } from '@/feature/persistence/ui';
import { GenderSelector, RaceSelector, Silhouette } from '@/feature/profile';
import { Skills } from '@/feature/stats/skills';
import { Footer, Sidebar, SlotPair } from '@/ui';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className={styles.layout}>
        <Sidebar>
          <GenderSelector />
          <RaceSelector />
          <Skills />
          <ImplantsButton />
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
          <TabsBar />
          <IconBar />
        </Footer>
      </div>
    </>
  );
}
