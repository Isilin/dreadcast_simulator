import { useAuthStore } from '../model';
import { fetchSession } from './auth.api';
import type { AuthSession } from '../model/auth.types';

import { onUnauthorized } from '@/utils/api-client';

let bootstrap: Promise<AuthSession | null> | undefined;

/**
 * Reads the session of the cookie once at startup (GET /api/auth/me). An
 * unreachable API reads as signed out.
 */
export const bootstrapAuthSession = (): Promise<AuthSession | null> => {
  bootstrap ??= (async () => {
    const { setSession, setBootstrapping } = useAuthStore.getState();
    try {
      const session = await fetchSession().catch(() => null);
      setSession(session);
      return session;
    } finally {
      setBootstrapping(false);
    }
  })();
  return bootstrap;
};

let listenerInitialized = false;

/** A 401 from any call means the session ended: forget the user. */
export const initAuthListener = () => {
  if (listenerInitialized) {
    return;
  }
  listenerInitialized = true;
  onUnauthorized(() => {
    if (useAuthStore.getState().auth.session) {
      useAuthStore.getState().setSession(null);
    }
  });
};

/** Current session, once the startup check is done. */
export const getCurrentSession = async (): Promise<AuthSession | null> => {
  await bootstrapAuthSession();
  return useAuthStore.getState().auth.session;
};

export const requireAuthenticatedSession = async (): Promise<boolean> =>
  Boolean((await getCurrentSession())?.user);
