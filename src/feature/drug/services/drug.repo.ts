import { DRUG_REPOSITORY_ERROR_CODE, DrugRepositoryError } from './drug.errors';
import { toDomain } from './drug.mapper';
import { drugArrayResponseSchema, drugResponseDtoSchema } from './drug.schema';
import type { Drug } from '../model/drug.types';

import { GET } from '@/utils/http';
import { validatePayload } from '@/utils/validation';

export const fetchDrugs = async (
  query?: string,
  signal?: AbortSignal,
): Promise<Drug[]> => {
  const url = query
    ? `/api/drugs?query=${encodeURIComponent(query)}`
    : '/api/drugs';
  const response = await GET(url, signal);

  if (!response.ok) {
    throw new DrugRepositoryError({
      code: DRUG_REPOSITORY_ERROR_CODE.FETCH_DRUGS_FAILED,
      message: 'Impossible de recuperer la liste des drogues.',
      status: response.status,
    });
  }

  const payload: unknown = await response.json();
  const drugs = validatePayload({
    schema: drugArrayResponseSchema,
    payload,
    errorCode: DRUG_REPOSITORY_ERROR_CODE.INVALID_DRUGS_PAYLOAD,
    errorMessage: 'Le format des drogues recues est invalide.',
  });

  return drugs.map(toDomain);
};

export const fetchDrugById = async (
  id: string,
  signal?: AbortSignal,
): Promise<Drug> => {
  const response = await GET(`/api/drugs?id=${encodeURIComponent(id)}`, signal);

  if (!response.ok) {
    throw new DrugRepositoryError({
      code: DRUG_REPOSITORY_ERROR_CODE.FETCH_DRUG_FAILED,
      message: `Impossible de recuperer la drogue ${id}.`,
      status: response.status,
    });
  }

  const payload: unknown = await response.json();
  const drug = validatePayload({
    schema: drugResponseDtoSchema,
    payload,
    errorCode: DRUG_REPOSITORY_ERROR_CODE.INVALID_DRUG_PAYLOAD,
    errorMessage: `Le format de la drogue ${id} est invalide.`,
  });

  return toDomain(drug);
};
