import type { Dispatch } from 'react';

import { ImplantNameValues, type ImplantName, type ImplantsState } from './implant.types';

export type Action =
  | {
      type: 'setImplant';
      implantName: ImplantName;
      level: number;
    }
  | {
      type: 'increaseImplant';
      implantName: ImplantName;
    }
  | {
      type: 'decreaseImplant';
      implantName: ImplantName;
    };

export const initialState: ImplantsState = Object.fromEntries(
  ImplantNameValues.map((name) => [name, 0])
) as ImplantsState;

export const reducer = (state: ImplantsState, action: Action): ImplantsState => {
  const implant = state[action.implantName];
  switch (action.type) {
    case 'setImplant':
      return { ...state, [action.implantName]: action.level };
    case 'increaseImplant':
      return { ...state, [action.implantName]: implant + 1 };
    case 'decreaseImplant':
      return { ...state, [action.implantName]: implant - 1 };
    default:
      return state;
  }
};

export const createImplantsActions = (dispatch: Dispatch<Action>) => {
  return {
    setImplant: (name: ImplantName, level: number) =>
      dispatch({
        type: 'setImplant',
        implantName: name,
        level,
      }),
    increaseImplant: (name: ImplantName) =>
      dispatch({
        type: 'increaseImplant',
        implantName: name,
      }),
    decreaseImplant: (name: ImplantName) =>
      dispatch({
        type: 'decreaseImplant',
        implantName: name,
      }),
  };
};
