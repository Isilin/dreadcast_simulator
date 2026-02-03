import { createFileRoute } from '@tanstack/react-router';

import './App.css';
import styles from './index.module.css';

import { ImplantsButton } from '@/feature/implant';
import { ItemSelector } from '@/feature/item';
import { KitSelector } from '@/feature/kit';
import { IconBar, TabsBar } from '@/feature/persistence/ui';
import { GenderSelector, RaceSelector, Silhouette } from '@/feature/profile';
import { Skills } from '@/feature/stats/skills';
import { Footer } from '@/ui';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className={styles.layout}>
      <div className={styles.sidebar}>
        <GenderSelector />
        <RaceSelector />
        <Skills />
        <ImplantsButton />
      </div>
      <div className={styles.mainContent}>
        <div className={styles.equipmentSection}>
          <div className={styles.equipmentGroup}>
            <div className={styles.itemColumn}>
              <ItemSelector spot="head" />
              <ItemSelector spot="chest" />
              <ItemSelector spot="legs" />
              <ItemSelector spot="feet" />
            </div>
            <div className={styles.kitColumn}>
              <KitSelector spot="head" />
              <KitSelector spot="chest" />
              <KitSelector spot="legs" />
              <KitSelector spot="feet" />
            </div>
          </div>

          <div className={styles.equipmentGroup}>
            <div className={styles.weaponsGroup}>
              <KitSelector spot="leftArm" />
              <KitSelector spot="rightArm" />
              <KitSelector spot="secondary" />
            </div>
            <div className={styles.weaponsGroup}>
              <ItemSelector spot="leftArm" />
              <ItemSelector spot="rightArm" />
              <ItemSelector spot="secondary" />
            </div>
          </div>
        </div>
        <Silhouette />
      </div>
      <Footer>
        <TabsBar />
        <IconBar />
      </Footer>
    </div>
  );
}
