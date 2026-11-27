import {
  TITLE_REPOSITORY_ERROR_CODE,
  TitleRepositoryError,
} from './title.errors';
import { toDomain } from './title.mapper';
import type { Title } from '../model/title.types';

import { callApi } from '@/utils/api-client';

export const fetchTitles = async (signal?: AbortSignal): Promise<Title[]> => {
  const titles = await callApi((client) => client.api.titles.$get(), {
    signal,
    ErrorClass: TitleRepositoryError,
    failed: {
      code: TITLE_REPOSITORY_ERROR_CODE.FETCH_TITLES_FAILED,
      message: 'Impossible de recuperer la liste des titres.',
    },
    invalid: {
      code: TITLE_REPOSITORY_ERROR_CODE.INVALID_TITLES_PAYLOAD,
      message: 'Le format des titres recus est invalide.',
    },
  });

  return titles.map(toDomain);
};
