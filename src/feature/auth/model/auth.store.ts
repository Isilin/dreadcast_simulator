import type { Session } from '@supabase/supabase-js';
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import type { AuthState } from './auth.types';

interface AuthStore {
  auth: AuthState;
  setSession: (session: Session | null) => void;
  setBootstrapping: (isBootstrapping: boolean) => void;
}

export type AuthActions = Pick<AuthStore, 'setSession' | 'setBootstrapping'>;

const initialState: AuthState = {
  session: null,
  isBootstrapping: true,
};

export const useAuthStore = create<AuthStore>((set) => ({
  auth: initialState,
  setSession: (session) =>
    set((state) => ({ auth: { ...state.auth, session } })),
  setBootstrapping: (isBootstrapping) =>
    set((state) => ({ auth: { ...state.auth, isBootstrapping } })),
}));

export const useAuthState = (): AuthState =>
  useAuthStore((state) => state.auth);

export const useAuthActions = (): AuthActions =>
  useAuthStore(
    useShallow((state) => ({
      setSession: state.setSession,
      setBootstrapping: state.setBootstrapping,
    })),
  );
