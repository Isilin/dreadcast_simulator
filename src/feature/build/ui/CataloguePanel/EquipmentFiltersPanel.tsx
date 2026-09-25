import { useId, useState } from 'react';

import styles from './CataloguePanel.module.css';
import {
  canApplySpecialization,
  countActiveEquipmentFilters,
  EMPTY_EQUIPMENT_FILTERS,
  isSpecializationActive,
  PresetSpecializationValues,
  toggleSpecialization,
  toggleStat,
  type EquipmentFilters,
} from '../../model/catalogue-filters.rules';

import { SPECIALIZATION_LABELS, StatValues, type Stat } from '@/domain';
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
}: EquipmentFiltersPanelProps) => {
  const panelId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const activeCount = countActiveEquipmentFilters(filters, isArmSpot);
  // Selected stats stay visible even when no item gives them.
  const stats = (Object.keys(StatValues) as Stat[]).filter(
    (stat) => bonusStats.includes(stat) || filters.stats.includes(stat),
  );

  return (
    <div className={styles.equipmentFilters}>
      <div className={styles.filtersBar}>
        <button
          type="button"
          className={styles.filtersToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span aria-hidden="true">{isOpen ? '▾' : '▸'}</span>
          Filtres{activeCount > 0 ? ` (${activeCount})` : ''}
        </button>
        <button
          type="button"
          className={styles.filtersReset}
          disabled={activeCount === 0}
          onClick={() => onChange(EMPTY_EQUIPMENT_FILTERS)}
        >
          Réinitialiser
        </button>
      </div>

      {isOpen ? (
        <div id={panelId} className={styles.filtersPanel}>
          <fieldset className={styles.filterGroup}>
            <legend className={styles.filterLegend}>Spécialisation</legend>
            <div className={styles.chips}>
              {PresetSpecializationValues.map((specialization) => (
                <button
                  key={specialization}
                  type="button"
                  className={styles.chip}
                  aria-pressed={isSpecializationActive(
                    filters,
                    specialization,
                    bonusStats,
                  )}
                  disabled={!canApplySpecialization(specialization, bonusStats)}
                  onClick={() =>
                    onChange(
                      toggleSpecialization(filters, specialization, bonusStats),
                    )
                  }
                >
                  {SPECIALIZATION_LABELS[specialization]}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className={styles.filterGroup}>
            <legend className={styles.filterLegend}>Bonus de stat</legend>
            <div className={styles.chips}>
              {stats.map((stat) => (
                <button
                  key={stat}
                  type="button"
                  className={styles.chip}
                  title={StatValues[stat].label}
                  aria-label={`${StatValues[stat].label} (${StatValues[stat].tag})`}
                  aria-pressed={filters.stats.includes(stat)}
                  onClick={() => onChange(toggleStat(filters, stat))}
                >
                  {StatValues[stat].tag}
                </button>
              ))}
            </div>
          </fieldset>

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
                        weaponHands:
                          filters.weaponHands === hands ? null : hands,
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
                  onClick={() =>
                    onChange({ ...filters, healOnly: !filters.healOnly })
                  }
                >
                  Arme de soin
                </button>
              </div>
            </fieldset>
          ) : null}

          <label
            className={styles.checkbox}
            title="Prérequis atteints avec la race et les implants"
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
        </div>
      ) : null}
    </div>
  );
};
