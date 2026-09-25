import type { ZodSchema } from 'zod';

import {
  COMMUNITY_REPOSITORY_ERROR_CODE,
  CommunityRepositoryError,
} from './community.errors';
import {
  toDetailDomain,
  toMetaDomain,
  toMyPublicationDomain,
  toRecommendationsDomain,
  toReviewDomain,
  toSummaryDomain,
} from './community.mapper';
import {
  filtersToApiQuery,
  type CommunityBuildDetailData,
  type CommunityFilters,
  type CommunityMeta,
  type CommunityRecommendations,
  type CommunityReview,
  type CommunityReviewsPage,
  type CommunitySearchResult,
  type MyPublication,
  type PublishBuildPayload,
  type ReviewPayload,
  type UpdatePublicationPayload,
} from '../model';

import type { Stat } from '@/domain';
import {
  getAuthHeaders as getSessionHeaders,
  getOptionalAuthHeaders,
} from '@/feature/auth';
import { GET } from '@/utils/http';
import { validatePayload } from '@/utils/validation';

const BUILDS_URL = '/api/community/builds';

const loadSchemas = () => import('./community.schema');

const getAuthHeaders = (): Promise<HeadersInit> =>
  getSessionHeaders(
    () =>
      new CommunityRepositoryError({
        code: COMMUNITY_REPOSITORY_ERROR_CODE.MISSING_AUTH_SESSION,
        message: 'Connectez-vous pour accéder à la Communauté.',
        status: 401,
      }),
  );

const throwResponseError = async (
  response: Response,
  fallbackMessage: string,
): Promise<never> => {
  const body = (await response.json().catch(() => null)) as {
    error?: string;
    code?: string;
  } | null;

  throw new CommunityRepositoryError({
    code: body?.code ?? COMMUNITY_REPOSITORY_ERROR_CODE.REQUEST_FAILED,
    message: body?.error ?? fallbackMessage,
    status: response.status,
  });
};

interface CallOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
  fallbackMessage: string;
  /** Sends the request without a session instead of failing. */
  allowGuest?: boolean;
}

