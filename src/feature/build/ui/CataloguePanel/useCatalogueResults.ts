import { useDeferredValue } from 'react';

import {
  filterEquipment,
  type EquipmentFilters,
} from '../../model/catalogue-filters.rules';
import type { CatalogueFilter } from '../../model/workbench.types';

import type { ItemSpot } from '@/domain';
import type { Drug } from '@/feature/drug';
import { useImplantsEffects } from '@/feature/implant';
import { isArmSpot, itemMatchsSpot, itemPrerequisitesMet } from '@/feature/item';
import type { Item } from '@/feature/item';
import type { Kit } from '@/feature/kit';
import { useRaceStats } from '@/feature/profile';

interface UseCatalogueResultsArgs {
  allItems: Item[] | undefined;
  allKits: Kit[] | undefined;
  allDrugs: Drug[];
  activeItem: Item | null;
  activeSpot: ItemSpot;
  catalogueFilter: CatalogueFilter;
  query: string;
  equipmentFilters: EquipmentFilters;
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
  equipmentFilters,
  areItemsLoading,
  areKitsLoading,
  areDrugsLoading,
  hasItemsError,
  hasKitsError,
  hasDrugsError,
}: UseCatalogueResultsArgs) => {
  const raceStats = useRaceStats();
  const implantsEffects = useImplantsEffects();
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase());
  const matchesQuery = (name: string) =>
    name.toLocaleLowerCase().includes(deferredQuery);
  const visibleItems = filterEquipment(
    (allItems ?? []).filter(
      (item) =>
        itemMatchsSpot(item.type, activeSpot) && matchesQuery(item.name),
    ),
    equipmentFilters,
    {
      isArmSpot: isArmSpot(activeSpot),
      isEquippable: (item) =>
        itemPrerequisitesMet(item, raceStats ?? {}, implantsEffects),
    },
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
