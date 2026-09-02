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
