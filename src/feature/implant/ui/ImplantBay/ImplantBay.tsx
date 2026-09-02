import styles from './ImplantBay.module.css';
import type { Implant, ImplantsState } from '../../model/implant.types';

import { DraggableModuleRow } from '@/ui/DraggableModuleRow';
import { DroppablePanel } from '@/ui/DroppablePanel';

interface ImplantBayProps {
  implants: Implant[];
  levels: ImplantsState;
  onRemove: (implant: Implant) => void;
}

export const ImplantBay = ({ implants, levels, onRemove }: ImplantBayProps) => (
  <DroppablePanel
    id="implant-bay"
    dropData={{ kind: 'implant-bay' }}
    title="Baie d'implants"
  >
    <p className={styles.label}>Implants installés</p>
    <div className={styles.list}>
      {implants
        .filter((implant) => levels[implant.name] > 0)
        .map((implant) => (
          <DraggableModuleRow
            key={implant.id}
            id={`active-implant-installed-${implant.id}`}
            dragData={{ kind: 'implant', implant, source: 'installed' }}
            name={implant.name}
            detail={`Niveau ${levels[implant.name]}/${implant.levelMax}`}
            onRemove={() => onRemove(implant)}
          />
        ))}
      {implants.every((implant) => levels[implant.name] === 0) ? (
        <p className={styles.emptyState}>Déposez un implant ici.</p>
      ) : null}
    </div>
  </DroppablePanel>
);
