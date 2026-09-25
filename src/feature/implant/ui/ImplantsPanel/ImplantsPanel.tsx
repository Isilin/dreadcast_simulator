import styles from './ImplantsPanel.module.css';
import {
  MAX_IMPLANTS,
  computeImplantLevelCap,
  computeImplantsCount,
} from '../../model/implant.rules';
import {
  useImplantsActions,
  useImplantsState,
} from '../../model/implant.store';
import type { Implant } from '../../model/implant.types';
import { useImplants } from '../../services';
import { ImplantEffectsPopin } from '../ImplantEffectsPopin';
import { THUMBS } from '../ImplantIcon/thumbs';

import { useBuildReadOnlyMode } from '@/feature/persistence';
import { MinusIcon, PlusIcon, StatusCounterBadge, UiImage } from '@/ui';

interface ImplantRowProps {
  implant: Implant;
  level: number;
  cap: number;
  isReadOnly: boolean;
  onChange: (level: number) => void;
}

const ImplantRow = ({
  implant,
  level,
  cap,
  isReadOnly,
  onChange,
}: ImplantRowProps) => (
  <li className={styles.row} data-active={level > 0}>
    <ImplantEffectsPopin
      implant={implant}
      level={level}
      className={styles.identity}
    >
      <UiImage
        src={THUMBS[implant.name]}
        alt=""
        decorative
        size={28}
        fit="contain"
        radius={4}
        wrapperClassName={styles.thumb}
      />
      <span className={styles.name}>{implant.name}</span>
    </ImplantEffectsPopin>
    <div className={styles.stepper}>
      <button
        type="button"
        className={styles.step}
        aria-label={`Retirer un niveau de ${implant.name}`}
        disabled={isReadOnly || level <= 0}
        onClick={() => onChange(level - 1)}
      >
        <MinusIcon />
      </button>
      <span className={styles.level} aria-live="polite">
        {level}
        <span className={styles.levelMax}>/{implant.levelMax}</span>
      </span>
      <button
        type="button"
        className={styles.step}
        aria-label={`Ajouter un niveau de ${implant.name}`}
        disabled={isReadOnly || level >= cap}
        onClick={() => onChange(level + 1)}
      >
        <PlusIcon />
      </button>
    </div>
  </li>
);

export const ImplantsPanel = () => {
  const { data: implants = [], status } = useImplants();
  const levels = useImplantsState();
  const { setImplant } = useImplantsActions();
  const isReadOnly = useBuildReadOnlyMode();
  const count = computeImplantsCount(levels);

  return (
    <div className={styles.panel}>
      <p className={styles.summary}>
        Implants installés{' '}
        <StatusCounterBadge value={count} maxValue={MAX_IMPLANTS} />
      </p>
      {status === 'pending' ? (
        <p className={styles.message}>Chargement des implants...</p>
      ) : null}
      {status === 'error' ? (
        <p className={styles.message} role="alert">
          Implants indisponibles.
        </p>
      ) : null}
      <ul className={styles.list}>
        {implants.map((implant) => (
          <ImplantRow
            key={implant.name}
            implant={implant}
            level={levels[implant.name] ?? 0}
            cap={computeImplantLevelCap(levels, implant)}
            isReadOnly={isReadOnly}
            onChange={(level) => setImplant(implant.name, level)}
          />
        ))}
      </ul>
    </div>
  );
};
