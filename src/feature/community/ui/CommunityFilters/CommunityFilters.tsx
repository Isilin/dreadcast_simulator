import { useEffect, useId, useState } from 'react';

import styles from './CommunityFilters.module.css';
import {
  ALL_GAME_VERSIONS,
  countActiveFilters,
  GENDER_LABELS,
  SPECIALIZATION_LABELS,
  SpecializationValues,
  WEAPON_KIND_LABELS,
  WeaponKindValues,
  type CommunityFilters as Filters,
  type GameVersion,
} from '../../model';
import { AdvancedFilters } from '../AdvancedFilters';

import { RaceTypeValues, type Gender } from '@/feature/profile';

const SEARCH_DEBOUNCE_MS = 300;
const GENDERS: Gender[] = ['male', 'female'];
const MIN_RATINGS = [3, 4, 4.5] as const;

interface CommunityFiltersProps {
  filters: Filters;
  onChange: (changes: Partial<Filters>) => void;
  onReset: () => void;
  isSubscriber: boolean;
  versions: GameVersion[];
  currentVersion: string | null | undefined;
}

const toggle = <T,>(values: readonly T[], value: T): T[] =>
  values.includes(value)
    ? values.filter((entry) => entry !== value)
    : [...values, value];

export const CommunityFilters = ({
  filters,
  onChange,
  onReset,
  isSubscriber,
  versions,
  currentVersion,
}: CommunityFiltersProps) => {
  const idPrefix = useId();
  const [query, setQuery] = useState(filters.query);
  const [isOpenOnMobile, setIsOpenOnMobile] = useState(false);
  const activeCount = countActiveFilters(filters);

  useEffect(() => {
    setQuery(filters.query);
  }, [filters.query]);

  useEffect(() => {
    if (query === filters.query) return;
    const timer = window.setTimeout(
      () => onChange({ query }),
      SEARCH_DEBOUNCE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [filters.query, onChange, query]);

  return (
    <aside className={styles.filters} aria-label="Filtres de la Communauté">
      <button
        type="button"
        className={styles.mobileToggle}
        aria-expanded={isOpenOnMobile}
        onClick={() => setIsOpenOnMobile((open) => !open)}
      >
        Filtres{activeCount > 0 ? ` (${activeCount})` : ''}
      </button>

      <div className={styles.panel} data-open={isOpenOnMobile}>
        <div className={styles.group}>
          <label htmlFor={`${idPrefix}-query`} className={styles.label}>
            Recherche
          </label>
          <input
            id={`${idPrefix}-query`}
            type="search"
            className={styles.input}
            placeholder="Titre ou pseudo"
            value={query}
            maxLength={64}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <fieldset className={styles.group}>
          <legend className={styles.label}>Spécialisation</legend>
          <div className={styles.chips}>
            {SpecializationValues.map((specialization) => (
              <button
                key={specialization}
                type="button"
                className={styles.chip}
                aria-pressed={filters.specializations.includes(specialization)}
                onClick={() =>
                  onChange({
                    specializations: toggle(
                      filters.specializations,
                      specialization,
                    ),
                  })
                }
              >
                {SPECIALIZATION_LABELS[specialization]}
              </button>
            ))}
          </div>
        </fieldset>

        <div className={styles.group}>
          <label htmlFor={`${idPrefix}-rating`} className={styles.label}>
            Note minimale
          </label>
          <select
            id={`${idPrefix}-rating`}
            className={styles.input}
            value={filters.minRating ?? ''}
            onChange={(event) =>
              onChange({
                minRating: event.target.value
                  ? Number(event.target.value)
                  : null,
              })
            }
          >
            <option value="">Toutes les notes</option>
            {MIN_RATINGS.map((rating) => (
              <option key={rating} value={rating}>
                {String(rating).replace('.', ',')} ★ et plus
              </option>
            ))}
          </select>
        </div>

        <fieldset className={styles.group}>
          <legend className={styles.label}>Race</legend>
          <div className={styles.chips}>
            {RaceTypeValues.map((race) => (
              <button
                key={race}
                type="button"
                className={styles.chip}
                aria-pressed={filters.races.includes(race)}
                onClick={() => onChange({ races: toggle(filters.races, race) })}
              >
                {race}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className={styles.group}>
          <legend className={styles.label}>Genre</legend>
          <div className={styles.chips}>
            {GENDERS.map((gender) => (
              <button
                key={gender}
                type="button"
                className={styles.chip}
                aria-pressed={filters.genders.includes(gender)}
                onClick={() =>
                  onChange({ genders: toggle(filters.genders, gender) })
                }
              >
                {GENDER_LABELS[gender]}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className={styles.group}>
          <legend className={styles.label}>Armes</legend>
          <div className={styles.chips}>
            {WeaponKindValues.map((kind) => (
              <button
                key={kind}
                type="button"
                className={styles.chip}
                aria-pressed={filters.weaponKind === kind}
                onClick={() =>
                  onChange({
                    weaponKind: filters.weaponKind === kind ? null : kind,
                  })
                }
              >
                {WEAPON_KIND_LABELS[kind]}
              </button>
            ))}
            {([1, 2] as const).map((hands) => (
              <button
                key={hands}
                type="button"
                className={styles.chip}
                aria-pressed={filters.weaponHands === hands}
                onClick={() =>
                  onChange({
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
              onClick={() => onChange({ healOnly: !filters.healOnly })}
            >
              Arme de soin
            </button>
          </div>
        </fieldset>

        <div className={styles.group}>
          <label htmlFor={`${idPrefix}-version`} className={styles.label}>
            Version du jeu
          </label>
          <select
            id={`${idPrefix}-version`}
            className={styles.input}
            value={filters.gameVersion ?? ''}
            onChange={(event) =>
              onChange({ gameVersion: event.target.value || null })
            }
          >
            <option value="">
              Version actuelle{currentVersion ? ` (${currentVersion})` : ''}
            </option>
            {versions
              .filter((version) => !version.isCurrent)
              .map((version) => (
                <option key={version.code} value={version.code}>
                  {version.label}
                </option>
              ))}
            <option value={ALL_GAME_VERSIONS}>Toutes les versions</option>
          </select>
        </div>

        <AdvancedFilters
          filters={filters}
          onChange={onChange}
          isSubscriber={isSubscriber}
        />

        <button
          type="button"
          className={styles.reset}
          onClick={onReset}
          disabled={activeCount === 0}
        >
          Réinitialiser les filtres
        </button>
      </div>
    </aside>
  );
};
