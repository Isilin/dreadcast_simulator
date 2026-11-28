import { useAuthStore } from '../model';
import { login, logout } from './auth.api';

export interface SignInWithPasswordInput {
  email: string;
  password: string;
}

export interface SignInWithPasswordResult {
  error: Error | null;
}

export const signInWithPassword = async ({
  email,
  password,
}: SignInWithPasswordInput): Promise<SignInWithPasswordResult> => {
  try {
    useAuthStore.getState().setSession(await login(email, password));
    return { error: null };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error : new Error('Échec de la connexion.'),
    };
  }
};

/** Signs out locally even when the call fails (the cookie may be gone). */
export const signOut = async () => {
  try {
    await logout();
  } finally {
    useAuthStore.getState().setSession(null);
  }
};
