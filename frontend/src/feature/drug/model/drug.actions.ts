import type { Dispatch } from 'react';

import type { DrugsState } from './drug.types';

export type Action =
  | { type: 'selectDrug'; id: string }
  | { type: 'deselectDrug' }
  | { type: 'replaceDrug'; state: DrugsState };

export const initialState: DrugsState = null;

export const reducer = (state: DrugsState, action: Action): DrugsState => {
  switch (action.type) {
    case 'selectDrug':
      return action.id;
    case 'deselectDrug':
      return null;
    case 'replaceDrug':
      return action.state;
    default:
      return state;
  }
};

export const createDrugsActions = (dispatch: Dispatch<Action>) => {
  return {
    selectDrug: (id: string) => dispatch({ type: 'selectDrug', id }),
    deselectDrug: () => dispatch({ type: 'deselectDrug' }),
    replaceDrug: (state: DrugsState) =>
      dispatch({ type: 'replaceDrug', state }),
  };
};
