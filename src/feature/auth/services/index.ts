import type { Session } from '@supabase/supabase-js';

import type {
  SignInWithPasswordInput,
  SignInWithPasswordResult,
} from './auth.service';

export { AuthBootstrap } from './AuthBootstrap';
export {
  getMissingAuthConfigErrorMessage,
  isAuthConfigured,
} from './auth.config';

const loadAuthService = () => import('./auth.service');

export const bootstrapAuthSession = async (): Promise<Session | null> => {
  const { bootstrapAuthSession: bootstrap } = await loadAuthService();
  return bootstrap();
};

export const initAuthListener = () => {
  void loadAuthService().then(({ initAuthListener: init }) => init());
};

export const getCurrentSession = async (): Promise<Session | null> => {
  const { getCurrentSession: getSession } = await loadAuthService();
  return getSession();
};

/**
 * JSON + bearer headers for /api calls. Throws when there is no session;
 * callers can provide their own typed error.
 */
export const getAuthHeaders = async (
  createMissingSessionError: () => Error = () =>
    new Error('Session utilisateur manquante.'),
): Promise<HeadersInit> => {
  const session = await getCurrentSession();
  const accessToken = session?.access_token;

  if (!accessToken) {
    throw createMissingSessionError();
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };
};

export const requireAuthenticatedSession = async (): Promise<boolean> => {
  const { requireAuthenticatedSession: requireSession } =
    await loadAuthService();
  return requireSession();
};

export const signInWithPassword = async (
  input: SignInWithPasswordInput,
): Promise<SignInWithPasswordResult> => {
  const { signInWithPassword: signIn } = await loadAuthService();
  return signIn(input);
};

export const signOut = async () => {
  const { signOut: signOutUser } = await loadAuthService();
  return signOutUser();
};

export type {
  SignInWithPasswordInput,
  SignInWithPasswordResult,
} from './auth.service';
