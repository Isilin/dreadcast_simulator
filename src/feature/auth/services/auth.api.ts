import type { AuthSession } from '../model/auth.types';

import { callApi } from '@/utils/api-client';
import { RepositoryError } from '@/utils/repository-error';

const LOGIN_FAILED = {
  code: 'LOGIN_FAILED',
  message: 'Échec de la connexion.',
};

/** Sign-in: the server sets the HttpOnly session cookie. */
export const login = (email: string, password: string): Promise<AuthSession> =>
  callApi(
    (client) => client.api.auth.login.$post({ json: { email, password } }),
    {
      ErrorClass: RepositoryError,
      failed: LOGIN_FAILED,
      invalid: { ...LOGIN_FAILED, code: 'INVALID_LOGIN_PAYLOAD' },
      apiMessage: true,
    },
  );

/** User of the session cookie, null when signed out or expired. */
export const fetchSession = async (): Promise<AuthSession | null> => {
  try {
    return await callApi((client) => client.api.auth.me.$get(), {
      ErrorClass: RepositoryError,
      failed: { code: 'SESSION_FAILED', message: 'Session indisponible.' },
      invalid: { code: 'INVALID_SESSION', message: 'Session indisponible.' },
    });
  } catch (error) {
    if (error instanceof RepositoryError && error.status === 401) {
      return null;
    }
    throw error;
  }
};

/** Ends the session and clears its cookie. */
export const logout = async (): Promise<void> => {
  await callApi((client) => client.api.auth.logout.$post(), {
    ErrorClass: RepositoryError,
    failed: { code: 'LOGOUT_FAILED', message: 'Échec de la déconnexion.' },
    invalid: { code: 'LOGOUT_FAILED', message: 'Échec de la déconnexion.' },
  });
};
