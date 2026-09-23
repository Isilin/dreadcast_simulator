import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  copyCommunityBuild,
  deleteCommunityReview,
  fetchCommunityBuild,
  fetchCommunityMeta,
  fetchCommunityReviews,
  fetchForYou,
  fetchMyPublications,
  fetchSimilarBuilds,
  publishCommunityBuild,
  saveCommunityReview,
  searchCommunityBuilds,
  setCommunityFavorite,
  unpublishCommunityBuild,
  updateCommunityPublication,
} from './community.repo';
import type {
  CommunityFilters,
  PublishBuildPayload,
  ReviewPayload,
  UpdatePublicationPayload,
} from '../model';

import type { Stat } from '@/domain';
import { useAuthState } from '@/feature/auth';

const LIST_STALE_TIME_MS = 30 * 1000;
const META_STALE_TIME_MS = 60 * 60 * 1000;

export const communityQueryKeys = {
  all: ['community'] as const,
  lists: ['community', 'list'] as const,
  list: (filters: CommunityFilters) => ['community', 'list', filters] as const,
  detail: (id: string) => ['community', 'detail', id] as const,
  reviews: (id: string) => ['community', 'reviews', id] as const,
  reviewsPage: (id: string, page: number) =>
    ['community', 'reviews', id, page] as const,
  mine: ['community', 'mine'] as const,
  meta: ['community-meta'] as const,
  similar: (stats: Record<Stat, number> | null) =>
    ['community', 'similar', stats] as const,
  forYou: ['community', 'for-you'] as const,
};

const useIsAuthenticated = () => Boolean(useAuthState().session?.user);

export const useCommunityMeta = () =>
  useQuery({
    queryKey: communityQueryKeys.meta,
    queryFn: ({ signal }) => fetchCommunityMeta(signal),
    staleTime: META_STALE_TIME_MS,
  });

export const useCommunitySearch = (
  filters: CommunityFilters,
  options?: { enabled?: boolean },
) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    queryKey: communityQueryKeys.list(filters),
    queryFn: ({ signal }) => searchCommunityBuilds(filters, signal),
    enabled: isAuthenticated && (options?.enabled ?? true),
    staleTime: LIST_STALE_TIME_MS,
    placeholderData: keepPreviousData,
  });
};

export const useCommunityBuild = (id: string) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    queryKey: communityQueryKeys.detail(id),
    queryFn: ({ signal }) => fetchCommunityBuild(id, signal),
    enabled: isAuthenticated,
    retry: false,
  });
};

export const useMyPublications = (options?: { enabled?: boolean }) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    queryKey: communityQueryKeys.mine,
    queryFn: ({ signal }) => fetchMyPublications(signal),
    enabled: isAuthenticated && (options?.enabled ?? true),
    staleTime: LIST_STALE_TIME_MS,
  });
};

export const useCommunityReviews = (
  id: string,
  page: number,
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: communityQueryKeys.reviewsPage(id, page),
    queryFn: ({ signal }) => fetchCommunityReviews(id, page, signal),
    enabled: options?.enabled ?? true,
    placeholderData: keepPreviousData,
  });

export const useSimilarBuilds = (stats: Record<Stat, number> | null) =>
  useQuery({
    queryKey: communityQueryKeys.similar(stats),
    queryFn: ({ signal }) => {
      if (!stats) {
        throw new Error('Statistiques manquantes.');
      }
      return fetchSimilarBuilds(stats, signal);
    },
    enabled: stats !== null,
    staleTime: LIST_STALE_TIME_MS,
  });

export const useForYou = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: communityQueryKeys.forYou,
    queryFn: ({ signal }) => fetchForYou(signal),
    enabled: options?.enabled ?? true,
    staleTime: LIST_STALE_TIME_MS,
  });

export const usePublishBuild = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PublishBuildPayload) =>
      publishCommunityBuild(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: communityQueryKeys.all }),
  });
};

export const useUpdatePublication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdatePublicationPayload;
    }) => updateCommunityPublication(id, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: communityQueryKeys.all }),
  });
};

export const useUnpublishBuild = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => unpublishCommunityBuild(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: communityQueryKeys.detail(id) });
      return queryClient.invalidateQueries({
        queryKey: communityQueryKeys.all,
      });
    },
  });
};

export const useCopyCommunityBuild = () =>
  useMutation({
    mutationFn: (id: string) => copyCommunityBuild(id),
  });

const invalidateAfterRating = (
  queryClient: ReturnType<typeof useQueryClient>,
  id: string,
) =>
  Promise.all([
    queryClient.invalidateQueries({
      queryKey: communityQueryKeys.detail(id),
    }),
    queryClient.invalidateQueries({
      queryKey: communityQueryKeys.reviews(id),
    }),
    queryClient.invalidateQueries({ queryKey: communityQueryKeys.lists }),
    queryClient.invalidateQueries({ queryKey: communityQueryKeys.forYou }),
  ]);

export const useSaveReview = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (review: ReviewPayload) => saveCommunityReview(id, review),
    onSuccess: () => invalidateAfterRating(queryClient, id),
  });
};

export const useDeleteReview = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteCommunityReview(id),
    onSuccess: () => invalidateAfterRating(queryClient, id),
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isFavorite }: { id: string; isFavorite: boolean }) =>
      setCommunityFavorite(id, isFavorite),
    onSuccess: (_, { id }) =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: communityQueryKeys.detail(id),
        }),
        queryClient.invalidateQueries({ queryKey: communityQueryKeys.lists }),
        queryClient.invalidateQueries({
          queryKey: communityQueryKeys.forYou,
        }),
      ]),
  });
};
