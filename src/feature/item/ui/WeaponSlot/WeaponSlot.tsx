import { memo } from 'react';

import { DamageBonus } from '../DamageBonus';
import { ItemSelector } from '../ItemSelector';
import styles from './WeaponSlot.module.css';

import type { ItemSpot } from '@/domain';

interface Props {
  spot: ItemSpot;
}

export const WeaponSlot = memo(({ spot }: Props) => {
  return (
    <div className={styles.wrapper}>
      <ItemSelector spot={spot} />
      <DamageBonus spot={spot} />
    </div>
  );
});

WeaponSlot.displayName = 'WeaponSlot';
