import type { SpecializationWeapons } from './specialization.rules';

import { ItemSpotValue, type Stat } from '@/domain';
import type { Drug } from '@/feature/drug';
import type { Implant } from '@/feature/implant';
import { isHealWeapon, type Item, type ItemsState } from '@/feature/item';
import type { Kit, KitsState } from '@/feature/kit';
import {
  restoreItems,
  restoreKits,
  type BuildSnapshot,
} from '@/feature/persistence';
import { findRaceStats, type Race } from '@/feature/profile';
import { computeSuitStats } from '@/feature/suit';

export interface BuildCatalogs {
  items: Item[];
  kits: Kit[];
  implants: Implant[];
  drugs: Drug[];
  races: Race[];
}

export interface RestoredSnapshot {
  items: ItemsState;
  kits: KitsState;
  drug: Drug | undefined;
  race: Race | undefined;
}

/**
 * Full objects of a snapshot from the current catalogs. Ids missing from the
 * catalogs (removed in a later game version) are dropped.
 */
export const restoreSnapshot = (
  snapshot: BuildSnapshot,
  catalogs: BuildCatalogs,
): RestoredSnapshot => ({
  items: restoreItems(snapshot.items, catalogs.items),
  kits: restoreKits(snapshot.kits, catalogs.kits),
  drug: snapshot.drug
    ? catalogs.drugs.find((drug) => drug.id === snapshot.drug)
    : undefined,
  race: findRaceStats(catalogs.races, snapshot.profile.race),
});

/**
 * Final stats of a snapshot, without touching the workbench stores.
 */
export const computeSnapshotStats = (
  snapshot: BuildSnapshot,
  catalogs: BuildCatalogs,
): Record<Stat, number> => {
  const restored = restoreSnapshot(snapshot, catalogs);

  return computeSuitStats({
    raceStats: restored.race,
    items: restored.items,
    kits: restored.kits,
    implants: snapshot.implants,
    allImplants: catalogs.implants,
    drug: restored.drug,
  });
};

/**
 * Ids of the snapshot that no longer exist in the current catalogs.
 */
export const findMissingSnapshotIds = (
  snapshot: BuildSnapshot,
  catalogs: BuildCatalogs,
): string[] => {
  const itemIds = new Set(catalogs.items.map((item) => item.id));
  const kitIds = new Set(catalogs.kits.map((kit) => kit.id));

  const missingItems = ItemSpotValue.flatMap((spot) => {
    const item = snapshot.items[spot];
    return item && !itemIds.has(item.id) ? [item.id] : [];
  });
  const missingKits = ItemSpotValue.flatMap((spot) =>
    snapshot.kits[spot]
      .filter((kit) => !kitIds.has(kit.id))
      .map((kit) => kit.id),
  );
  const missingDrug =
    snapshot.drug && !catalogs.drugs.some((drug) => drug.id === snapshot.drug)
      ? [snapshot.drug]
      : [];

  return [...new Set([...missingItems, ...missingKits, ...missingDrug])];
};

/**
 * Weapons held in the arms, as used by the specialization detection.
 */
export const getWeaponSummary = (items: ItemsState): SpecializationWeapons => {
  const weapons = [items.leftArm, items.rightArm].filter(
    (item): item is Item => item !== null,
  );

  return {
    types: weapons.map((item) => item.type),
    hasHealWeapon: weapons.some((item) => isHealWeapon(item)),
  };
};
