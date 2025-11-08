import { Field, Select } from '@base-ui-components/react';

import styles from './RaceSelector.module.css';

import {
  usePRofileDispatch,
  useProfileState,
  useRaces,
  type RaceType,
} from '@/feature/profile';
import { CheckIcon, ChevronUpDownIcon } from '@/ui/IconTMP';

export const RaceSelector = () => {
  const { race } = useProfileState();
  const { setRace } = usePRofileDispatch();
  const { data: races } = useRaces();

  const raceItems = races?.map((r) => ({ label: r.type, value: r.type }));

  const handleChange = (value: RaceType) => {
    const race = races?.find((r) => r.type === value);
    if (race) setRace(race.type);
  };

  return (
    <Field.Root>
      <Field.Label>Race</Field.Label>
      <Select.Root
        items={raceItems}
        value={race || 'Humain'}
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
