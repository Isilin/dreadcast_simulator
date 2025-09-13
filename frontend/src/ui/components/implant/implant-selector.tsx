import { Field, NumberField } from '@base-ui-components/react';

import { ImplantIcon } from './implant-icon';
import styles from './implant-selector.module.css';

import type { Implant } from '@/domain/implant';
import { useSuit } from '@/ui/hooks/use-suit';
import { CursorGrowIcon, MinusIcon, PlusIcon } from '@/ui/icons';

interface Props {
  implant: Implant;
}

export const ImplantSelector = ({ implant }: Props) => {
  const { implantations, setImplant } = useSuit();
  const currentImplant = implantations?.[implant.name];

  const iconState = currentImplant && currentImplant > 0 ? 'ACTIVE' : 'DEFAULT';

  return (
    <Field.Root>
      <Field.Label className={styles.label}>{implant.name}</Field.Label>
      <Field.Description className={styles.icon}>
        <ImplantIcon implant={implant.name} state={iconState} />
      </Field.Description>
      <NumberField.Root
        id={`implant-${implant.name}`}
        defaultValue={0}
        className={styles.field}
        min={0}
        max={implant.levelMax}
        value={currentImplant || 0}
        onValueChange={(value) => setImplant(implant.name, value || 0)}
      >
        <NumberField.ScrubArea className={styles.scrubArea}>
          <NumberField.ScrubAreaCursor className={styles.scrubAreaCursor}>
            <CursorGrowIcon />
          </NumberField.ScrubAreaCursor>
        </NumberField.ScrubArea>

        <NumberField.Group className={styles.group}>
          <NumberField.Decrement
            className={styles.decrement}
            disabled={!currentImplant || currentImplant <= 0}
          >
            <MinusIcon />
          </NumberField.Decrement>
          <NumberField.Input className={styles.input} />
          <NumberField.Increment
            className={styles.increment}
            disabled={!!currentImplant && currentImplant >= implant.levelMax}
          >
            <PlusIcon />
          </NumberField.Increment>
        </NumberField.Group>
      </NumberField.Root>
    </Field.Root>
  );
};
