import styles from './KitRack.module.css';
import type { KitSelection } from '../../model/kit.types';

import type { ItemSpot } from '@/domain';
import type { Item } from '@/feature/item';
import { DraggableModuleRow } from '@/ui/DraggableModuleRow';
import { DroppablePanel } from '@/ui/DroppablePanel';

interface KitRackProps {
  activeItem: Item | null;
  kits: KitSelection[];
  techCost: number;
  spot: ItemSpot;
  spotLabel: string;
  onDelete: (index: number) => void;
}

export const KitRack = ({
  activeItem,
  kits,
  techCost,
  spot,
  spotLabel,
  onDelete,
}: KitRackProps) => (
  <DroppablePanel
    id={`kit-rack-${spot}`}
    dropData={{ kind: 'kit-rack', spot }}
    title="Rack de kits"
  >
    <p className={styles.label}>
      {spotLabel} · Tech {techCost}
    </p>
    {activeItem ? (
      <div className={styles.list}>
        {kits.map(({ kit, number }, index) => (
          <DraggableModuleRow
            key={kit.id}
            id={`active-kit-installed-${kit.id}`}
            dragData={{ kind: 'kit', kit, source: 'installed' }}
            name={kit.name}
            detail={`x${number}`}
            onRemove={() => onDelete(index)}
          />
        ))}
        {kits.length === 0 ? (
          <p className={styles.emptyState}>Déposez un kit ici.</p>
        ) : null}
      </div>
    ) : (
      <p className={styles.emptyState}>
        Équipez d’abord un élément sur cet emplacement.
      </p>
    )}
  </DroppablePanel>
);
