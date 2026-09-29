import styles from './CataloguePanel.module.css';
import { FiltersDisclosure } from './FiltersDisclosure';
import { StatFilterGroups } from './StatFilterGroups';
import {
  canApplyKitSpecialization,
  countActiveKitFilters,
  EMPTY_KIT_FILTERS,
  isKitSpecializationActive,
  toggleKitSpecialization,
  toggleStat,
  type KitFilters,
} from '../../model/catalogue-filters.rules';

import type { Stat } from '@/domain';

interface KitFiltersPanelProps {
  /** Stats given as a bonus by the kit catalogue. */
  bonusStats: Stat[];
  filters: KitFilters;
  onChange: (filters: KitFilters) => void;
}

export const KitFiltersPanel = ({
  bonusStats,
  filters,
  onChange,
}: KitFiltersPanelProps) => (
  <FiltersDisclosure
    activeCount={countActiveKitFilters(filters)}
    onReset={() => onChange(EMPTY_KIT_FILTERS)}
  >
    <StatFilterGroups
      bonusStats={bonusStats}
      selectedStats={filters.stats}
      isSpecializationActive={(specialization) =>
        isKitSpecializationActive(filters, specialization, bonusStats)
      }
      canApplySpecialization={(specialization) =>
        canApplyKitSpecialization(specialization, bonusStats)
      }
      onToggleSpecialization={(specialization) =>
        onChange(toggleKitSpecialization(filters, specialization, bonusStats))
      }
      onToggleStat={(stat) => onChange(toggleStat(filters, stat))}
    />

    <label
      className={styles.checkbox}
      title="Coût tech dans les points restants de l'équipement"
    >
      <input
        type="checkbox"
        checked={filters.withinTechBudget}
        onChange={(event) =>
          onChange({ ...filters, withinTechBudget: event.target.checked })
        }
      />
      Dans le budget tech
    </label>

    <label
      className={styles.checkbox}
      title="Prérequis atteints avec la race, les implants et les titres"
    >
      <input
        type="checkbox"
        checked={filters.equippableOnly}
        onChange={(event) =>
          onChange({ ...filters, equippableOnly: event.target.checked })
        }
      />
      Équipables seulement
    </label>
  </FiltersDisclosure>
);
