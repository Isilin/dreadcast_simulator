import styles from './CataloguePanel.module.css';
import { FiltersDisclosure } from './FiltersDisclosure';
import { StatFilterGroups } from './StatFilterGroups';
import {
  canApplySpecialization,
  countActiveEquipmentFilters,
  EMPTY_EQUIPMENT_FILTERS,
  isSpecializationActive,
  toggleSpecialization,
  toggleStat,
  type EquipmentFilters,
} from '../../model/catalogue-filters.rules';

import type { Stat } from '@/domain';
import {
  WEAPON_KIND_LABELS,
  WeaponHandsValues,
  WeaponKindValues,
} from '@/feature/item';

interface EquipmentFiltersPanelProps {
  /** Stats given as a bonus by the catalogue. */
  bonusStats: Stat[];
  filters: EquipmentFilters;
  isArmSpot: boolean;
  onChange: (filters: EquipmentFilters) => void;
}

export const EquipmentFiltersPanel = ({
  bonusStats,
  filters,
  isArmSpot,
  onChange,
}: EquipmentFiltersPanelProps) => (
  <FiltersDisclosure
    activeCount={countActiveEquipmentFilters(filters, isArmSpot)}
    onReset={() => onChange(EMPTY_EQUIPMENT_FILTERS)}
  >
    <StatFilterGroups
      bonusStats={bonusStats}
      selectedStats={filters.stats}
      isSpecializationActive={(specialization) =>
        isSpecializationActive(filters, specialization, bonusStats)
      }
      canApplySpecialization={(specialization) =>
        canApplySpecialization(specialization, bonusStats)
      }
      onToggleSpecialization={(specialization) =>
        onChange(toggleSpecialization(filters, specialization, bonusStats))
      }
      onToggleStat={(stat) => onChange(toggleStat(filters, stat))}
    />

    {isArmSpot ? (
      <fieldset className={styles.filterGroup}>
        <legend className={styles.filterLegend}>Arme</legend>
        <div className={styles.chips}>
          {WeaponKindValues.map((kind) => (
            <button
              key={kind}
              type="button"
              className={styles.chip}
              aria-pressed={filters.weaponKind === kind}
              onClick={() =>
                onChange({
                  ...filters,
                  weaponKind: filters.weaponKind === kind ? null : kind,
                })
              }
            >
              {WEAPON_KIND_LABELS[kind]}
            </button>
          ))}
          {WeaponHandsValues.map((hands) => (
            <button
              key={hands}
              type="button"
              className={styles.chip}
              aria-pressed={filters.weaponHands === hands}
              onClick={() =>
                onChange({
                  ...filters,
                  weaponHands: filters.weaponHands === hands ? null : hands,
                })
              }
            >
              {hands === 1 ? '1 main' : '2 mains'}
            </button>
          ))}
          <button
            type="button"
            className={styles.chip}
            aria-pressed={filters.healOnly}
            onClick={() => onChange({ ...filters, healOnly: !filters.healOnly })}
          >
            Arme de soin
          </button>
        </div>
      </fieldset>
    ) : null}

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
