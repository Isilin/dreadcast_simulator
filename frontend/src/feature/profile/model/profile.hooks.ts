import { useProfileActions, useProfileStore } from './profile.store';
import type { ProfileState } from './profile.types';

export const useProfileState = (): ProfileState =>
  useProfileStore((s) => s.profile);

export const useProfileDispatch = () => useProfileActions();
