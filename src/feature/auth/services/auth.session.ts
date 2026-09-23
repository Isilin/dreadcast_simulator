import type { Session } from '@supabase/supabase-js';

import { useAuthStore } from '../model';
import { getSupabaseClient } from './auth.client';
import { hasSupabaseAuthConfig } from './auth.config';

export const bootstrapAuthSession = async (): Promise<Session | null> => {
  const { setSession, setBootstrapping } = useAuthStore.getState();

  if (!hasSupabaseAuthConfig) {
    setSession(null);
    setBootstrapping(false);
    return null;
  }

  try {
    const client = await getSupabaseClient();
    const { data } = await client.auth.getSession();
    setSession(data.session ?? null);
    return data.session ?? null;
  } finally {
    setBootstrapping(false);
  }
};

let authListenerInitialized = false;

export const initAuthListener = () => {
  if (authListenerInitialized || !hasSupabaseAuthConfig) {
    return;
  }

  authListenerInitialized = true;

  void getSupabaseClient().then((client) => {
    client.auth.onAuthStateChange((_event, session) => {
      useAuthStore.getState().setSession(session ?? null);
    });
  });
};

export const getCurrentSession = async (): Promise<Session | null> => {
  if (!hasSupabaseAuthConfig) {
    return null;
  }

  const client = await getSupabaseClient();
  const { data } = await client.auth.getSession();
  return data.session ?? null;
};

export const requireAuthenticatedSession = async (): Promise<boolean> => {
  const session = await getCurrentSession();
  return Boolean(session?.user);
};
