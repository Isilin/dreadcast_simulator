import type { AuthError } from '@supabase/supabase-js';

import { useAuthStore } from '../model';
import { getSupabaseClient } from './auth.client';
import {
  hasSupabaseAuthConfig,
  missingConfigErrorMessage,
} from './auth.config';

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

  const client = await getSupabaseClient();
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

  const client = await getSupabaseClient();
  await client.auth.signOut();
  useAuthStore.getState().setSession(null);
};
