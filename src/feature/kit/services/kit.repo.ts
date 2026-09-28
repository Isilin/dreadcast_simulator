import { KIT_REPOSITORY_ERROR_CODE, KitRepositoryError } from './kit.errors';
import { toDomain } from './kit.mapper';
import type { Kit } from '../model';

export const fetchKits = async (signal?: AbortSignal): Promise<Kit[]> => {
  const { callApi } = await import('@/utils/api-client');
  const kits = await callApi((client) => client.catalog.kits(), {
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
