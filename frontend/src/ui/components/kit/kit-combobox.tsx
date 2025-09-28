import { Select } from '@base-ui-components/react';
import { useMemo } from 'react';

import styles from './kit-combobox.module.css';
import { KitLabel } from './kit-label';

import { useKits } from '@/data/kit';
import type { Item, Kit } from '@/domain';
import { CheckIcon, ChevronUpDownIcon } from '@/ui/icons';

interface Props {
  type: Item['type'];
  kit: Kit;
  onChange: (kit: Kit) => void;
}

export const KitCombobox = ({ type, kit, onChange }: Props) => {
  const kitType: Array<Kit['type']> = useMemo(() => {
    if (type === 'weapon')
      return ['1handShot', '2handsShot', '1handMelee', '2handsMelee'];
    else return [type];
  }, [type]);
  const { data } = useKits(kitType);

  return (
    <Select.Root value={kit} onValueChange={(k) => onChange(k)}>
      <Select.Trigger className={styles.Select}>
        <Select.Value>{(k) => <KitLabel kit={k} />}</Select.Value>
        <Select.Icon className={styles.SelectIcon}>
          <ChevronUpDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Backdrop />
        <Select.Positioner className={styles.Positioner} sideOffset={8}>
          <Select.ScrollUpArrow className={styles.ScrollArrow} />
          <Select.Popup className={styles.Popup}>
            {data?.map((k) => (
              <Select.Item key={k.id} value={k} className={styles.Item}>
                <Select.ItemIndicator className={styles.ItemIndicator}>
                  <CheckIcon className={styles.ItemIndicatorIcon} />
                </Select.ItemIndicator>
                <Select.ItemText className={styles.ItemText}>
                  <KitLabel kit={k} />
                </Select.ItemText>
              </Select.Item>
            ))}
          </Select.Popup>
          <Select.ScrollDownArrow className={styles.ScrollArrow} />
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
};
