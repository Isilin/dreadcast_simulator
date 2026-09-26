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

/**
 * JSON headers for /api calls open to guests: bearer only when signed in.
 */
export const getOptionalAuthHeaders = async (): Promise<HeadersInit> => {
  const session = await getCurrentSession();
  const accessToken = session?.access_token;

  return accessToken
    ? {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      }
    : { 'Content-Type': 'application/json' };
};
