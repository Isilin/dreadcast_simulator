import { KIT_REPOSITORY_ERROR_CODE, KitRepositoryError } from './kit.errors';
import { toDomain } from './kit.mapper';
import { kitArrayResponseSchema, kitResponseDtoSchema } from './kit.schema';
import type { Kit } from '../model';

import { GET } from '@/utils/http';
import { validatePayload } from '@/utils/validation';

export const fetchKits = async (
  type?: Kit['type'] | Array<Kit['type']>,
  signal?: AbortSignal,
): Promise<Kit[]> => {
  const params = new URLSearchParams();
  if (type) {
    const types = Array.isArray(type) ? type : [type];
    if (types.length > 0) {
      params.set('type', types.join(','));
    }
  }

  const url = `/api/kits${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await GET(url, signal);

  if (!response.ok) {
    throw new KitRepositoryError({
      code: KIT_REPOSITORY_ERROR_CODE.FETCH_KITS_FAILED,
      message: 'Impossible de recuperer la liste des kits.',
      status: response.status,
    });
  }

  const payload: unknown = await response.json();
  const kits = validatePayload({
    schema: kitArrayResponseSchema,
    payload,
    errorCode: KIT_REPOSITORY_ERROR_CODE.INVALID_KITS_PAYLOAD,
    errorMessage: 'Le format des kits recus est invalide.',
  });

  return kits.map(toDomain);
};

export const fetchKitById = async (
  id: string,
  signal?: AbortSignal,
): Promise<Kit> => {
  const response = await GET(`/api/kits/${encodeURIComponent(id)}`, signal);

  if (!response.ok) {
    throw new KitRepositoryError({
      code: KIT_REPOSITORY_ERROR_CODE.FETCH_KIT_FAILED,
      message: `Impossible de recuperer le kit ${id}.`,
      status: response.status,
    });
  }

  const payload: unknown = await response.json();
  const kit = validatePayload({
    schema: kitResponseDtoSchema,
    payload,
    errorCode: KIT_REPOSITORY_ERROR_CODE.INVALID_KIT_PAYLOAD,
    errorMessage: `Le format du kit ${id} est invalide.`,
  });

  return toDomain(kit);
};
