import styles from './KitBudgetButton.module.css';
import {
  computeRemainingTech,
  computeSpotTechCost,
  getTechBudgetStatus,
} from '../../model/kit.rules';
import type { KitSelection } from '../../model/kit.types';

import { WrenchIcon } from '@/ui/Icon';

interface KitBudgetButtonProps {
  /** Tech of the equipped item: the budget of its kits. */
  itemTech: number;
  kits: KitSelection[];
  spotLabel: string;
  onOpen: () => void;
}

const getBudgetTitle = (used: number, itemTech: number, remaining: number) => {
  if (remaining < 0) {
    return `Les kits dépassent la tech de l’équipement de ${-remaining}`;
  }
  return used > 0
    ? `Tech utilisée par les kits : ${used} / ${itemTech} (${remaining} restante)`
    : 'Les kits consomment la tech de l’équipement';
};

/** Entry point of the kit management of a slot, with its tech budget. */
export const KitBudgetButton = ({
  itemTech,
  kits,
  spotLabel,
  onOpen,
}: KitBudgetButtonProps) => {
  const count = kits.reduce((sum, { number }) => sum + number, 0);
  const used = computeSpotTechCost(kits);
  const remaining = computeRemainingTech(itemTech, kits);
  const usedRatio = itemTech > 0 ? Math.min(used / itemTech, 1) : 1;

  return (
    <button
      type="button"
      className={styles.button}
      data-status={getTechBudgetStatus(remaining)}
      title={getBudgetTitle(used, itemTech, remaining)}
      onClick={onOpen}
    >
      <WrenchIcon className={styles.icon} />
      <span className={styles.label}>
        {count > 0 ? `Kits (${count})` : 'Ajouter des kits'}
        <span className="visuallyHidden"> sur {spotLabel}</span>
      </span>
      {count > 0 ? (
        <>
          <span className={styles.gauge} aria-hidden="true">
            <span
              className={styles.fill}
              style={{ width: `${usedRatio * 100}%` }}
            />
          </span>
          <span className={styles.value}>
            {used}/{itemTech}
            <span className="visuallyHidden"> tech utilisée</span>
          </span>
        </>
      ) : (
        <span className={styles.value}>
          {itemTech}
          <span className="visuallyHidden"> tech</span> libres
        </span>
      )}
      <span className={styles.chevron} aria-hidden="true">
        ›
      </span>
    </button>
  );
};
