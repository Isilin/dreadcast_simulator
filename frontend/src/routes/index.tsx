import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

import './App.css';
import styles from './index.module.css';

import { ImplantsButton } from '@/feature/implant';
import { ItemSelector, WeaponSlot } from '@/feature/item';
import { KitSelector } from '@/feature/kit';
import { IconBar, TabsBar } from '@/feature/persistence/ui';
import { GenderSelector, RaceSelector, Silhouette } from '@/feature/profile';
import { Skills } from '@/feature/stats/skills';
import { Footer, HamburgerButton } from '@/ui';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <HamburgerButton isOpen={isSidebarOpen} onClick={handleToggleSidebar} />
      <div
        className={`${styles.backdrop} ${isSidebarOpen ? styles.open : ''}`}
        onClick={handleCloseSidebar}
        aria-hidden="true"
      />
      <div className={styles.layout}>
        <div
          className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}
        >
          <GenderSelector />
          <RaceSelector />
          <Skills />
          <ImplantsButton />
        </div>
        <div className={styles.mainContent}>
          <div className={styles.equipmentSection}>
            {/* Desktop/Tablet: colonnes item et kit séparées */}
            <div className={`${styles.equipmentGroup} ${styles.bodySlots}`}>
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

            {/* Mobile: slots groupés (item + kit par ligne) */}
            <div
              className={`${styles.equipmentGroup} ${styles.bodySlotsMobile}`}
            >
              <div className={styles.slotPair}>
                <ItemSelector spot="head" />
                <KitSelector spot="head" />
              </div>
              <div className={styles.slotPair}>
                <ItemSelector spot="chest" />
                <KitSelector spot="chest" />
              </div>
              <div className={styles.slotPair}>
                <ItemSelector spot="legs" />
                <KitSelector spot="legs" />
              </div>
              <div className={styles.slotPair}>
                <ItemSelector spot="feet" />
                <KitSelector spot="feet" />
              </div>
            </div>

            {/* Desktop/Tablet: colonnes armes séparées */}
            <div className={`${styles.equipmentGroup} ${styles.weaponSlots}`}>
              <div className={styles.weaponsGroup}>
                <KitSelector spot="leftArm" />
                <KitSelector spot="rightArm" />
                <KitSelector spot="secondary" />
              </div>
              <div className={styles.weaponsGroup}>
                <WeaponSlot spot="leftArm" />
                <WeaponSlot spot="rightArm" />
                <ItemSelector spot="secondary" />
              </div>
            </div>

            {/* Mobile: armes groupées (kit + weapon/item par ligne) */}
            <div
              className={`${styles.equipmentGroup} ${styles.weaponSlotsMobile}`}
            >
              <div className={styles.slotPair}>
                <KitSelector spot="leftArm" />
                <WeaponSlot spot="leftArm" />
              </div>
              <div className={styles.slotPair}>
                <KitSelector spot="rightArm" />
                <WeaponSlot spot="rightArm" />
              </div>
              <div className={styles.slotPair}>
                <KitSelector spot="secondary" />
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
    </>
  );
}
