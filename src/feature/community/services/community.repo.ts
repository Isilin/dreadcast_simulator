import type { Effect } from 'effect';

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
import type { ApiCallOptions, ApiClient } from '@/utils/api-client';

// Effect is loaded with the first call (see src/utils/api-client.ts).
const loadApi = () => import('@/utils/api-client');
const loadSnapshot = () => import('./community.snapshot');

type Request = NonNullable<ApiCallOptions['request']>;

interface CallOptions {
  signal?: AbortSignal;
  fallbackMessage: string;
  /** Sends the request without a session instead of failing. */
  allowGuest?: boolean;
  /** Part of the request built from user input (validated by the client). */
  request?: Omit<Request, 'group'>;
}

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
const call = async <A, E>(
  run: (client: ApiClient) => Effect.Effect<A, E>,
  { signal, fallbackMessage, allowGuest, request }: CallOptions,
): Promise<A> => {
  const accessToken = allowGuest
    ? await getOptionalAccessToken()
    : await getAccessToken();
  const { callApi } = await loadApi();

  return callApi(run, {
    signal,
    accessToken,
    ErrorClass: CommunityRepositoryError,
    failed: {
      code: COMMUNITY_REPOSITORY_ERROR_CODE.REQUEST_FAILED,
      message: fallbackMessage,
    },
    invalid: {
      code: COMMUNITY_REPOSITORY_ERROR_CODE.INVALID_PAYLOAD,
      message: 'La réponse de la Communauté est invalide.',
    },
    apiMessage: true,
    request: request && { group: 'community', ...request },
  });
};

const byId = (id: string) => ({ params: { id } });

export const fetchCommunityMeta = async (
  signal?: AbortSignal,
): Promise<CommunityMeta> =>
  toMetaDomain(
    await call((client: ApiClient) => client.community.meta(), {
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
      client.community.search({ query: filtersToSearchQuery(filters) }),
    {
      signal,
      fallbackMessage: 'Impossible de récupérer les builds de la Communauté.',
      request: { endpoint: 'search', part: 'Query' },
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
  const { withDecodedSnapshot } = await loadSnapshot();

  const detail = await call(
    (client: ApiClient) =>
      withDecodedSnapshot(client.community.detail(byId(id))),
    {
      signal,
      allowGuest: true,
      fallbackMessage: 'Impossible de récupérer ce build.',
      request: { endpoint: 'detail', part: 'Params' },
    },
  );

  return toDetailDomain(detail);
};

export const fetchMyPublications = async (
  signal?: AbortSignal,
): Promise<MyPublication[]> => {
  const publications = await call(
    (client: ApiClient) => client.community.mine(),
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
      client.community.publish({
        payload: {
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
      request: { endpoint: 'publish', part: 'Payload' },
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
      client.community.update({
        ...byId(id),
        payload: {
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
      request: { endpoint: 'update', part: 'Payload' },
    },
  );
};

export const unpublishCommunityBuild = async (id: string): Promise<void> => {
  await call((client: ApiClient) => client.community.unpublish(byId(id)), {
    fallbackMessage: 'Impossible de dépublier ce build.',
    request: { endpoint: 'unpublish', part: 'Params' },
  });
};

export const copyCommunityBuild = async (id: string): Promise<number> => {
  const { slot } = await call(
    (client: ApiClient) => client.community.copy(byId(id)),
    {
      fallbackMessage: 'Impossible de copier ce build.',
      request: { endpoint: 'copy', part: 'Params' },
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
      client.community.reviews({ ...byId(id), query: { page: String(page) } }),
    {
      signal,
      fallbackMessage: 'Impossible de récupérer les avis.',
      request: { endpoint: 'reviews', part: 'Params' },
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
        client.community.saveReview({ ...byId(id), payload: review }),
      {
        fallbackMessage: "Impossible d'enregistrer votre avis.",
        request: { endpoint: 'saveReview', part: 'Payload' },
      },
    ),
  );

export const deleteCommunityReview = async (id: string): Promise<void> => {
  await call((client: ApiClient) => client.community.deleteReview(byId(id)), {
    fallbackMessage: 'Impossible de supprimer votre avis.',
    request: { endpoint: 'deleteReview', part: 'Params' },
  });
};

export const setCommunityFavorite = async (
  id: string,
  isFavorite: boolean,
): Promise<boolean> => {
  const result = await call(
    (client: ApiClient) =>
      isFavorite
        ? client.community.addFavorite(byId(id))
        : client.community.removeFavorite(byId(id)),
    {
      fallbackMessage: 'Impossible de mettre à jour vos favoris.',
      request: {
        endpoint: isFavorite ? 'addFavorite' : 'removeFavorite',
        part: 'Params',
      },
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
      (client: ApiClient) => client.community.similar({ payload: { stats } }),
      {
        signal,
        fallbackMessage: 'Impossible de trouver des builds proches.',
        request: { endpoint: 'similar', part: 'Payload' },
      },
    ),
  );

export const fetchForYou = async (
  signal?: AbortSignal,
): Promise<CommunityRecommendations> =>
  toRecommendationsDomain(
    await call((client: ApiClient) => client.community.forYou(), {
      signal,
      fallbackMessage: 'Impossible de récupérer vos recommandations.',
    }),
  );
