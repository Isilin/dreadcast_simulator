import type { Drug as DrugDto } from '@server/feature/catalog/catalog.schema';

import { DRUG_REPOSITORY_ERROR_CODE, DrugRepositoryError } from './drug.errors';
import { toDomain } from './drug.mapper';
import type { Drug } from '../model/drug.types';

import { callApi } from '@/utils/api-client';

export const fetchDrugs = async (signal?: AbortSignal): Promise<Drug[]> => {
  const drugs = await callApi(
    (client) => client.api.drugs.$get({ query: {} }),
    {
      signal,
      ErrorClass: DrugRepositoryError,
      failed: {
        code: DRUG_REPOSITORY_ERROR_CODE.FETCH_DRUGS_FAILED,
        message: 'Impossible de recuperer la liste des drogues.',
      },
      invalid: {
        code: DRUG_REPOSITORY_ERROR_CODE.INVALID_DRUGS_PAYLOAD,
        message: 'Le format des drogues recues est invalide.',
      },
    },
  );

  return (drugs as ReadonlyArray<DrugDto>).map(toDomain);
};

export const fetchDrugById = async (
  id: string,
  signal?: AbortSignal,
): Promise<Drug> => {
  const drug = await callApi(
    (client) => client.api.drugs.$get({ query: { id } }),
    {
      signal,
      ErrorClass: DrugRepositoryError,
      failed: {
        code: DRUG_REPOSITORY_ERROR_CODE.FETCH_DRUG_FAILED,
        message: `Impossible de recuperer la drogue ${id}.`,
      },
      invalid: {
        code: DRUG_REPOSITORY_ERROR_CODE.INVALID_DRUG_PAYLOAD,
        message: `Le format de la drogue ${id} est invalide.`,
      },
    },
  );

  return toDomain(drug as DrugDto);
};
