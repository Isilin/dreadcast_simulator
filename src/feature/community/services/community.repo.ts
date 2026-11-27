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
import { decodeDetailSnapshot } from './community.snapshot';
import {
  filtersToSearchQuery,
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
  getAccessToken as getSessionToken,
  getOptionalAccessToken,
} from '@/feature/auth';
import { callApi, type ApiClient, type SuccessBody } from '@/utils/api-client';

interface CallOptions {
  signal?: AbortSignal;
  fallbackMessage: string;
  /** Sends the request without a session instead of failing. */
  allowGuest?: boolean;
}

const INVALID_RESPONSE = {
  code: COMMUNITY_REPOSITORY_ERROR_CODE.INVALID_PAYLOAD,
  message: 'La réponse de la Communauté est invalide.',
};

const getAccessToken = (): Promise<string> =>
  getSessionToken(
    () =>
      new CommunityRepositoryError({
        code: COMMUNITY_REPOSITORY_ERROR_CODE.MISSING_AUTH_SESSION,
        message: 'Connectez-vous pour accéder à la Communauté.',
        status: 401,
      }),
  );

/** One Community call: API errors keep their `{ error, code }`. */
const call = async <
  R extends Awaited<ReturnType<Parameters<typeof callApi>[0]>>,
>(
  run: (client: ApiClient) => Promise<R>,
  { signal, fallbackMessage, allowGuest }: CallOptions,
): Promise<SuccessBody<R>> => {
  const accessToken = allowGuest
    ? await getOptionalAccessToken()
    : await getAccessToken();

  return callApi(run, {
    signal,
    accessToken,
    ErrorClass: CommunityRepositoryError,
    failed: {
      code: COMMUNITY_REPOSITORY_ERROR_CODE.REQUEST_FAILED,
      message: fallbackMessage,
    },
    invalid: INVALID_RESPONSE,
    apiMessage: true,
  });
};

const byId = (id: string) => ({ param: { id } });

export const fetchCommunityMeta = async (
  signal?: AbortSignal,
): Promise<CommunityMeta> =>
  toMetaDomain(
    await call((client: ApiClient) => client.api.community.meta.$get(), {
      signal,
      allowGuest: true,
      fallbackMessage: 'Impossible de récupérer les versions du jeu.',
    }),
  );

export const searchCommunityBuilds = async (
  filters: CommunityFilters,
  signal?: AbortSignal,
): Promise<CommunitySearchResult> => {
  const result = await call(
    (client: ApiClient) =>
      client.api.community.builds.$get({
        query: filtersToSearchQuery(filters),
      }),
    {
      signal,
      fallbackMessage: 'Impossible de récupérer les builds de la Communauté.',
    },
  );

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
  const dto = await call(
    (client: ApiClient) => client.api.community.builds[':id'].$get(byId(id)),
    {
      signal,
      allowGuest: true,
      fallbackMessage: 'Impossible de récupérer ce build.',
    },
  );

  const detail = decodeDetailSnapshot(dto);
  if (!detail) {
    throw new CommunityRepositoryError({ ...INVALID_RESPONSE });
  }
  return toDetailDomain(detail);
};

export const fetchMyPublications = async (
  signal?: AbortSignal,
): Promise<MyPublication[]> => {
  const publications = await call(
    (client: ApiClient) => client.api.community.me.$get(),
    {
      signal,
      fallbackMessage: 'Impossible de récupérer vos publications.',
    },
  );

  return publications.map(toMyPublicationDomain);
};

export const publishCommunityBuild = async (
  payload: PublishBuildPayload,
): Promise<string> => {
  const { id } = await call(
    (client: ApiClient) =>
      client.api.community.builds.$post({
        json: {
          slot: Number(payload.slot),
          title: payload.title,
          description: payload.description,
          specialization: payload.specialization,
          detected_specialization: payload.detectedSpecialization,
          stats: payload.stats,
        },
      }),
    {
      fallbackMessage: 'Impossible de publier ce build.',
    },
  );

  return id;
};

export const updateCommunityPublication = async (
  id: string,
  payload: UpdatePublicationPayload,
): Promise<void> => {
  await call(
    (client: ApiClient) =>
      client.api.community.builds[':id'].$put({
        ...byId(id),
        json: {
          title: payload.title,
          description: payload.description,
          specialization: payload.specialization,
          refresh: payload.refresh,
          detected_specialization: payload.detectedSpecialization,
          stats: payload.stats,
        },
      }),
    {
      fallbackMessage: 'Impossible de mettre à jour la publication.',
    },
  );
};

export const unpublishCommunityBuild = async (id: string): Promise<void> => {
  await call(
    (client: ApiClient) => client.api.community.builds[':id'].$delete(byId(id)),
    {
      fallbackMessage: 'Impossible de dépublier ce build.',
    },
  );
};

export const copyCommunityBuild = async (id: string): Promise<number> => {
  const { slot } = await call(
    (client: ApiClient) =>
      client.api.community.builds[':id'].copy.$post(byId(id)),
    {
      fallbackMessage: 'Impossible de copier ce build.',
    },
  );

  return slot;
};

export const fetchCommunityReviews = async (
  id: string,
  page: number,
  signal?: AbortSignal,
): Promise<CommunityReviewsPage> => {
  const result = await call(
    (client: ApiClient) =>
      client.api.community.builds[':id'].reviews.$get({
        ...byId(id),
        query: { page: String(page) },
      }),
    {
      signal,
      fallbackMessage: 'Impossible de récupérer les avis.',
    },
  );

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
): Promise<CommunityReview> =>
  toReviewDomain(
    await call(
      (client: ApiClient) =>
        client.api.community.builds[':id'].review.$put({
          ...byId(id),
          json: review,
        }),
      {
        fallbackMessage: "Impossible d'enregistrer votre avis.",
      },
    ),
  );

export const deleteCommunityReview = async (id: string): Promise<void> => {
  await call(
    (client: ApiClient) =>
      client.api.community.builds[':id'].review.$delete(byId(id)),
    {
      fallbackMessage: 'Impossible de supprimer votre avis.',
    },
  );
};

export const setCommunityFavorite = async (
  id: string,
  isFavorite: boolean,
): Promise<boolean> => {
  const result = await call(
    (client: ApiClient) =>
      isFavorite
        ? client.api.community.builds[':id'].favorite.$put(byId(id))
        : client.api.community.builds[':id'].favorite.$delete(byId(id)),
    {
      fallbackMessage: 'Impossible de mettre à jour vos favoris.',
    },
  );

  return result.is_favorite;
};

export const fetchSimilarBuilds = async (
  stats: Record<Stat, number>,
  signal?: AbortSignal,
): Promise<CommunityRecommendations> =>
  toRecommendationsDomain(
    await call(
      (client: ApiClient) =>
        client.api.community.similar.$post({ json: { stats } }),
      {
        signal,
        fallbackMessage: 'Impossible de trouver des builds proches.',
      },
    ),
  );

export const fetchForYou = async (
  signal?: AbortSignal,
): Promise<CommunityRecommendations> =>
  toRecommendationsDomain(
    await call((client: ApiClient) => client.api.community['for-you'].$get(), {
      signal,
      fallbackMessage: 'Impossible de récupérer vos recommandations.',
    }),
  );
