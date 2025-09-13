import { Field, Select } from '@base-ui-components/react';

import styles from './race-selector.module.css';

import { useRaces } from '@/data/race/race.queries';
import type { RaceType } from '@/domain/race';
import { useSuit } from '@/ui/hooks/use-suit';
import { CheckIcon, ChevronUpDownIcon } from '@/ui/icons';

export const RaceSelector = () => {
  const { race, setRace } = useSuit();
  const { data: races } = useRaces();

  const raceItems = races?.map((r) => ({ label: r.type, value: r.type }));

  const handleChange = (value: RaceType) => {
    const race = races?.find((r) => r.type === value);
    if (race) setRace(race);
  };

  return (
    <Field.Root>
      <Field.Label>Race</Field.Label>
      <Select.Root
        items={raceItems}
        value={race?.type || 'Humain'}
        onValueChange={handleChange}
      >
        <Select.Trigger className={styles.Select}>
          <Select.Value />
          <Select.Icon className={styles.SelectIcon}>
            <ChevronUpDownIcon />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner className={styles.Positioner} sideOffset={8}>
            <Select.ScrollUpArrow className={styles.ScrollArrow} />
            <Select.Popup className={styles.Popup}>
              {raceItems?.map(({ label, value }) => (
                <Select.Item key={label} value={value} className={styles.Item}>
                  <Select.ItemIndicator className={styles.ItemIndicator}>
                    <CheckIcon className={styles.ItemIndicatorIcon} />
                  </Select.ItemIndicator>
                  <Select.ItemText className={styles.ItemText}>
                    {label}
                  </Select.ItemText>
                </Select.Item>
              ))}
            </Select.Popup>
            <Select.ScrollDownArrow className={styles.ScrollArrow} />
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </Field.Root>
  );
};
