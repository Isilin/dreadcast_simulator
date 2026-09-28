import {
  IMPLANT_REPOSITORY_ERROR_CODE,
  ImplantRepositoryError,
} from './implant.errors';
import { toDomain } from './implant.mapper';
import type { Implant } from '../model/implant.types';

export const fetchImplants = async (
  signal?: AbortSignal,
): Promise<Implant[]> => {
  const { callApi } = await import('@/utils/api-client');
  const implants = await callApi((client) => client.catalog.implants(), {
    signal,
    ErrorClass: ImplantRepositoryError,
    failed: {
      code: IMPLANT_REPOSITORY_ERROR_CODE.FETCH_IMPLANTS_FAILED,
      message: 'Impossible de recuperer la liste des implants.',
    },
    invalid: {
      code: IMPLANT_REPOSITORY_ERROR_CODE.INVALID_IMPLANTS_PAYLOAD,
      message: 'Le format des implants recus est invalide.',
    },
  });

  return implants.map(toDomain);
};
