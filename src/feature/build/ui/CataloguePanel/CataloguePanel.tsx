import { useState } from 'react';

import { CatalogueFilters } from './CatalogueFilters';
import { CatalogueGrid } from './CatalogueGrid';
import styles from './CataloguePanel.module.css';
import { useCatalogueResults } from './useCatalogueResults';
import {
  type CatalogueFilter,
  type WorkbenchMode,
} from '../../model/workbench.types';

import type { ItemSpot } from '@/domain';
import type { Drug } from '@/feature/drug';
import type { Implant, ImplantsState } from '@/feature/implant';
import type { Item, ItemsState } from '@/feature/item';
import type { Kit } from '@/feature/kit';

interface CataloguePanelProps {
  allItems: Item[] | undefined;
  allKits: Kit[] | undefined;
  allImplants: Implant[];
  allDrugs: Drug[];
  hasItemsError: boolean;
  hasKitsError: boolean;
  hasImplantsError: boolean;
  hasDrugsError: boolean;
  areItemsLoading: boolean;
  areKitsLoading: boolean;
  areImplantsLoading: boolean;
  areDrugsLoading: boolean;
  items: ItemsState;
  implantLevels: ImplantsState;
  selectedDrugId: string | null;
  activeItem: Item | null;
  activeSpot: ItemSpot;
  activeMode: WorkbenchMode;
  catalogueFilter: CatalogueFilter;
  onSelectCatalogueFilter: (filter: CatalogueFilter) => void;
  onSelectWorkbenchMode: (mode: WorkbenchMode) => void;
  onSelectEquipmentSpot: (spot: ItemSpot) => void;
  onEquip: (item: Item) => void;
  onInstallImplant: (implant: Implant) => void;
  onActivateDrug: (drug: Drug) => void;
  onAddKit: (kit: Kit) => void;
}

export const CataloguePanel = ({
  allItems,
  allKits,
  allImplants,
  allDrugs,
  hasItemsError,
  hasKitsError,
  hasImplantsError,
  hasDrugsError,
  areItemsLoading,
  areKitsLoading,
  areImplantsLoading,
  areDrugsLoading,
  items,
  implantLevels,
  selectedDrugId,
  activeItem,
  activeSpot,
  activeMode,
  catalogueFilter,
  onSelectCatalogueFilter,
  onSelectWorkbenchMode,
  onSelectEquipmentSpot,
  onEquip,
  onInstallImplant,
  onActivateDrug,
  onAddKit,
}: CataloguePanelProps) => {
  const [query, setQuery] = useState('');
  const {
    visibleItems,
    visibleKits,
    visibleImplants,
    visibleDrugs,
    catalogueCount,
    isCatalogueLoading,
    isCatalogueUnavailable,
  } = useCatalogueResults({
    allItems,
    allKits,
    allImplants,
    allDrugs,
    activeItem,
    activeSpot,
    catalogueFilter,
    query,
    areItemsLoading,
    areKitsLoading,
    areImplantsLoading,
    areDrugsLoading,
    hasItemsError,
    hasKitsError,
    hasImplantsError,
    hasDrugsError,
  });
  return (
    <aside className={styles.catalogue} aria-label="Catalogue du build">
      <div className={styles.panelHeader}>
        <p className={styles.eyebrow}>Inventaire disponible</p>
        <h1>Catalogue</h1>
        <span className={styles.counter} aria-live="polite">
          {catalogueCount} éléments
        </span>
      </div>

      <CatalogueFilters
        activeMode={activeMode}
        activeSpot={activeSpot}
        catalogueFilter={catalogueFilter}
        items={items}
        query={query}
        onQueryChange={setQuery}
        onSelectCatalogueFilter={onSelectCatalogueFilter}
        onSelectEquipmentSpot={onSelectEquipmentSpot}
        onSelectWorkbenchMode={onSelectWorkbenchMode}
      />
      <CatalogueGrid
        activeItem={activeItem}
        activeSpot={activeSpot}
        catalogueCount={catalogueCount}
        catalogueFilter={catalogueFilter}
        implantLevels={implantLevels}
        isCatalogueLoading={isCatalogueLoading}
        isCatalogueUnavailable={isCatalogueUnavailable}
        selectedDrugId={selectedDrugId}
        visibleDrugs={visibleDrugs}
        visibleImplants={visibleImplants}
        visibleItems={visibleItems}
        visibleKits={visibleKits}
        onActivateDrug={onActivateDrug}
        onAddKit={onAddKit}
        onEquip={onEquip}
        onInstallImplant={onInstallImplant}
      />
    </aside>
  );
};
