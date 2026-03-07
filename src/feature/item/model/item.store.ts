import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import { getOtherHand, isWeaponType, itemMatchsSpot } from './item.rules';
import type { DamageBonusType, Item, ItemsState } from './item.types';

import { ItemSpotValue, type ItemSpot } from '@/domain';

interface ItemStore {
  items: ItemsState;
  setItem: (spot: ItemSpot, item: Item) => void;
  resetItem: (spot: ItemSpot) => void;
  replaceItems: (state: ItemsState) => void;
  setDamageBonus: (spot: ItemSpot, bonus: DamageBonusType) => void;
}

export type ItemsActions = Pick<
  ItemStore,
  'setItem' | 'resetItem' | 'replaceItems' | 'setDamageBonus'
>;

export const initialState: ItemsState = Object.fromEntries(
  ItemSpotValue.map((name) => [name, null]),
) as ItemsState;

export const useItemStore = create<ItemStore>((set) => ({
  items: initialState,
  setItem: (spot, item) =>
    set((s) => {
      if (!itemMatchsSpot(item.type, spot)) return s;
      const previousOther = getOtherHand(spot, s.items[spot]?.hands);
      const other = getOtherHand(spot, item.hands);
      const itemWithBonus = isWeaponType(item.type)
        ? { ...item, damageBonus: item.damageBonus ?? 0 }
        : item;
      if (!other && !previousOther)
        return { items: { ...s.items, [spot]: itemWithBonus } };
      if (!other && !!previousOther)
        return {
          items: { ...s.items, [spot]: itemWithBonus, [previousOther]: null },
        };
      return {
        items: { ...s.items, [spot]: itemWithBonus, [other!]: itemWithBonus },
      };
    }),
  resetItem: (spot) => set((s) => ({ items: { ...s.items, [spot]: null } })),
  replaceItems: (items) => set({ items }),
  setDamageBonus: (spot, bonus) =>
    set((s) => {
      if (!s.items[spot] || !isWeaponType(s.items[spot]!.type)) return s;
      const otherSpot = getOtherHand(spot, s.items[spot]?.hands);
      const nextItem: Item = { ...s.items[spot]!, damageBonus: bonus };
      if (!otherSpot) return { items: { ...s.items, [spot]: nextItem } };
      return {
        items: { ...s.items, [spot]: nextItem, [otherSpot]: nextItem },
      };
    }),
}));

export const useItemsState = (): ItemsState => useItemStore((s) => s.items);

export const useItemsActions = (): ItemsActions =>
  useItemStore(
    useShallow((s) => ({
      setItem: s.setItem,
      resetItem: s.resetItem,
      replaceItems: s.replaceItems,
      setDamageBonus: s.setDamageBonus,
    })),
  );
