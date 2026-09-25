import {
  TITLE_REPOSITORY_ERROR_CODE,
  TitleRepositoryError,
} from './title.errors';
import { toDomain } from './title.mapper';
import type { Title } from '../model/title.types';

import { GET } from '@/utils/http';
import { validatePayload } from '@/utils/validation';

export const fetchTitles = async (signal?: AbortSignal): Promise<Title[]> => {
  const response = await GET('/api/titles', signal);

  if (!response.ok) {
    throw new TitleRepositoryError({
      code: TITLE_REPOSITORY_ERROR_CODE.FETCH_TITLES_FAILED,
      message: 'Impossible de recuperer la liste des titres.',
      status: response.status,
    });
  }

  const payload: unknown = await response.json();
  const { titleArrayResponseSchema } = await import('./title.schema');
  const titles = validatePayload({
    schema: titleArrayResponseSchema,
    payload,
    errorCode: TITLE_REPOSITORY_ERROR_CODE.INVALID_TITLES_PAYLOAD,
    errorMessage: 'Le format des titres recus est invalide.',
  });

  return titles.map(toDomain);
};
