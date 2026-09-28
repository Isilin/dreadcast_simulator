import type { AuthError } from '@supabase/supabase-js';

import { useAuthStore } from '../model';
import { getSupabaseClient } from './auth.client';
import {
  hasSupabaseAuthConfig,
  missingConfigErrorMessage,
} from './auth.config';

import { RepositoryError } from '@/utils/repository-error';

export interface SignInWithPasswordInput {
  email: string;
  password: string;
}

export interface SignInWithPasswordResult {
  error: AuthError | Error | null;
}

export const signInWithPassword = async ({
  email,
  password,
}: SignInWithPasswordInput): Promise<SignInWithPasswordResult> => {
  if (!hasSupabaseAuthConfig) {
    return { error: new Error(missingConfigErrorMessage) };
  }

  const { callApi } = await import('@/utils/api-client');
  let payload: { accessToken: string; refreshToken: string };
  try {
    payload = await callApi(
      (client) => client.auth.login({ payload: { email, password } }),
      {
        ErrorClass: RepositoryError,
        failed: { code: 'LOGIN_FAILED', message: 'Échec de la connexion.' },
        invalid: {
          code: 'INVALID_LOGIN_PAYLOAD',
          message: 'Échec de la connexion.',
        },
        apiMessage: true,
        request: { group: 'auth', endpoint: 'login', part: 'Payload' },
      },
    );
  } catch (error) {
    return {
      error:
        error instanceof Error ? error : new Error('Échec de la connexion.'),
    };
  }

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