const callApi = async (
  url: string,
  { method = 'GET', body, signal, fallbackMessage, allowGuest }: CallOptions,
): Promise<unknown> => {
  const response = await fetch(url, {
    method,
    headers: allowGuest
      ? await getOptionalAuthHeaders()
      : await getAuthHeaders(),
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    return throwResponseError(response, fallbackMessage);
  }

  return response.json();
};

const parse = <T>(schema: ZodSchema<T>, payload: unknown): T =>
  validatePayload({
    schema,
    payload,
    errorCode: COMMUNITY_REPOSITORY_ERROR_CODE.INVALID_PAYLOAD,
    errorMessage: 'La réponse de la Communauté est invalide.',
  });

const buildUrl = (id: string, action?: string) =>
  `${BUILDS_URL}/${encodeURIComponent(id)}${action ? `/${action}` : ''}`;

export const fetchCommunityMeta = async (
  signal?: AbortSignal,
): Promise<CommunityMeta> => {
  const response = await GET('/api/community/meta', signal);
  if (!response.ok) {
    return throwResponseError(
      response,
      'Impossible de récupérer les versions du jeu.',
    );
  }

  const { communityMetaResponseDtoSchema } = await loadSchemas();
  return toMetaDomain(
    parse(communityMetaResponseDtoSchema, await response.json()),
  );
};

export const searchCommunityBuilds = async (
  filters: CommunityFilters,
  signal?: AbortSignal,
): Promise<CommunitySearchResult> => {
  const payload = await callApi(`${BUILDS_URL}?${filtersToApiQuery(filters)}`, {
    signal,
    fallbackMessage: 'Impossible de récupérer les builds de la Communauté.',
  });

  const { communitySearchResponseDtoSchema } = await loadSchemas();
  const result = parse(communitySearchResponseDtoSchema, payload);

  return {
    items: result.items.map(toSummaryDomain),
    total: result.total,
    page: result.page,
    pageSize: result.page_size,
  };
};

export const fetchCommunityBuild = async (
  id: string,
  signal?: AbortSignal,
): Promise<CommunityBuildDetailData> => {
  const payload = await callApi(buildUrl(id), {
    signal,
    fallbackMessage: 'Impossible de récupérer ce build.',
    allowGuest: true,
  });

  const { communityBuildDetailDtoSchema } = await loadSchemas();
  return toDetailDomain(parse(communityBuildDetailDtoSchema, payload));
};

export const fetchMyPublications = async (
  signal?: AbortSignal,
): Promise<MyPublication[]> => {
  const payload = await callApi('/api/community/me', {
    signal,
    fallbackMessage: 'Impossible de récupérer vos publications.',
  });

  const { myPublicationsResponseDtoSchema } = await loadSchemas();
  return parse(myPublicationsResponseDtoSchema, payload).map(
    toMyPublicationDomain,
  );
};

export const publishCommunityBuild = async (
  payload: PublishBuildPayload,
): Promise<string> => {
  const response = await callApi(BUILDS_URL, {
    method: 'POST',
    body: {
      slot: Number(payload.slot),
      title: payload.title,
      description: payload.description,
      specialization: payload.specialization,
      detected_specialization: payload.detectedSpecialization,
      stats: payload.stats,
    },
    fallbackMessage: 'Impossible de publier ce build.',
  });

  const { publishResponseDtoSchema } = await loadSchemas();
  return parse(publishResponseDtoSchema, response).id;
};

export const updateCommunityPublication = async (
  id: string,
  payload: UpdatePublicationPayload,
): Promise<void> => {
  await callApi(buildUrl(id), {
    method: 'PUT',
    body: {
      title: payload.title,
      description: payload.description,
      specialization: payload.specialization,
      refresh: payload.refresh,
      detected_specialization: payload.detectedSpecialization,
      stats: payload.stats,
    },
    fallbackMessage: 'Impossible de mettre à jour la publication.',
  });
};

export const unpublishCommunityBuild = async (id: string): Promise<void> => {
  await callApi(buildUrl(id), {
    method: 'DELETE',
    fallbackMessage: 'Impossible de dépublier ce build.',
  });
};

export const copyCommunityBuild = async (id: string): Promise<number> => {
  const response = await callApi(buildUrl(id, 'copy'), {
    method: 'POST',
    fallbackMessage: 'Impossible de copier ce build.',
  });

  const { copyResponseDtoSchema } = await loadSchemas();
  return parse(copyResponseDtoSchema, response).slot;
};

export const fetchCommunityReviews = async (
  id: string,
  page: number,
  signal?: AbortSignal,
): Promise<CommunityReviewsPage> => {
  const payload = await callApi(`${buildUrl(id, 'reviews')}?page=${page}`, {
    signal,
    fallbackMessage: 'Impossible de récupérer les avis.',
  });

  const { communityReviewsResponseDtoSchema } = await loadSchemas();
  const result = parse(communityReviewsResponseDtoSchema, payload);

  return {
    items: result.items.map(toReviewDomain),
    total: result.total,
    page: result.page,
    pageSize: result.page_size,
  };
};

export const saveCommunityReview = async (
  id: string,
  review: ReviewPayload,
): Promise<CommunityReview> => {
  const payload = await callApi(buildUrl(id, 'review'), {
    method: 'PUT',
    body: review,
    fallbackMessage: "Impossible d'enregistrer votre avis.",
  });

  const { communityReviewDtoSchema } = await loadSchemas();
  return toReviewDomain(parse(communityReviewDtoSchema, payload));
};

export const deleteCommunityReview = async (id: string): Promise<void> => {
  await callApi(buildUrl(id, 'review'), {
    method: 'DELETE',
    fallbackMessage: 'Impossible de supprimer votre avis.',
  });
};

export const setCommunityFavorite = async (
  id: string,
  isFavorite: boolean,
): Promise<boolean> => {
  const payload = await callApi(buildUrl(id, 'favorite'), {
    method: isFavorite ? 'PUT' : 'DELETE',
    fallbackMessage: 'Impossible de mettre à jour vos favoris.',
  });

  const { favoriteResponseDtoSchema } = await loadSchemas();
  return parse(favoriteResponseDtoSchema, payload).is_favorite;
};

export const fetchSimilarBuilds = async (
  stats: Record<Stat, number>,
  signal?: AbortSignal,
): Promise<CommunityRecommendations> => {
  const payload = await callApi('/api/community/similar', {
    method: 'POST',
    body: { stats },
    signal,
    fallbackMessage: 'Impossible de trouver des builds proches.',
  });

  const { communityRecommendationsResponseDtoSchema } = await loadSchemas();
  return toRecommendationsDomain(
    parse(communityRecommendationsResponseDtoSchema, payload),
  );
};

export const fetchForYou = async (
  signal?: AbortSignal,
): Promise<CommunityRecommendations> => {
  const payload = await callApi('/api/community/for-you', {
    signal,
    fallbackMessage: 'Impossible de récupérer vos recommandations.',
  });

  const { communityRecommendationsResponseDtoSchema } = await loadSchemas();
  return toRecommendationsDomain(
    parse(communityRecommendationsResponseDtoSchema, payload),
  );
};
