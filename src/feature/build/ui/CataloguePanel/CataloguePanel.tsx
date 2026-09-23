import { useState } from 'react';

import { CatalogueFilters } from './CatalogueFilters';
import { CatalogueGrid } from './CatalogueGrid';
import styles from './CataloguePanel.module.css';
import { useCatalogueResults } from './useCatalogueResults';
import {
  type CatalogueFilter,
  type CatalogueTab,
} from '../../model/workbench.types';

import type { ItemSpot } from '@/domain';
import type { Drug } from '@/feature/drug';
import type { Item, ItemsState } from '@/feature/item';
import type { Kit } from '@/feature/kit';

interface CataloguePanelProps {
  allItems: Item[] | undefined;
  allKits: Kit[] | undefined;
  allDrugs: Drug[];
  hasItemsError: boolean;
  hasKitsError: boolean;
  hasDrugsError: boolean;
  areItemsLoading: boolean;
  areKitsLoading: boolean;
  areDrugsLoading: boolean;
  items: ItemsState;
  selectedDrugId: string | null;
  activeItem: Item | null;
  activeSpot: ItemSpot;
  catalogueFilter: CatalogueFilter;
  onSelectCatalogueTab: (tab: CatalogueTab) => void;
  onSelectEquipmentSpot: (spot: ItemSpot) => void;
  onEquip: (item: Item) => void;
  onActivateDrug: (drug: Drug) => void;
  onAddKit: (kit: Kit) => void;
}

export const CataloguePanel = ({
  allItems,
  allKits,
  allDrugs,
  hasItemsError,
  hasKitsError,
  hasDrugsError,
  areItemsLoading,
  areKitsLoading,
  areDrugsLoading,
  items,
  selectedDrugId,
  activeItem,
  activeSpot,
  catalogueFilter,
  onSelectCatalogueTab,
  onSelectEquipmentSpot,
  onEquip,
  onActivateDrug,
  onAddKit,
}: CataloguePanelProps) => {
  const [query, setQuery] = useState('');
  const {
    visibleItems,
    visibleKits,
    visibleDrugs,
    catalogueCount,
    isCatalogueLoading,
    isCatalogueUnavailable,
  } = useCatalogueResults({
    allItems,
    allKits,
    allDrugs,
    activeItem,
    activeSpot,
    catalogueFilter,
    query,
    areItemsLoading,
    areKitsLoading,
    areDrugsLoading,
    hasItemsError,
    hasKitsError,
    hasDrugsError,
  });
  return (
    <aside className={styles.catalogue} aria-label="Catalogue du build">
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.eyebrow}>Inventaire disponible</p>
          <h1>Catalogue</h1>
        </div>
        <span className={styles.counter} aria-live="polite">
          {catalogueCount} éléments
        </span>
      </div>

      <CatalogueFilters
        activeSpot={activeSpot}
        catalogueFilter={catalogueFilter}
        items={items}
        query={query}
        onQueryChange={setQuery}
        onSelectCatalogueTab={onSelectCatalogueTab}
        onSelectEquipmentSpot={onSelectEquipmentSpot}
      />
      <CatalogueGrid
        activeItem={activeItem}
        activeSpot={activeSpot}
        catalogueCount={catalogueCount}
        catalogueFilter={catalogueFilter}
        isCatalogueLoading={isCatalogueLoading}
        isCatalogueUnavailable={isCatalogueUnavailable}
        selectedDrugId={selectedDrugId}
        visibleDrugs={visibleDrugs}
        visibleItems={visibleItems}
        visibleKits={visibleKits}
        onActivateDrug={onActivateDrug}
        onAddKit={onAddKit}
        onEquip={onEquip}
      />
    </aside>
  );
};
