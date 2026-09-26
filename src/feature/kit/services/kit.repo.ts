import { KIT_REPOSITORY_ERROR_CODE, KitRepositoryError } from './kit.errors';
import { toDomain } from './kit.mapper';
import type { Kit } from '../model';

import { GET } from '@/utils/http';
import { validatePayload } from '@/utils/validation';

export const fetchKits = async (signal?: AbortSignal): Promise<Kit[]> => {
  const response = await GET('/api/kits', signal);

  if (!response.ok) {
    throw new KitRepositoryError({
      code: KIT_REPOSITORY_ERROR_CODE.FETCH_KITS_FAILED,
      message: 'Impossible de recuperer la liste des kits.',
      status: response.status,
    });
  }

  const payload: unknown = await response.json();
  const { kitArrayResponseSchema } = await import('./kit.schema');
  const kits = validatePayload({
    schema: kitArrayResponseSchema,
    payload,
    errorCode: KIT_REPOSITORY_ERROR_CODE.INVALID_KITS_PAYLOAD,
    errorMessage: 'Le format des kits recus est invalide.',
  });

  return kits.map(toDomain);
};
