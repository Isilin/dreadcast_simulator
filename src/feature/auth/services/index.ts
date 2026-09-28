import type { Session } from '@supabase/supabase-js';

export { AuthBootstrap } from './AuthBootstrap';
export {
  getMissingAuthConfigErrorMessage,
  isAuthConfigured,
} from './auth.config';

const loadAuthService = () => import('./auth.service');

const getCurrentSession = async (): Promise<Session | null> => {
  const { getCurrentSession: getSession } = await loadAuthService();
  return getSession();
};

/**
 * Access token for signed-in /api calls. Throws when there is no session;
 * callers can provide their own typed error.
 */
export const getAccessToken = async (
  createMissingSessionError: () => Error = () =>
    new Error('Session utilisateur manquante.'),
): Promise<string> => {
  const session = await getCurrentSession();
  const accessToken = session?.access_token;

  if (!accessToken) {
    throw createMissingSessionError();
  }

  return accessToken;
};

/** Access token for /api calls open to guests: undefined when signed out. */
export const getOptionalAccessToken = async (): Promise<string | undefined> =>
  (await getCurrentSession())?.access_token;
