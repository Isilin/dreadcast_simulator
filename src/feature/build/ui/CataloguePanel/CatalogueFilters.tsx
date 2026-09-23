import styles from './CataloguePanel.module.css';
import {
  type CatalogueFilter,
  type WorkbenchMode,
  workbenchSlotLabels,
} from '../../model/workbench.types';
import { ModeTab } from '../ModeTab';

import { ItemSpotValue, type ItemSpot } from '@/domain';
import type { ItemsState } from '@/feature/item';

interface CatalogueFiltersProps {
  activeMode: WorkbenchMode;
  activeSpot: ItemSpot;
  catalogueFilter: CatalogueFilter;
  items: ItemsState;
  query: string;
  onQueryChange: (query: string) => void;
  onSelectCatalogueFilter: (filter: CatalogueFilter) => void;
  onSelectEquipmentSpot: (spot: ItemSpot) => void;
  onSelectWorkbenchMode: (mode: WorkbenchMode) => void;
}

export const CatalogueFilters = ({
  activeMode,
  activeSpot,
  catalogueFilter,
  items,
  query,
  onQueryChange,
  onSelectCatalogueFilter,
  onSelectEquipmentSpot,
  onSelectWorkbenchMode,
}: CatalogueFiltersProps) => {
  const searchLabel =
    catalogueFilter === 'kits'
      ? 'Rechercher un kit'
      : catalogueFilter === 'drugs'
        ? 'Rechercher une drogue'
        : catalogueFilter === 'implants'
          ? 'Rechercher un implant'
          : 'Rechercher un équipement';

  return (
    <>
      <div className={styles.modeTabs} aria-label="Section du poste">
        <ModeTab
          activeMode={activeMode}
          mode="equipment"
          onChange={onSelectWorkbenchMode}
        >
          Équipement
        </ModeTab>
        <ModeTab
          activeMode={activeMode}
          mode="implants"
          onChange={onSelectWorkbenchMode}
        >
          Implants
        </ModeTab>
      </div>

      <label className={styles.searchLabel} htmlFor="item-catalogue-search">
        {searchLabel}
      </label>
      <input
        id="item-catalogue-search"
        type="search"
        className={styles.search}
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Rechercher dans le catalogue"
      />

      {activeMode === 'equipment' ? (
        <div className={styles.slotFilters} aria-label="Filtre d'équipement">
          {ItemSpotValue.map((itemSpot) => (
            <button
              key={itemSpot}
              type="button"
              className={styles.slotFilter}
              data-active={
                catalogueFilter !== 'drugs' && activeSpot === itemSpot
              }
              onClick={() => onSelectEquipmentSpot(itemSpot)}
            >
              {workbenchSlotLabels[itemSpot]}
              {items[itemSpot] ? <span aria-hidden="true">•</span> : null}
            </button>
          ))}
          <button
            type="button"
            className={styles.slotFilter}
            data-active={catalogueFilter === 'drugs'}
            onClick={() => onSelectCatalogueFilter('drugs')}
          >
            Drogues
          </button>
          {catalogueFilter === 'kits' ? (
            <span className={styles.catalogueContext}>
              Kits · {workbenchSlotLabels[activeSpot]}
            </span>
          ) : null}
        </div>
      ) : null}
    </>
  );
};
