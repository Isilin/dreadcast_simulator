import { createFileRoute } from '@tanstack/react-router';

import './App.css';
import styles from './index.module.css';

import type { ItemSpot } from '@/domain';
import { ImplantsButton } from '@/feature/implant';
import { ItemSelector, WeaponSlot } from '@/feature/item';
import { KitSelector } from '@/feature/kit';
import { IconBar, TabsBar } from '@/feature/persistence/ui';
import { GenderSelector, RaceSelector, Silhouette } from '@/feature/profile';
import { Skills } from '@/feature/stats/skills';
import { Footer, Sidebar } from '@/ui';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

const WEAPON_SPOTS: readonly ItemSpot[] = ['leftArm', 'rightArm'];
const REVERSED_SPOTS: readonly ItemSpot[] = ['leftArm', 'rightArm', 'secondary'];

interface SlotPairProps {
  spot: ItemSpot;
}

function SlotPair({ spot }: SlotPairProps) {
  const ItemComponent = WEAPON_SPOTS.includes(spot) ? WeaponSlot : ItemSelector;
  const reversed = REVERSED_SPOTS.includes(spot);
  const itemEl = <ItemComponent spot={spot} />;
  const kitEl = <KitSelector spot={spot} />;
  return (
    <>
      {reversed ? kitEl : itemEl}
      {reversed ? itemEl : kitEl}
    </>
  );
}

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
            <div className={styles.bodyGroup}>
              <SlotPair spot="head" />
              <SlotPair spot="chest" />
              <SlotPair spot="legs" />
              <SlotPair spot="feet" />
            </div>
            <div className={styles.weaponGroup}>
              <SlotPair spot="leftArm" />
              <SlotPair spot="rightArm" />
              <SlotPair spot="secondary" />
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
