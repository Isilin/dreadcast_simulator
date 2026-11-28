import {
  ACCOUNT_REPOSITORY_ERROR_CODE,
  AccountRepositoryError,
} from './account.errors';
import type { AccountProfile } from '../model';

import { requireSession } from '@/feature/auth';
import { callApi } from '@/utils/api-client';

const ensureSession = (): Promise<void> =>
  requireSession(
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
  await ensureSession();
  const profile = await callApi((client) => client.api.profile.me.$get(), {
    signal,
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
  await ensureSession();
  const profile = await callApi(
    (client) => client.api.profile.me.$put({ json: { pseudo: pseudo.trim() } }),
    {
      ErrorClass: AccountRepositoryError,
      failed: {
        code: ACCOUNT_REPOSITORY_ERROR_CODE.CREATE_PSEUDO_FAILED,
        message: "Impossible d'enregistrer ce pseudo.",
      },
      invalid: invalidProfile,
      apiMessage: true,
    },
  );

  return { pseudo: profile.pseudo };
};
