import type { Dispatch } from 'react';

import { getOtherHand, isWeaponType, itemMatchsSpot } from './item.rules';
import type { DamageBonusType, Item, ItemsState } from './item.types';

import { ItemSpotValue, type ItemSpot } from '@/domain';

export type Action =
  | {
      type: 'setItem';
      spot: ItemSpot;
      item: Item;
    }
  | {
      type: 'resetItem';
      spot: ItemSpot;
    }
  | {
      type: 'replaceItems';
      state: ItemsState;
    }
  | {
      type: 'setDamageBonus';
      spot: ItemSpot;
      bonus: DamageBonusType;
    };

export const initialState: ItemsState = Object.fromEntries(
  ItemSpotValue.map((name) => [name, null]),
) as ItemsState;

export const reducer = (state: ItemsState, action: Action): ItemsState => {
  switch (action.type) {
    case 'setItem':
      if (!itemMatchsSpot(action.item.type, action.spot)) return state;
      const previousOther = getOtherHand(
        action.spot,
        state[action.spot]?.hands,
      );
      const other = getOtherHand(action.spot, action.item.hands);
      const itemWithBonus = isWeaponType(action.item.type)
        ? {
            ...action.item,
            damageBonus: action.item.damageBonus ?? 0,
          }
        : action.item;
      if (!other && !previousOther)
        return { ...state, [action.spot]: itemWithBonus };
      else if (!other && !!previousOther)
        return {
          ...state,
          [action.spot]: itemWithBonus,
          [previousOther]: null,
        };
      else
        return {
          ...state,
          [action.spot]: itemWithBonus,
          [other!]: itemWithBonus,
        };
    case 'resetItem':
      return { ...state, [action.spot]: null };
    case 'replaceItems':
      return action.state;
    case 'setDamageBonus':
      if (!state[action.spot] || !isWeaponType(state[action.spot]!.type))
        return state;
      const otherSpot = getOtherHand(action.spot, state[action.spot]?.hands);
      const nextItem: Item = {
        ...state[action.spot]!,
        damageBonus: action.bonus,
      };
      if (!otherSpot) {
        return { ...state, [action.spot]: nextItem };
      }
      return {
        ...state,
        [action.spot]: nextItem,
        [otherSpot]: nextItem,
      };
    default:
      return state;
  }
};

export const createItemsActions = (dispatch: Dispatch<Action>) => {
  return {
    setItem: (spot: ItemSpot, item: Item) =>
      dispatch({
        type: 'setItem',
        spot,
        item,
      }),
    resetItem: (spot: ItemSpot) =>
      dispatch({
        type: 'resetItem',
        spot,
      }),
    replaceItems: (state: ItemsState) =>
      dispatch({
        type: 'replaceItems',
        state,
      }),
    setDamageBonus: (spot: ItemSpot, bonus: DamageBonusType) =>
      dispatch({
        type: 'setDamageBonus',
        spot,
        bonus,
      }),
  };
};
