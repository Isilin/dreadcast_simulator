import { createRoute } from '@hono/zod-openapi';
import { z } from '@hono/zod-openapi';
import type { ZodError } from 'zod';

import {
  communityError,
  toCommunityError,
  type CommunityErrorCode,
} from './community.errors.js';
import type {
  CommunityPublicRepo,
  CommunityRepo,
  ReviewRepo,
} from './community.repo.js';
import {
  copyName,
  hasAdvancedFilters,
  normalizeText,
  orderBySimilarity,
  payloadErrorCode,
  roundStats,
  searchQueryToParams,
  slotsById,
  toMyPublicationDto,
  toPreviewSummaryDto,
  toReviewDto,
  toSummaryDto,
  type SimilarityRow,
} from './community.rules.js';
import {
  BuildDetail,
  CopyResponse,
  DeletedResponse,
  FavoriteResponse,
  IdResponse,
  MetaResponse,
  MyPublication,
  PublicationParams,
  PublishPayload,
  RecommendationsResponse,
  Review,
  ReviewPayload,
  ReviewsQuery,
  ReviewsResponse,
  SearchQuery,
  SearchResponse,
  SimilarPayload,
  UpdatePayload,
} from './community.schema.js';
import type { AuthMiddlewares, User } from '../../platform/auth.js';
import { noStore, publicCache } from '../../platform/cache.js';
import { isDbError, mapDbError } from '../../platform/db-error.js';
import { ALL_ERRORS, errorResponses } from '../../platform/http-errors.js';
import type { Json } from '../../platform/json.js';
import { invalidRequestAs } from '../../platform/request-validation.js';
import {
  featureRouter,
  middlewares,
  jsonBody,
  jsonContent,
} from '../../platform/router.js';
import type { BuildRepo } from '../build/build.repo.js';
import { parseSnapshot } from '../build/build.rules.js';
import type { ProfileRepo } from '../profile/profile.repo.js';
import type { SubscriptionRepo } from '../subscription/subscription.repo.js';

const REVIEWS_PAGE_SIZE = 20;
const RECOMMENDATIONS_LIMIT = 12;

export interface CommunityDeps {
  readonly communityPublic: CommunityPublicRepo;
  readonly community: (user: User) => CommunityRepo;
  readonly reviews: (user: User) => ReviewRepo;
  readonly builds: (user: User) => BuildRepo;
  readonly subscriptions: (user: User) => SubscriptionRepo;
  readonly profiles: (user: User) => ProfileRepo;
}

/**
 * Validation failure -> community error: INVALID_ID for the publication id,
 * `payloadCode` (or the failing field) for the rest.
 */
const invalidRequest = (
  payloadCode: CommunityErrorCode | ((error: ZodError) => CommunityErrorCode),
) =>
  invalidRequestAs((error, part) =>
    communityError(
      part === 'param'
        ? 'INVALID_ID'
        : typeof payloadCode === 'function'
          ? payloadCode(error)
          : payloadCode,
    ),
  );

const tags = ['community'];
const anyError = errorResponses(...ALL_ERRORS);

/**
 * Community: publications, search, reviews, favorites, recommendations.
 * Errors carry `{ error, code }` (see community.errors.ts).
 */
