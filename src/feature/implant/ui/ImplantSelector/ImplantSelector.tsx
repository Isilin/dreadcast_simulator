import {
  useImplantsActions,
  useImplantsState,
} from '../../model/implant.store';
import type { Implant } from '../../model/implant.types';
import { ImplantIcon } from '../ImplantIcon';
import styles from './ImplantSelector.module.css';

import { Label } from '@/components/ui/label';
import { NumberInput } from '@/components/ui/number-input';

interface Props {
  implant: Implant;
}

export const ImplantSelector = ({ implant }: Props) => {
  const implantations = useImplantsState();
  const { setImplant } = useImplantsActions();
  const currentImplant = implantations[implant.name];

  return (
    <div className={styles.field}>
      <Label className={styles.label} htmlFor={`implant-${implant.name}`}>
        {implant.name}
      </Label>
      <div className={styles.icon}>
        <ImplantIcon implant={implant.name} />
      </div>
      <NumberInput
        id={`implant-${implant.name}`}
        value={currentImplant || 0}
        onChange={(value) => setImplant(implant.name, value)}
        min={0}
        max={implant.levelMax}
      />
    </div>
  );
};
