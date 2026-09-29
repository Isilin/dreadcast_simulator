import { useDeferredValue } from 'react';

import {
  filterEquipment,
  filterKits,
  type EquipmentFilters,
  type KitFilters,
} from '../../model/catalogue-filters.rules';
import type { CatalogueFilter } from '../../model/workbench.types';

import type { ItemSpot } from '@/domain';
import type { Drug } from '@/feature/drug';
import { isArmSpot, itemMatchsSpot } from '@/feature/item';
import type { Item } from '@/feature/item';
import { computeRemainingTech, type Kit, type KitSelection } from '@/feature/kit';
import {
  arePrerequisitesMet,
  usePrerequisiteContext,
  type Prerequisite,
} from '@/feature/prerequisite';

interface UseCatalogueResultsArgs {
  allItems: Item[] | undefined;
  allKits: Kit[] | undefined;
  allDrugs: Drug[];
  /** Kits installed on the active slot. */
  kits: KitSelection[];
  activeItem: Item | null;
  activeSpot: ItemSpot;
  catalogueFilter: CatalogueFilter;
  query: string;
  equipmentFilters: EquipmentFilters;
  kitFilters: KitFilters;
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
  kits,
  activeItem,
  activeSpot,
  catalogueFilter,
  query,
  equipmentFilters,
  kitFilters,
  areItemsLoading,
  areKitsLoading,
  areDrugsLoading,
  hasItemsError,
  hasKitsError,
  hasDrugsError,
}: UseCatalogueResultsArgs) => {
  const prerequisiteContext = usePrerequisiteContext();
  const meetsPrerequisites = (prerequisites: Prerequisite[] | undefined) =>
    arePrerequisitesMet(prerequisites, prerequisiteContext);
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
      isEquippable: (item) => meetsPrerequisites(item.prerequisites),
    },
  );
  const visibleKits = filterKits(
    (allKits ?? []).filter(
      (kit) => kit.type === activeItem?.type && matchesQuery(kit.name),
    ),
    kitFilters,
    {
      remainingTech: activeItem ? computeRemainingTech(activeItem.tech, kits) : 0,
      isEquippable: (kit) => meetsPrerequisites(kit.prerequisites),
    },
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
    meetsPrerequisites,
  };
};
