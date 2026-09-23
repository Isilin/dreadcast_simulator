import styles from './KitRack.module.css';
import type { KitSelection } from '../../model/kit.types';
import { KitEffects } from '../KitEffects';

import type { ItemSpot } from '@/domain';
import type { Item } from '@/feature/item';
import { DroppablePanel } from '@/ui/DroppablePanel';
import { TrashIcon } from '@/ui/Icon';

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
      kits.length > 0 ? (
        <ul className={styles.list}>
          {kits.map(({ kit, number }, index) => (
            <li key={kit.id} className={styles.row}>
              <div className={styles.info}>
                <span className={styles.name}>
                  {kit.name}
                  <span className={styles.count}>×{number}</span>
                </span>
                <KitEffects effects={kit.effects} />
              </div>
              <button
                type="button"
                className={styles.remove}
                onClick={() => onDelete(index)}
                aria-label={`Retirer un ${kit.name}`}
                title={`Retirer un ${kit.name}`}
              >
                <TrashIcon />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.emptyState}>
          Déposez ou cliquez un kit du catalogue.
        </p>
      )
    ) : (
      <p className={styles.emptyState}>
        Équipez d’abord un élément sur cet emplacement.
      </p>
    )}
  </DroppablePanel>
);
