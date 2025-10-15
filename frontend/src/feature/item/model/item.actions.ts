import type { Dispatch } from 'react';

import { getOtherHand, itemMatchsSpot } from './item.rules';
import type { Item, ItemsState } from './item.types';

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
    };

export const initialState: ItemsState = Object.fromEntries(
  ItemSpotValue.map((name) => [name, null])
) as ItemsState;

export const reducer = (state: ItemsState, action: Action): ItemsState => {
  switch (action.type) {
    case 'setItem':
      if (!itemMatchsSpot(action.item.type, action.spot)) return state;
      const previousOther = getOtherHand(action.spot, state[action.spot]?.hands);
      const other = getOtherHand(action.spot, action.item.hands);
      if (!other && !previousOther) return { ...state, [action.spot]: action.item };
      else if (!other && !!previousOther)
        return { ...state, [action.spot]: action.item, [previousOther]: null };
      else return { ...state, [action.spot]: action.item, [other!]: action.item };
    case 'resetItem':
      return { ...state, [action.spot]: null };
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
  };
};
