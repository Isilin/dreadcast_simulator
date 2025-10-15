import type { Dispatch } from 'react';

import type { Kit, KitSelection, KitsState } from './kit.types';

import { ItemSpotValue, type ItemSpot } from '@/domain';

export type Action =
  | {
      type: 'addKit';
      spot: ItemSpot;
      kit: Kit;
      force?: boolean;
    }
  | { type: 'setKit'; spot: ItemSpot; index: number; kit: Kit }
  | { type: 'deleteKit'; spot: ItemSpot; index: number }
  | { type: 'setKitNumber'; spot: ItemSpot; index: number; number: number };

export const initialState: KitsState = Object.fromEntries(
  ItemSpotValue.map((name) => [name, [] as KitSelection[]])
) as KitsState;

export const reducer = (state: KitsState, action: Action): KitsState => {
  switch (action.type) {
    case 'addKit': {
      const slot = state[action.spot];
      const existingIndex = slot.findIndex((k) => k.kit.id === action.kit.id);

      let kits: KitSelection[];
      if (!action.force && existingIndex !== -1) {
        kits = slot.map((k, i) => (i === existingIndex ? { ...k, number: k.number + 1 } : k));
      } else {
        kits = [...slot, { kit: action.kit, number: 1 }];
      }

      return { ...state, [action.spot]: kits };
    }
    case 'setKit': {
      const slot = state[action.spot];
      if (!slot || action.index < 0 || action.index >= slot.length) return state;

      let kits = slot.map((k, i) => (i === action.index ? { ...k, kit: action.kit } : k));

      return { ...state, [action.spot]: kits };
    }
    case 'deleteKit': {
      const slot = state[action.spot];
      if (!slot || action.index < 0 || action.index >= slot.length) return state;

      let kits = slot.filter((_, i) => i !== action.index);

      return {
        ...state,
        [action.spot]: kits,
      };
    }
    case 'setKitNumber': {
      const slot = state[action.spot];
      if (!slot || action.index < 0 || action.index >= slot.length) return state;

      let kits = slot.map((k, i) => (i === action.index ? { ...k, number: action.number } : k));

      return {
        ...state,
        [action.spot]: kits,
      };
    }
    default:
      return state;
  }
};

export const createKitsActions = (dispatch: Dispatch<Action>) => {
  return {
    addKit: (spot: ItemSpot, kit: Kit, force?: boolean) =>
      dispatch({
        type: 'addKit',
        spot,
        kit,
        force,
      }),
    setKit: (spot: ItemSpot, index: number, kit: Kit) =>
      dispatch({
        type: 'setKit',
        spot,
        index,
        kit,
      }),
    deleteKit: (spot: ItemSpot, index: number) =>
      dispatch({
        type: 'deleteKit',
        spot,
        index,
      }),
    setKitNumber: (spot: ItemSpot, index: number, number: number) =>
      dispatch({
        type: 'setKitNumber',
        spot,
        index,
        number,
      }),
  };
};