export const communityRoutes = (
  deps: CommunityDeps,
  { requireUser, optionalUser }: AuthMiddlewares,
) => {
  /** Signed-in route; `invalid` picks the error of a validation failure. */
  const signedIn = (
    invalid: Parameters<typeof invalidRequest>[0] = 'INVALID_PAYLOAD',
  ) => middlewares(noStore, requireUser, invalidRequest(invalid));

  // --- Rules shared by the handlers ------------------------------------------

  const isSubscriber = (user: User) => deps.subscriptions(user).hasActive();

  const requireSubscription = async (user: User) => {
    if (!(await isSubscriber(user))) {
      throw communityError('SUBSCRIPTION_REQUIRED');
    }
  };

  /** Summaries of the similar publications, in similarity order. */
  const hydrate = async (
    user: User,
    similarities: ReadonlyArray<SimilarityRow>,
  ) => {
    if (similarities.length === 0) {
      return [];
    }
    const { rows } = await mapDbError(
      deps.community(user).search({
        ids: similarities.map((row) => row.publication_id),
        gameVersion: '*',
        limit: similarities.length,
        offset: 0,
      }),
      toCommunityError,
    );
    return orderBySimilarity(similarities, rows);
  };

  const signedInDetail = async (
    user: User,
    id: string,
  ): Promise<BuildDetail> => {
    const [search, content, subscriber, myReview, pseudo] = await Promise.all([
      mapDbError(
        deps
          .community(user)
          .search({ ids: [id], gameVersion: '*', limit: 1, offset: 0 }),
        toCommunityError,
      ),
      deps.community(user).content(id),
      isSubscriber(user),
      deps.reviews(user).mine(id),
      deps.profiles(user).pseudo(),
    ]);

    const row = search.rows[0];
    if (!row) {
      throw communityError('PUBLICATION_NOT_FOUND');
    }

    return {
      summary: toSummaryDto(row),
      content: content
        ? { snapshot: parseSnapshot(content.snapshot), stats: content.stats }
        : null,
      locked: !content,
      is_subscriber: subscriber,
      my_review: myReview
        ? toReviewDto(
            myReview,
            pseudo ?? '',
            user.userId,
            row.content_updated_at,
          )
        : null,
    };
  };

  const guestDetail = async (id: string): Promise<BuildDetail> => {
    const row = await mapDbError(
      deps.communityPublic.preview(id),
      toCommunityError,
    );
    if (!row) {
      throw communityError('PUBLICATION_NOT_FOUND');
    }

    return {
      summary: toPreviewSummaryDto(row),
      content: null,
      locked: true,
      is_subscriber: false,
      my_review: null,
    };
  };

  /** Author and last content update, 404 when the publication is gone. */
  const requireHeader = async (user: User, id: string) => {
    const header = await deps.community(user).header(id);
    if (!header) {
      throw communityError('PUBLICATION_NOT_FOUND');
    }
    return header;
  };

  // --- Routes ----------------------------------------------------------------

  const searchRoute = createRoute({
    method: 'get',
    path: '/community/builds',
    tags,
    middleware: signedIn('INVALID_FILTERS'),
    request: { query: SearchQuery },
    responses: { 200: jsonContent(SearchResponse, 'Search page'), ...anyError },
  });

  const publishRoute = createRoute({
    method: 'post',
    path: '/community/builds',
    tags,
    middleware: signedIn(payloadErrorCode),
    request: { body: jsonBody(PublishPayload) },
    responses: { 201: jsonContent(IdResponse, 'Published'), ...anyError },
  });

  const mineRoute = createRoute({
    method: 'get',
    path: '/community/me',
    tags,
    middleware: signedIn(),
    responses: {
      200: jsonContent(z.array(MyPublication), 'My publications'),
      ...anyError,
    },
  });

  const similarRoute = createRoute({
    method: 'post',
    path: '/community/similar',
    tags,
    middleware: signedIn(payloadErrorCode),
    request: { body: jsonBody(SimilarPayload) },
    responses: {
      200: jsonContent(RecommendationsResponse, 'Similar builds'),
      ...anyError,
    },
  });

  const forYouRoute = createRoute({
    method: 'get',
    path: '/community/for-you',
    tags,
    middleware: signedIn(),
    responses: {
      200: jsonContent(RecommendationsResponse, 'Recommendations'),
      ...anyError,
    },
  });

  const updateRoute = createRoute({
    method: 'put',
    path: '/community/builds/{id}',
    tags,
    middleware: signedIn(payloadErrorCode),
    request: { params: PublicationParams, body: jsonBody(UpdatePayload) },
    responses: { 200: jsonContent(IdResponse, 'Updated'), ...anyError },
  });

  const unpublishRoute = createRoute({
    method: 'delete',
    path: '/community/builds/{id}',
    tags,
    middleware: signedIn(),
    request: { params: PublicationParams },
    responses: { 200: jsonContent(IdResponse, 'Unpublished'), ...anyError },
  });

  const copyRoute = createRoute({
    method: 'post',
    path: '/community/builds/{id}/copy',
    tags,
    middleware: signedIn(),
    request: { params: PublicationParams },
    responses: {
      201: jsonContent(CopyResponse, 'Copied to a new slot'),
      ...anyError,
    },
  });

  const reviewsRoute = createRoute({
    method: 'get',
    path: '/community/builds/{id}/reviews',
    tags,
    middleware: signedIn(),
    request: { params: PublicationParams, query: ReviewsQuery },
    responses: {
      200: jsonContent(ReviewsResponse, 'Reviews page'),
      ...anyError,
    },
  });

  const saveReviewRoute = createRoute({
    method: 'put',
    path: '/community/builds/{id}/review',
    tags,
    middleware: signedIn('INVALID_REVIEW'),
    request: { params: PublicationParams, body: jsonBody(ReviewPayload) },
    responses: { 200: jsonContent(Review, 'Saved review'), ...anyError },
  });

  const deleteReviewRoute = createRoute({
    method: 'delete',
    path: '/community/builds/{id}/review',
    tags,
    middleware: signedIn(),
    request: { params: PublicationParams },
    responses: { 200: jsonContent(DeletedResponse, 'Deleted'), ...anyError },
  });

  const addFavoriteRoute = createRoute({
    method: 'put',
    path: '/community/builds/{id}/favorite',
    tags,
    middleware: signedIn(),
    request: { params: PublicationParams },
    responses: { 200: jsonContent(FavoriteResponse, 'Favorite'), ...anyError },
  });

  const removeFavoriteRoute = createRoute({
    method: 'delete',
    path: '/community/builds/{id}/favorite',
    tags,
    middleware: signedIn(),
    request: { params: PublicationParams },
    responses: {
      200: jsonContent(FavoriteResponse, 'Not a favorite'),
      ...anyError,
    },
  });

  const detailRoute = createRoute({
    method: 'get',
    path: '/community/builds/{id}',
    tags,
    description: 'Without a session, a shared link opens the locked preview.',
    middleware: middlewares(
      noStore,
      optionalUser,
      invalidRequest('INVALID_PAYLOAD'),
    ),
    request: { params: PublicationParams },
    responses: { 200: jsonContent(BuildDetail, 'Publication'), ...anyError },
  });

  const metaRoute = createRoute({
    method: 'get',
    path: '/community/meta',
    tags,
    middleware: middlewares(publicCache),
    responses: {
      200: jsonContent(MetaResponse, 'Game versions'),
      ...errorResponses(500),
    },
  });

  return featureRouter()
    .openapi(searchRoute, async (c) => {
      const { user } = c.var;
      const query = c.req.valid('query');
      if (hasAdvancedFilters(query)) {
        await requireSubscription(user);
      }

      const { rows, total } = await mapDbError(
        deps.community(user).search(searchQueryToParams(query)),
        toCommunityError,
      );
      return c.json(
        {
          items: rows.map(toSummaryDto),
          total,
          page: query.page,
          page_size: query.pageSize,
        },
        200,
      );
    })
    .openapi(publishRoute, async (c) => {
      const payload = c.req.valid('json');
      const id = await mapDbError(
        deps
          .community(c.var.user)
          .publish(
            { ...payload, description: normalizeText(payload.description) },
            roundStats(payload.stats),
          ),
        toCommunityError,
      );
      return c.json({ id }, 201);
    })
    .openapi(mineRoute, async (c) => {
      const { user } = c.var;
      const [publications, ownBuilds, subscriber] = await Promise.all([
        deps.community(user).mine(),
        deps.builds(user).listOrdered(),
        isSubscriber(user),
      ]);
      const slots = slotsById(ownBuilds);
      return c.json(
        publications.map((row) => toMyPublicationDto(row, slots, !subscriber)),
        200,
      );
    })
    .openapi(detailRoute, async (c) => {
      const { id } = c.req.valid('param');
      const user = c.var.maybeUser;
      return c.json(
        user ? await signedInDetail(user, id) : await guestDetail(id),
        200,
      );
    })
    .openapi(updateRoute, async (c) => {
      const { id } = c.req.valid('param');
      const payload = c.req.valid('json');
      await mapDbError(
        deps
          .community(c.var.user)
          .update(
            id,
            { ...payload, description: normalizeText(payload.description) },
            payload.stats && roundStats(payload.stats),
          ),
        toCommunityError,
      );
      return c.json({ id }, 200);
    })
    .openapi(unpublishRoute, async (c) => {
      const { id } = c.req.valid('param');
      const deleted = await mapDbError(
        deps.community(c.var.user).unpublish(id),
        toCommunityError,
      );
      if (deleted.length === 0) {
        throw communityError('PUBLICATION_NOT_FOUND');
      }
      return c.json({ id }, 200);
    })
    .openapi(copyRoute, async (c) => {
      const { user } = c.var;
      const { id } = c.req.valid('param');
      await requireSubscription(user);

      const community = deps.community(user);
      const [title, content] = await Promise.all([
        community.title(id),
        community.content(id),
      ]);
      if (!title || !content) {
        throw communityError('PUBLICATION_NOT_FOUND');
      }

      const builds = deps.builds(user);
      const snapshot = parseSnapshot(content.snapshot) as Record<
        string,
        unknown
      >;
      const savedAt = new Date();
      const inserted = await mapDbError(
        builds.insert(
          {
            ...snapshot,
            name: copyName(title),
            savedAt: savedAt.getTime(),
          } as Json,
          savedAt.toISOString(),
        ),
        toCommunityError,
      );

      const ownBuilds = await builds.listOrdered();
      return c.json(
        { slot: slotsById(ownBuilds).get(inserted.id) ?? ownBuilds.length },
        201,
      );
    })
    .openapi(reviewsRoute, async (c) => {
      const { user } = c.var;
      const { id } = c.req.valid('param');
      const page = Math.max(1, Number(c.req.valid('query').page) || 1);

      const [header, subscriber] = await Promise.all([
        requireHeader(user, id),
        isSubscriber(user),
      ]);
      if (!subscriber && header.author_id !== user.userId) {
        throw communityError('SUBSCRIPTION_REQUIRED');
      }

      const { rows, total } = await deps
        .reviews(user)
        .page(id, (page - 1) * REVIEWS_PAGE_SIZE, REVIEWS_PAGE_SIZE);
      const pseudos = await deps
        .profiles(user)
        .pseudosOf([...new Set(rows.map((row) => row.reviewer_id))]);

      return c.json(
        {
          items: rows.map((row) =>
            toReviewDto(
              row,
              pseudos.get(row.reviewer_id) ?? 'Anonyme',
              user.userId,
              header.content_updated_at,
            ),
          ),
          total: total ?? rows.length,
          page,
          page_size: REVIEWS_PAGE_SIZE,
        },
        200,
      );
    })
    .openapi(saveReviewRoute, async (c) => {
      const { user } = c.var;
      const { id } = c.req.valid('param');
      const payload = c.req.valid('json');
      const [header, subscriber, pseudo] = await Promise.all([
        requireHeader(user, id),
        isSubscriber(user),
        deps.profiles(user).pseudo(),
      ]);

      if (header.author_id === user.userId) {
        throw communityError('SELF_REVIEW');
      }
      if (!subscriber) {
        throw communityError('SUBSCRIPTION_REQUIRED');
      }
      if (!pseudo) {
        throw communityError('PSEUDO_REQUIRED');
      }

      const { stars } = payload;
      const body = normalizeText(payload.body);
      const reviews = deps.reviews(user);

      // Update then insert: a PostgREST upsert would need UPDATE on every
      // column, but only (stars, body) are updatable.
      const save = async () => {
        const existing = await reviews.update(id, stars, body);
        if (existing) {
          return existing;
        }
        try {
          return await reviews.insert(id, stars, body);
        } catch (error) {
          // Concurrent first review from another tab.
          if (isDbError(error) && error.code === '23505') {
            return reviews.update(id, stars, body);
          }
          throw error;
        }
      };

      const saved = await mapDbError(save(), toCommunityError);
      if (!saved) {
        throw communityError('FORBIDDEN');
      }
      return c.json(
        toReviewDto(saved, pseudo, user.userId, header.content_updated_at),
        200,
      );
    })
    .openapi(deleteReviewRoute, async (c) => {
      const { id } = c.req.valid('param');
      await mapDbError(deps.reviews(c.var.user).remove(id), toCommunityError);
      return c.json({ deleted: true }, 200);
    })
    .openapi(addFavoriteRoute, async (c) => {
      const { user } = c.var;
      const { id } = c.req.valid('param');
      await requireSubscription(user);
      await mapDbError(deps.community(user).addFavorite(id), (error) => {
        // Already a favorite: nothing to do.
        if (error.code === '23505') {
          return undefined;
        }
        return error.code === '23503'
          ? communityError('PUBLICATION_NOT_FOUND')
          : toCommunityError(error);
      });
      return c.json({ is_favorite: true }, 200);
    })
    .openapi(removeFavoriteRoute, async (c) => {
      const { id } = c.req.valid('param');
      await mapDbError(
        deps.community(c.var.user).removeFavorite(id),
        toCommunityError,
      );
      return c.json({ is_favorite: false }, 200);
    })
    .openapi(similarRoute, async (c) => {
      const { user } = c.var;
      const payload = c.req.valid('json');
      await requireSubscription(user);

      const similarities = await mapDbError(
        deps
          .community(user)
          .similar(
            payload,
            roundStats(payload.stats),
            payload.limit ?? RECOMMENDATIONS_LIMIT,
          ),
        toCommunityError,
      );

      return c.json(
        {
          items: await hydrate(user, similarities),
          strategy: 'similar' as const,
        },
        200,
      );
    })
    .openapi(forYouRoute, async (c) => {
      const { user } = c.var;
      await requireSubscription(user);

      const community = deps.community(user);
      const similarities = await mapDbError(
        community.forYou(RECOMMENDATIONS_LIMIT),
        toCommunityError,
      );
      if (similarities.length > 0) {
        return c.json(
          {
            items: await hydrate(user, similarities),
            strategy: 'similar' as const,
          },
          200,
        );
      }

      // No signal yet (no publication, favorite or 4+ star review).
      const trending = await mapDbError(
        community.search({
          sort: 'trending',
          limit: RECOMMENDATIONS_LIMIT + 6,
          offset: 0,
        }),
        toCommunityError,
      );

      return c.json(
        {
          items: trending.rows
            .filter((row) => !row.is_mine)
            .slice(0, RECOMMENDATIONS_LIMIT)
            .map((row) => ({ ...toSummaryDto(row), similarity: null })),
          strategy: 'trending' as const,
        },
        200,
      );
    })
    .openapi(metaRoute, async (c) => {
      const versions = await deps.communityPublic.gameVersions();
      return c.json(
        {
          current_version:
            versions.find((version) => version.is_current)?.code ?? null,
          versions: [...versions],
        },
        200,
      );
    });
};
