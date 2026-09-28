import {
  ACCOUNT_REPOSITORY_ERROR_CODE,
  AccountRepositoryError,
} from './account.errors';
import type { AccountProfile } from '../model';

import { getAccessToken as getSessionToken } from '@/feature/auth';

const loadApi = () => import('@/utils/api-client');

const getAccessToken = (): Promise<string> =>
  getSessionToken(
    () =>
      new AccountRepositoryError({
        code: ACCOUNT_REPOSITORY_ERROR_CODE.MISSING_AUTH_SESSION,
        message: 'Session utilisateur manquante.',
        status: 401,
      }),
  );

const invalidProfile = {
  code: ACCOUNT_REPOSITORY_ERROR_CODE.INVALID_PROFILE_PAYLOAD,
  message: 'Le format du profil recu est invalide.',
};

export const fetchAccountProfile = async (
  signal?: AbortSignal,
): Promise<AccountProfile> => {
  const accessToken = await getAccessToken();
  const { callApi } = await loadApi();
  const profile = await callApi((client) => client.profile.me(), {
    signal,
    accessToken,
    ErrorClass: AccountRepositoryError,
    failed: {
      code: ACCOUNT_REPOSITORY_ERROR_CODE.FETCH_PROFILE_FAILED,
      message: 'Impossible de recuperer le profil.',
    },
    invalid: invalidProfile,
  });

  return { pseudo: profile.pseudo };
};

export const createPseudo = async (pseudo: string): Promise<AccountProfile> => {
  const accessToken = await getAccessToken();
  const { callApi } = await loadApi();
  const profile = await callApi(
    (client) =>
      client.profile.setPseudo({ payload: { pseudo: pseudo.trim() } }),
    {
      accessToken,
      ErrorClass: AccountRepositoryError,
      failed: {
        code: ACCOUNT_REPOSITORY_ERROR_CODE.CREATE_PSEUDO_FAILED,
        message: "Impossible d'enregistrer ce pseudo.",
      },
      invalid: invalidProfile,
      apiMessage: true,
      request: { group: 'profile', endpoint: 'setPseudo', part: 'Payload' },
    },
  );

  return { pseudo: profile.pseudo };
};
