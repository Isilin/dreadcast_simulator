import type { AuthError, Session } from '@supabase/supabase-js';

import { useAuthStore } from '../model';
import { hasSupabaseAuthConfig, supabaseClient } from './auth.client';

const missingConfigErrorMessage =
  'Configuration Supabase manquante : définissez VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY ou NEXT_PUBLIC_SIMULATOR_SUPABASE_URL/NEXT_PUBLIC_SIMULATOR_SUPABASE_ANON_KEY.';

const getSupabaseClient = () => {
  if (!supabaseClient) {
    throw new Error(missingConfigErrorMessage);
  }

  return supabaseClient;
};

export const getMissingAuthConfigErrorMessage = () => missingConfigErrorMessage;

export const isAuthConfigured = () => hasSupabaseAuthConfig;

export const bootstrapAuthSession = async (): Promise<Session | null> => {
  const { setSession, setBootstrapping } = useAuthStore.getState();

  if (!hasSupabaseAuthConfig) {
    setSession(null);
    setBootstrapping(false);
    return null;
  }

  try {
    const client = getSupabaseClient();
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

  const client = getSupabaseClient();
  authListenerInitialized = true;

  client.auth.onAuthStateChange((_event, session) => {
    useAuthStore.getState().setSession(session ?? null);
  });
};

export const getCurrentSession = async (): Promise<Session | null> => {
  if (!hasSupabaseAuthConfig) {
    return null;
  }

  const client = getSupabaseClient();
  const { data } = await client.auth.getSession();
  return data.session ?? null;
};

export const requireAuthenticatedSession = async (): Promise<boolean> => {
  const session = await getCurrentSession();
  return Boolean(session?.user);
};

export interface SignInWithPasswordInput {
  email: string;
  password: string;
}

export interface SignInWithPasswordResult {
  error: AuthError | Error | null;
}

interface LoginApiResponse {
  accessToken: string;
  refreshToken: string;
}

export const signInWithPassword = async ({
  email,
  password,
}: SignInWithPasswordInput): Promise<SignInWithPasswordResult> => {
  if (!hasSupabaseAuthConfig) {
    return { error: new Error(missingConfigErrorMessage) };
  }

  const loginResponse = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!loginResponse.ok) {
    const body = (await loginResponse.json().catch(() => null)) as {
      error?: string;
    } | null;

    return {
      error: new Error(body?.error ?? 'Échec de la connexion.'),
    };
  }

  const payload = (await loginResponse.json()) as LoginApiResponse;

  const client = getSupabaseClient();
  const { data, error } = await client.auth.setSession({
    access_token: payload.accessToken,
    refresh_token: payload.refreshToken,
  });

  if (!error) {
    useAuthStore.getState().setSession(data.session ?? null);
  }

  return { error };
};

export const signOut = async () => {
  if (!hasSupabaseAuthConfig) {
    return;
  }

  const client = getSupabaseClient();
  await client.auth.signOut();
  useAuthStore.getState().setSession(null);
};
