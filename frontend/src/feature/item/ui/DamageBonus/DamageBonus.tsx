import { memo, useMemo } from 'react';

import styles from './DamageBonus.module.css';

import type { ItemSpot } from '@/domain';
import { useItemsActions, useItemsState } from '@/feature/item';
import { DAMAGE_BONUS_VALUES } from '@/feature/item/model/item.types';

interface Props {
  spot: ItemSpot;
}

export const DamageBonus = memo(({ spot }: Props) => {
  const actions = useItemsActions();
  const items = useItemsState();

  const hasTwoHandedWeapon = useMemo(
    () => (items.leftArm?.hands ?? 0) > 1 || (items.rightArm?.hands ?? 0) > 1,
    [items.leftArm, items.rightArm],
  );

  const isDisabled = useMemo(
    () =>
      !items[spot] ||
      (spot === 'rightArm' &&
        items[spot].hands !== undefined &&
        items[spot].hands >= 2) ||
      (spot === 'rightArm' && hasTwoHandedWeapon),
    [items, spot, hasTwoHandedWeapon],
  );

  const currentBonus = items[spot]?.damageBonus ?? 0;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const bonus = parseInt(
      e.target.value,
      10,
    ) as (typeof DAMAGE_BONUS_VALUES)[number];
    actions.setDamageBonus(spot, bonus);
  };

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>Dégâts</label>
      <select
        className={styles.select}
        value={currentBonus}
        onChange={handleChange}
        disabled={isDisabled}
      >
        {DAMAGE_BONUS_VALUES.map((bonus) => (
          <option key={bonus} value={bonus} className={styles.option}>
            +{bonus}
          </option>
        ))}
      </select>
    </div>
  );
});

DamageBonus.displayName = 'DamageBonus';
