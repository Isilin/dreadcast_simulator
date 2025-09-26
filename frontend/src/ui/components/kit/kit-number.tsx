import { NumberField } from '@base-ui-components/react';

import styles from './kit-number.module.css';

import { CursorGrowIcon, MinusIcon, PlusIcon } from '@/ui/icons';

interface Props {
  value: number;
  onChange: (value: number) => void;
}

export const KitNumber = ({ value, onChange }: Props) => {
  return (
    <NumberField.Root
      value={value}
      onValueChange={(value) => onChange(value || 0)}
      min={0}
      className={styles.Field}
    >
      <NumberField.ScrubArea className={styles.ScrubArea}>
        <NumberField.ScrubAreaCursor className={styles.ScrubAreaCursor}>
          <CursorGrowIcon />
        </NumberField.ScrubAreaCursor>
      </NumberField.ScrubArea>

      <NumberField.Group className={styles.Group}>
        <NumberField.Decrement
          className={styles.Decrement}
          disabled={value <= 0}
        >
          <MinusIcon />
        </NumberField.Decrement>
        <NumberField.Input className={styles.Input} />
        <NumberField.Increment className={styles.Increment}>
          <PlusIcon />
        </NumberField.Increment>
      </NumberField.Group>
    </NumberField.Root>
  );
};
