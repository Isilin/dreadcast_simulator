import { ItemSpotValue, type ItemSpot } from '@/domain';
import type { DrugsState } from '@/feature/drug';
import type { ImplantsState } from '@/feature/implant';
import type { DamageBonusType, Item, ItemsState } from '@/feature/item';
import type { Kit, KitSelection, KitsState } from '@/feature/kit';
import type { ProfileState } from '@/feature/profile';

export const BUILDS_KEY = 'dreadcast.builds.v3';
export const GUEST_SLOTS = 1;
export const AUTHENTICATED_FREE_SLOTS = 5;

export type BuildStorageMode = 'local' | 'remote';

export interface BuildPersistencePolicy {
  mode: BuildStorageMode;
  hasUnlimitedSlots: boolean;
  visibleSlotCount: number;
}

interface ResolveBuildPersistencePolicyParams {
  isAuthenticated: boolean;
  hasValidSubscription: boolean;
}

export const resolveBuildPersistencePolicy = ({
  isAuthenticated,
  hasValidSubscription,
}: ResolveBuildPersistencePolicyParams): BuildPersistencePolicy => {
  if (!isAuthenticated) {
    return {
      mode: 'local',
      hasUnlimitedSlots: false,
      visibleSlotCount: GUEST_SLOTS,
    };
  }

  if (hasValidSubscription) {
    return {
      mode: 'remote',
      hasUnlimitedSlots: true,
      visibleSlotCount: AUTHENTICATED_FREE_SLOTS,
    };
  }

  return {
    mode: 'remote',
    hasUnlimitedSlots: false,
    visibleSlotCount: AUTHENTICATED_FREE_SLOTS,
  };
};

export interface SerializedItem {
  id: string;
  damageBonus?: DamageBonusType;
}

export type SerializedItemsSnapshot = Record<ItemSpot, SerializedItem | null>;

export interface SerializedKitSelection {
  id: string;
  number: number;
}

export type SerializedKitsSnapshot = Record<ItemSpot, SerializedKitSelection[]>;

export interface BuildSnapshot {
  name?: string;
  profile: ProfileState;
  implants: ImplantsState;
  items: SerializedItemsSnapshot;
  kits: SerializedKitsSnapshot;
  drug: DrugsState;
  savedAt?: number;
}

export const getDefaultBuildName = (slot: string) => `Build ${slot}`;

export const serializeItems = (state: ItemsState): SerializedItemsSnapshot =>
  Object.fromEntries(
    ItemSpotValue.map((spot) => {
      const item = state[spot];
      return [
        spot,
        item ? { id: item.id, damageBonus: item.damageBonus } : null,
      ];
    }),
  ) as SerializedItemsSnapshot;

export const serializeKits = (state: KitsState): SerializedKitsSnapshot =>
  Object.fromEntries(
    ItemSpotValue.map((spot) => [
      spot,
      state[spot].map((ks) => ({ id: ks.kit.id, number: ks.number })),
    ]),
  ) as SerializedKitsSnapshot;

export const restoreItems = (
  snapshot: SerializedItemsSnapshot,
  allItems: Item[],
): ItemsState =>
  Object.fromEntries(
    ItemSpotValue.map((spot) => {
      const s = snapshot[spot];
      if (!s) return [spot, null];
      const fullItem = allItems.find((item) => item.id === s.id) ?? null;
      if (!fullItem) return [spot, null];
      return [
        spot,
        s.damageBonus !== undefined
          ? { ...fullItem, damageBonus: s.damageBonus }
          : fullItem,
      ];
    }),
  ) as ItemsState;

export const restoreKits = (
  snapshot: SerializedKitsSnapshot,
  allKits: Kit[],
): KitsState =>
  Object.fromEntries(
    ItemSpotValue.map((spot) => [
      spot,
      snapshot[spot]
        .map((sk): KitSelection | null => {
          const fullKit = allKits.find((kit) => kit.id === sk.id) ?? null;
          return fullKit ? { kit: fullKit, number: sk.number } : null;
        })
        .filter((ks): ks is KitSelection => ks !== null),
    ]),
  ) as KitsState;

export const readBuilds = (): Record<string, BuildSnapshot> => {
  try {
    const raw = localStorage.getItem(BUILDS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, BuildSnapshot>;
  } catch {
    return {};
  }
};

export const writeBuilds = (s: Record<string, BuildSnapshot>) =>
  localStorage.setItem(BUILDS_KEY, JSON.stringify(s));

export const clearLocalBuilds = () => {
  try {
    localStorage.removeItem(BUILDS_KEY);
  } catch {
    // Silently fail if localStorage is not available
  }
};
