import type { Dispatch } from 'react';

import type { Gender, ProfileState, RaceType } from './profile.types';

export type Action =
  | {
      type: 'setGender';
      gender: Gender;
    }
  | {
      type: 'setRace';
      race: RaceType;
    }
  | { type: 'replaceProfile'; state: ProfileState };

export const initialState: ProfileState = {
  race: 'Humain',
  gender: 'male',
};

export const reducer = (state: ProfileState, action: Action): ProfileState => {
  switch (action.type) {
    case 'setGender':
      return { ...state, gender: action.gender };
    case 'setRace':
      return { ...state, race: action.race };
    case 'replaceProfile':
      return action.state;
    default:
      return state;
  }
};

export const createProfilesActions = (dispatch: Dispatch<Action>) => {
  return {
    setGender: (gender: Gender) => dispatch({ type: 'setGender', gender }),
    setRace: (race: RaceType) => dispatch({ type: 'setRace', race }),
    replaceProfile: (state: ProfileState) =>
      dispatch({ type: 'replaceProfile', state }),
  };
};
