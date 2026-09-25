import styles from './KitRack.module.css';
import {
  computeRemainingTech,
  computeSpotTotalEffect,
  getTechBudgetStatus,
} from '../../model/kit.rules';
import type { KitSelection } from '../../model/kit.types';

import type { ItemSpot } from '@/domain';
import type { Item } from '@/feature/item';
import { DroppablePanel } from '@/ui/DroppablePanel';
import { MinusIcon, PlusIcon } from '@/ui/Icon';
import { RemoveButton } from '@/ui/RemoveButton';
import { StatEffects } from '@/ui/StatEffects';
import { statRecordToModifiers } from '@/utils/stats';

interface KitRackProps {
  activeItem: Item | null;
  kits: KitSelection[];
  spot: ItemSpot;
  spotLabel: string;
  onIncrease: (index: number) => void;
  onDecrease: (index: number) => void;
  onDelete: (index: number) => void;
}

/** Kits installed on the active equipment slot, with its tech budget. */
export const KitRack = ({
  activeItem,
  kits,
  spot,
  spotLabel,
  onIncrease,
  onDecrease,
  onDelete,
}: KitRackProps) => {
  const remaining = activeItem
    ? computeRemainingTech(activeItem.tech, kits)
    : 0;
  const totalEffects = statRecordToModifiers(computeSpotTotalEffect(kits));

  return (
    <DroppablePanel
      id={`kit-rack-${spot}`}
      dropData={{ kind: 'kit-rack', spot }}
      title="Rack de kits"
      className={styles.rack}
    >
      <div className={styles.summary}>
        <p className={styles.label}>
          {spotLabel}
          {activeItem ? <span> · {activeItem.name}</span> : null}
        </p>
        {activeItem ? (
          <p
            className={styles.budget}
            data-status={getTechBudgetStatus(remaining)}
            title="Tech de l’équipement moins celle des kits installés"
          >
            Tech restante <strong>{remaining}</strong> / {activeItem.tech}
          </p>
        ) : null}
      </div>

      {totalEffects.length > 0 ? (
        <div className={styles.totals}>
          <span>Effets cumulés</span>
          <StatEffects effects={totalEffects} />
        </div>
      ) : null}

      {!activeItem ? (
        <p className={styles.emptyState}>
          Équipez d’abord un élément sur cet emplacement.
        </p>
      ) : kits.length === 0 ? (
        <p className={styles.emptyState}>
          Déposez ou cliquez un kit du catalogue.
        </p>
      ) : (
        <ul className={styles.list}>
          {kits.map(({ kit, number }, index) => (
            <li key={kit.id} className={styles.row}>
              <div className={styles.info}>
                <span className={styles.name}>{kit.name}</span>
                <span className={styles.tech}>
                  Tech {kit.tech}
                  {number > 1 ? ` · total ${kit.tech * number}` : ''}
                </span>
                <StatEffects effects={kit.effects} />
              </div>
              <div className={styles.controls}>
                <button
                  type="button"
                  className={styles.step}
                  onClick={() => onDecrease(index)}
                  disabled={number <= 1}
                  aria-label={`Retirer un ${kit.name}`}
                  title={`Retirer un ${kit.name}`}
                >
                  <MinusIcon />
                </button>
                <span className={styles.count} aria-live="polite">
                  {number}
                </span>
                <button
                  type="button"
                  className={styles.step}
                  onClick={() => onIncrease(index)}
                  aria-label={`Ajouter un ${kit.name}`}
                  title={`Ajouter un ${kit.name}`}
                >
                  <PlusIcon />
                </button>
                <RemoveButton
                  className={styles.remove}
                  label={`Supprimer ${kit.name}`}
                  onClick={() => onDelete(index)}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </DroppablePanel>
  );
};
