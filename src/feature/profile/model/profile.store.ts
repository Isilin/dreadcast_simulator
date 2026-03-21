import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import type { Gender, ProfileState, RaceType } from './profile.types';
import { useBuildReadOnlyMode } from '@/feature/persistence';

interface ProfileStore {
  profile: ProfileState;
  setGender: (gender: Gender) => void;
  setRace: (race: RaceType) => void;
  replaceProfile: (state: ProfileState) => void;
}

export type ProfileActions = Pick<
  ProfileStore,
  'setGender' | 'setRace' | 'replaceProfile'
>;

export const initialState: ProfileState = {
  race: 'Humain',
  gender: 'male',
};

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: initialState,
  setGender: (gender) => {
    set((s) => ({ profile: { ...s.profile, gender } }));
  },
  setRace: (race) => {
    set((s) => ({ profile: { ...s.profile, race } }));
  },
  replaceProfile: (profile) => set({ profile }),
}));

export const useProfileState = (): ProfileState =>
  useProfileStore((s) => s.profile);

export const useProfileActions = (): ProfileActions => {
  const isReadOnly = useBuildReadOnlyMode();
  const actions = useProfileStore(
    useShallow((s) => ({
      setGender: s.setGender,
      setRace: s.setRace,
      replaceProfile: s.replaceProfile,
    })),
  );

  if (!isReadOnly) {
    return actions;
  }

  return {
    setGender: () => undefined,
    setRace: () => undefined,
    replaceProfile: actions.replaceProfile,
  };
};
