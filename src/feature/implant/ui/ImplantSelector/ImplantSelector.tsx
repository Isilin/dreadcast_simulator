import { Field, NumberField } from '@base-ui/react';

import {
  useImplantsActions,
  useImplantsState,
} from '../../model/implant.store';
import type { Implant } from '../../model/implant.types';
import { ImplantIcon } from '../ImplantIcon';
import styles from './ImplantSelector.module.css';

import { useBuildReadOnlyMode } from '@/feature/persistence';
import { CursorGrowIcon, MinusIcon, PlusIcon } from '@/ui';

interface Props {
  implant: Implant;
}

export const ImplantSelector = ({ implant }: Props) => {
  const implantations = useImplantsState();
  const { setImplant } = useImplantsActions();
  const currentImplant = implantations[implant.name];
  const isReadOnly = useBuildReadOnlyMode();

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
        disabled={isReadOnly}
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
            disabled={isReadOnly || !currentImplant || currentImplant <= 0}
          >
            <MinusIcon />
          </NumberField.Decrement>
          <NumberField.Input className={styles.input} />
          <NumberField.Increment
            className={styles.increment}
            disabled={
              isReadOnly ||
              (!!currentImplant && currentImplant >= implant.levelMax)
            }
          >
            <PlusIcon />
          </NumberField.Increment>
        </NumberField.Group>
      </NumberField.Root>
    </Field.Root>
  );
};
