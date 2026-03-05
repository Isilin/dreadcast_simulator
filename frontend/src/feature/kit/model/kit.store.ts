import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import type { Kit, KitSelection, KitsState } from './kit.types';

import { ItemSpotValue, type ItemSpot } from '@/domain';

interface KitStore {
  kits: KitsState;
  addKit: (spot: ItemSpot, kit: Kit, force?: boolean) => void;
  setKit: (spot: ItemSpot, index: number, kit: Kit) => void;
  deleteKit: (spot: ItemSpot, index: number) => void;
  setKitNumber: (spot: ItemSpot, index: number, number: number) => void;
  replaceKits: (state: KitsState) => void;
}

export const initialState: KitsState = Object.fromEntries(
  ItemSpotValue.map((name) => [name, [] as KitSelection[]]),
) as KitsState;

export const useKitStore = create<KitStore>((set) => ({
  kits: initialState,
  addKit: (spot, kit, force) =>
    set((s) => {
      const slot = s.kits[spot];
      const existingIndex = slot.findIndex((k) => k.kit.id === kit.id);
      let kits: KitSelection[];
      if (!force && existingIndex !== -1) {
        kits = slot.map((k, i) =>
          i === existingIndex ? { ...k, number: k.number + 1 } : k,
        );
      } else {
        kits = [...slot, { kit, number: 1 }];
      }
      return { kits: { ...s.kits, [spot]: kits } };
    }),
  setKit: (spot, index, kit) =>
    set((s) => {
      const slot = s.kits[spot];
      if (!slot || index < 0 || index >= slot.length) return s;
      const kits = slot.map((k, i) => (i === index ? { ...k, kit } : k));
      return { kits: { ...s.kits, [spot]: kits } };
    }),
  deleteKit: (spot, index) =>
    set((s) => {
      const slot = s.kits[spot];
      if (!slot || index < 0 || index >= slot.length) return s;
      return {
        kits: { ...s.kits, [spot]: slot.filter((_, i) => i !== index) },
      };
    }),
  setKitNumber: (spot, index, number) =>
    set((s) => {
      const slot = s.kits[spot];
      if (!slot || index < 0 || index >= slot.length) return s;
      const kits = slot.map((k, i) => (i === index ? { ...k, number } : k));
      return { kits: { ...s.kits, [spot]: kits } };
    }),
  replaceKits: (kits) => set({ kits }),
}));

export const useKitsActions = () =>
  useKitStore(
    useShallow((s) => ({
      addKit: s.addKit,
      setKit: s.setKit,
      deleteKit: s.deleteKit,
      setKitNumber: s.setKitNumber,
      replaceKits: s.replaceKits,
    })),
  );
