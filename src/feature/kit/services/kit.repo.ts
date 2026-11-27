import { KIT_REPOSITORY_ERROR_CODE, KitRepositoryError } from './kit.errors';
import { toDomain } from './kit.mapper';
import type { Kit } from '../model';

import { callApi } from '@/utils/api-client';

export const fetchKits = async (signal?: AbortSignal): Promise<Kit[]> => {
  const kits = await callApi((client) => client.api.kits.$get(), {
    signal,
    ErrorClass: KitRepositoryError,
    failed: {
      code: KIT_REPOSITORY_ERROR_CODE.FETCH_KITS_FAILED,
      message: 'Impossible de recuperer la liste des kits.',
    },
    invalid: {
      code: KIT_REPOSITORY_ERROR_CODE.INVALID_KITS_PAYLOAD,
      message: 'Le format des kits recus est invalide.',
    },
  });

  return kits.map(toDomain);
};
