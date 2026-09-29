import styles from './CataloguePanel.module.css';
import {
  PresetSpecializationValues,
  type PresetSpecialization,
} from '../../model/catalogue-filters.rules';

import { SPECIALIZATION_LABELS, StatValues, type Stat } from '@/domain';

interface StatFilterGroupsProps {
  /** Stats given as a bonus by the catalogue. */
  bonusStats: Stat[];
  selectedStats: Stat[];
  isSpecializationActive: (specialization: PresetSpecialization) => boolean;
  canApplySpecialization: (specialization: PresetSpecialization) => boolean;
  onToggleSpecialization: (specialization: PresetSpecialization) => void;
  onToggleStat: (stat: Stat) => void;
}

/** Specialization presets and stat bonus chips of a catalogue. */
export const StatFilterGroups = ({
  bonusStats,
  selectedStats,
  isSpecializationActive,
  canApplySpecialization,
  onToggleSpecialization,
  onToggleStat,
}: StatFilterGroupsProps) => {
  // Selected stats stay visible even when no item gives them.
  const stats = (Object.keys(StatValues) as Stat[]).filter(
    (stat) => bonusStats.includes(stat) || selectedStats.includes(stat),
  );

  return (
    <>
      <fieldset className={styles.filterGroup}>
        <legend className={styles.filterLegend}>Spécialisation</legend>
        <div className={styles.chips}>
          {PresetSpecializationValues.map((specialization) => (
            <button
              key={specialization}
              type="button"
              className={styles.chip}
              aria-pressed={isSpecializationActive(specialization)}
              disabled={!canApplySpecialization(specialization)}
              onClick={() => onToggleSpecialization(specialization)}
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
              aria-pressed={selectedStats.includes(stat)}
              onClick={() => onToggleStat(stat)}
            >
              {StatValues[stat].tag}
            </button>
          ))}
        </div>
      </fieldset>
    </>
  );
};
