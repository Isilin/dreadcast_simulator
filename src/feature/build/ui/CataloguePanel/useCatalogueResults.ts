import { useDeferredValue } from 'react';

import type { CatalogueFilter } from '../../model/workbench.types';

import type { ItemSpot } from '@/domain';
import type { Drug } from '@/feature/drug';
import { itemMatchsSpot } from '@/feature/item';
import type { Item } from '@/feature/item';
import type { Kit } from '@/feature/kit';

interface UseCatalogueResultsArgs {
  allItems: Item[] | undefined;
  allKits: Kit[] | undefined;
  allDrugs: Drug[];
  activeItem: Item | null;
  activeSpot: ItemSpot;
  catalogueFilter: CatalogueFilter;
  query: string;
  areItemsLoading: boolean;
  areKitsLoading: boolean;
  areDrugsLoading: boolean;
  hasItemsError: boolean;
  hasKitsError: boolean;
  hasDrugsError: boolean;
}

export const useCatalogueResults = ({
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
}: UseCatalogueResultsArgs) => {
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase());
  const matchesQuery = (name: string) =>
    name.toLocaleLowerCase().includes(deferredQuery);
  const visibleItems = (allItems ?? []).filter(
    (item) => itemMatchsSpot(item.type, activeSpot) && matchesQuery(item.name),
  );
  const visibleKits = (allKits ?? []).filter(
    (kit) => kit.type === activeItem?.type && matchesQuery(kit.name),
  );
  const visibleDrugs = allDrugs.filter((drug) => matchesQuery(drug.name));
  const catalogueCount =
    catalogueFilter === 'equipment'
      ? visibleItems.length
      : catalogueFilter === 'kits'
        ? visibleKits.length
        : visibleDrugs.length;
  const isCatalogueLoading =
    (catalogueFilter === 'equipment' && areItemsLoading) ||
    (catalogueFilter === 'kits' && areKitsLoading) ||
    (catalogueFilter === 'drugs' && areDrugsLoading);
  const isCatalogueUnavailable =
    (catalogueFilter === 'equipment' && hasItemsError && !allItems) ||
    (catalogueFilter === 'kits' && hasKitsError && !allKits) ||
    (catalogueFilter === 'drugs' && hasDrugsError && !allDrugs.length);

  return {
    visibleItems,
    visibleKits,
    visibleDrugs,
    catalogueCount,
    isCatalogueLoading,
    isCatalogueUnavailable,
  };
};
