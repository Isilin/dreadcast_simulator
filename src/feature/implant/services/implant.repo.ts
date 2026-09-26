import {
  IMPLANT_REPOSITORY_ERROR_CODE,
  ImplantRepositoryError,
} from './implant.errors';
import { toDomain } from './implant.mapper';
import type { Implant } from '../model/implant.types';

import { GET } from '@/utils/http';
import { validatePayload } from '@/utils/validation';

export const fetchImplants = async (
  signal?: AbortSignal,
): Promise<Implant[]> => {
  const response = await GET('/api/implants', signal);

  if (!response.ok) {
    throw new ImplantRepositoryError({
      code: IMPLANT_REPOSITORY_ERROR_CODE.FETCH_IMPLANTS_FAILED,
      message: 'Impossible de recuperer la liste des implants.',
      status: response.status,
    });
  }

  const payload: unknown = await response.json();
  const { implantArrayResponseSchema } = await import('./implant.schema');
  const implants = validatePayload({
    schema: implantArrayResponseSchema,
    payload,
    errorCode: IMPLANT_REPOSITORY_ERROR_CODE.INVALID_IMPLANTS_PAYLOAD,
    errorMessage: 'Le format des implants recus est invalide.',
  });

  return implants.map(toDomain);
};
