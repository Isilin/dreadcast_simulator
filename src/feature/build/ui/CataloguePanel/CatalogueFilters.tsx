import styles from './CataloguePanel.module.css';
import {
  type CatalogueFilter,
  type CatalogueTab,
  getCatalogueTab,
  workbenchSlotLabels,
} from '../../model/workbench.types';
import { ModeTab } from '../ModeTab';

import { ItemSpotValue, type ItemSpot } from '@/domain';
import type { ItemsState } from '@/feature/item';

interface CatalogueFiltersProps {
  activeSpot: ItemSpot;
  catalogueFilter: CatalogueFilter;
  items: ItemsState;
  query: string;
  onQueryChange: (query: string) => void;
  onSelectCatalogueTab: (tab: CatalogueTab) => void;
  onSelectEquipmentSpot: (spot: ItemSpot) => void;
}

const searchLabels: Record<CatalogueFilter, string> = {
  equipment: 'Rechercher un équipement',
  kits: 'Rechercher un kit',
  drugs: 'Rechercher une drogue',
};

export const CatalogueFilters = ({
  activeSpot,
  catalogueFilter,
  items,
  query,
  onQueryChange,
  onSelectCatalogueTab,
  onSelectEquipmentSpot,
}: CatalogueFiltersProps) => {
  const activeTab = getCatalogueTab(catalogueFilter);

  return (
    <div className={styles.filters}>
      <div className={styles.modeTabs} role="tablist" aria-label="Catalogue">
        <ModeTab
          activeMode={activeTab}
          mode="equipment"
          onChange={onSelectCatalogueTab}
        >
          Équipement
        </ModeTab>
        <ModeTab
          activeMode={activeTab}
          mode="drugs"
          onChange={onSelectCatalogueTab}
        >
          Drogues
        </ModeTab>
      </div>

      <label className="visuallyHidden" htmlFor="item-catalogue-search">
        {searchLabels[catalogueFilter]}
      </label>
      <input
        id="item-catalogue-search"
        type="search"
        className={styles.search}
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder={searchLabels[catalogueFilter]}
      />

      {activeTab === 'equipment' ? (
        <div className={styles.slotFilters} aria-label="Filtre d'équipement">
          {ItemSpotValue.map((itemSpot) => (
            <button
              key={itemSpot}
              type="button"
              className={styles.slotFilter}
              data-active={activeSpot === itemSpot}
              onClick={() => onSelectEquipmentSpot(itemSpot)}
            >
              {workbenchSlotLabels[itemSpot]}
              {items[itemSpot] ? <span aria-hidden="true">•</span> : null}
            </button>
          ))}
          {catalogueFilter === 'kits' ? (
            <span className={styles.catalogueContext}>
              Kits · {workbenchSlotLabels[activeSpot]}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
