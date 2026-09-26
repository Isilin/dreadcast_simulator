import { Field } from '@base-ui/react/field';
import { Select } from '@base-ui/react/select';

import styles from './RaceSelector.module.css';
import { useProfileActions, useProfileState } from '../../model/profile.store';
import type { RaceType } from '../../model/profile.types';
import { useRaces } from '../../services';

import { CheckIcon, ChevronUpDownIcon } from '@/ui';

export const RaceSelector = () => {
  const { race } = useProfileState();
  const { setRace } = useProfileActions();
  const { data: races, status } = useRaces();

  const raceItems = races?.map((r) => ({ label: r.type, value: r.type }));

  const handleChange = (value: RaceType | null) => {
    if (value === null) return;

    const race = races?.find((r) => r.type === value);
    if (race) setRace(race.type);
  };

  return (
    <Field.Root className={styles.field}>
      <Field.Label className={styles.label}>Race</Field.Label>
      <Select.Root
        items={raceItems}
        value={race || 'Humain'}
        onValueChange={handleChange}
      >
        <Select.Trigger
          className={styles.Select}
          disabled={status === 'pending'}
        >
          <Select.Value />
          <Select.Icon className={styles.SelectIcon}>
            <ChevronUpDownIcon />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          {/* Always open below: aligning the selected race with the trigger
              moves the list up, under the header for the last races. */}
          <Select.Positioner
            className={styles.Positioner}
            side="bottom"
            sideOffset={8}
            alignItemWithTrigger={false}
          >
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
