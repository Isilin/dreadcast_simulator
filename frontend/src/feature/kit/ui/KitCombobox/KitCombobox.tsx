import { Select } from '@base-ui-components/react';

import type { Kit } from '../../model';
import { useKits } from '../../services';
import { KitLabel } from '../KitLabel';
import styles from './KitCombobox.module.css';

import type { ItemType } from '@/feature/item';
import { CheckIcon, ChevronUpDownIcon } from '@/ui';

interface Props {
  type: ItemType[];
  kit: Kit;
  onChange: (kit: Kit) => void;
}

export const KitCombobox = ({ type, kit, onChange }: Props) => {
  const { data } = useKits(type);

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
