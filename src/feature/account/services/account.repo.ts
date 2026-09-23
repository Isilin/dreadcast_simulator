import {
  ACCOUNT_REPOSITORY_ERROR_CODE,
  AccountRepositoryError,
} from './account.errors';
import type { AccountProfile } from '../model';

import { getAuthHeaders as getSessionHeaders } from '@/feature/auth';
import { validatePayload } from '@/utils/validation';

const PROFILE_URL = '/api/profile/me';

const getAuthHeaders = (): Promise<HeadersInit> =>
  getSessionHeaders(
    () =>
      new AccountRepositoryError({
        code: ACCOUNT_REPOSITORY_ERROR_CODE.MISSING_AUTH_SESSION,
        message: 'Session utilisateur manquante.',
        status: 401,
      }),
  );

const parseProfile = async (response: Response): Promise<AccountProfile> => {
  const payload: unknown = await response.json();
  const { profileResponseDtoSchema } = await import('./account.schema');
  const profile = validatePayload({
    schema: profileResponseDtoSchema,
    payload,
    errorCode: ACCOUNT_REPOSITORY_ERROR_CODE.INVALID_PROFILE_PAYLOAD,
    errorMessage: 'Le format du profil recu est invalide.',
  });

  return { pseudo: profile.pseudo };
};

export const fetchAccountProfile = async (
  signal?: AbortSignal,
): Promise<AccountProfile> => {
  const response = await fetch(PROFILE_URL, {
    method: 'GET',
    headers: await getAuthHeaders(),
    signal,
  });

  if (!response.ok) {
    throw new AccountRepositoryError({
      code: ACCOUNT_REPOSITORY_ERROR_CODE.FETCH_PROFILE_FAILED,
      message: 'Impossible de recuperer le profil.',
      status: response.status,
    });
  }

  return parseProfile(response);
};

export const createPseudo = async (pseudo: string): Promise<AccountProfile> => {
  const response = await fetch(PROFILE_URL, {
    method: 'PUT',
    headers: await getAuthHeaders(),
    body: JSON.stringify({ pseudo: pseudo.trim() }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      error?: string;
      code?: string;
    } | null;

    throw new AccountRepositoryError({
      code: body?.code ?? ACCOUNT_REPOSITORY_ERROR_CODE.CREATE_PSEUDO_FAILED,
      message: body?.error ?? "Impossible d'enregistrer ce pseudo.",
      status: response.status,
    });
  }

  return parseProfile(response);
};
