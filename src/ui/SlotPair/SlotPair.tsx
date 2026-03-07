import { memo } from 'react';

import styles from './SlotPair.module.css';

import type { ItemSpot } from '@/domain';
import { ItemSelector, WeaponSlot } from '@/feature/item';
import { KitSelector } from '@/feature/kit';

interface Props {
  spot: ItemSpot;
  /** Inverse l'ordre : kit avant item/weapon (utilisé pour la colonne armes) */
  reversed?: boolean;
}

const WEAPON_SPOTS: readonly ItemSpot[] = ['leftArm', 'rightArm'];

export const SlotPair = memo(function SlotPair({
  spot,
  reversed = false,
}: Props) {
  const Selector = WEAPON_SPOTS.includes(spot) ? WeaponSlot : ItemSelector;

  return (
    <div className={styles.slotPair}>
      {reversed ? (
        <>
          <KitSelector spot={spot} />
          <Selector spot={spot} />
        </>
      ) : (
        <>
          <Selector spot={spot} />
          <KitSelector spot={spot} />
        </>
      )}
    </div>
  );
});
