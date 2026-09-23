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
  const isKitView = catalogueFilter === 'kits';
  const activeItem = items[activeSpot];

  return (
    <div className={styles.filters}>
      {isKitView ? (
        <div className={styles.kitTab} role="tablist" aria-label="Catalogue">
          <ModeTab activeMode="kits" mode="kits" onChange={() => undefined}>
            Kits
          </ModeTab>
        </div>
      ) : (
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
      )}

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

      {isKitView ? (
        <p className={styles.catalogueContext}>
          {workbenchSlotLabels[activeSpot]}
          {activeItem ? ` · compatibles ${activeItem.name}` : ''}
        </p>
      ) : null}

      {activeTab === 'equipment' && !isKitView ? (
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
        </div>
      ) : null}
    </div>
  );
};
