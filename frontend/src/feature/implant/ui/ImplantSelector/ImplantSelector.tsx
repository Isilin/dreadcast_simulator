import { Field, NumberField } from '@base-ui-components/react';

import { useImplantsDispatch, useImplantsState } from '../../model/implant.hooks';
import type { Implant } from '../../model/implant.types';
import { ImplantIcon } from '../ImplantIcon';
import styles from './ImplantSelector.module.css';

import { CursorGrowIcon, MinusIcon, PlusIcon } from '@/ui/icons';

interface Props {
  implant: Implant;
}

export const ImplantSelector = ({ implant }: Props) => {
  const implantations = useImplantsState();
  const { setImplant } = useImplantsDispatch();
  const currentImplant = implantations[implant.name];

  return (
    <Field.Root>
      <Field.Label className={styles.label}>{implant.name}</Field.Label>
      <Field.Description className={styles.icon}>
        <ImplantIcon implant={implant.name} />
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
