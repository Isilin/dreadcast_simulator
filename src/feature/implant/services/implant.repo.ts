import {
  IMPLANT_REPOSITORY_ERROR_CODE,
  ImplantRepositoryError,
} from './implant.errors';
import { toDomain } from './implant.mapper';
import {
  implantArrayResponseSchema,
  implantResponseDtoSchema,
} from './implant.schema';
import type { Implant } from '../model/implant.types';

import { GET } from '@/utils/http';
import { validatePayload } from '@/utils/validation';

export const fetchImplants = async (
  query?: string,
  signal?: AbortSignal,
): Promise<Implant[]> => {
  const url = query
    ? `/api/implants?query=${encodeURIComponent(query)}`
    : '/api/implants';
  const response = await GET(url, signal);

  if (!response.ok) {
    throw new ImplantRepositoryError({
      code: IMPLANT_REPOSITORY_ERROR_CODE.FETCH_IMPLANTS_FAILED,
      message: 'Impossible de recuperer la liste des implants.',
      status: response.status,
    });
  }

  const payload: unknown = await response.json();
  const implants = validatePayload({
    schema: implantArrayResponseSchema,
    payload,
    errorCode: IMPLANT_REPOSITORY_ERROR_CODE.INVALID_IMPLANTS_PAYLOAD,
    errorMessage: 'Le format des implants recus est invalide.',
  });

  return implants.map(toDomain);
};

export const fetchImplantByName = async (
  name: string,
  signal?: AbortSignal,
): Promise<Implant> => {
  const response = await GET(
    `/api/implants/${encodeURIComponent(name)}`,
    signal,
  );

  if (!response.ok) {
    throw new ImplantRepositoryError({
      code: IMPLANT_REPOSITORY_ERROR_CODE.FETCH_IMPLANT_FAILED,
      message: `Impossible de recuperer l'implant ${name}.`,
      status: response.status,
    });
  }

  const payload: unknown = await response.json();
  const implant = validatePayload({
    schema: implantResponseDtoSchema,
    payload,
    errorCode: IMPLANT_REPOSITORY_ERROR_CODE.INVALID_IMPLANT_PAYLOAD,
    errorMessage: `Le format de l'implant ${name} est invalide.`,
  });

  return toDomain(implant);
};
