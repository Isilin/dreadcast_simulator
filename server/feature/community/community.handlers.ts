import { Effect, Layer, Option } from 'effect';
import * as HttpApiBuilder from 'effect/unstable/httpapi/HttpApiBuilder';

import { communityError, toCommunityError } from './community.errors.js';
import { CommunityRepo, ReviewRepo } from './community.repo.js';
import {
  copyName,
  hasAdvancedFilters,
  normalizeText,
  orderBySimilarity,
  roundStats,
  searchQueryToParams,
  slotsById,
  toMyPublicationDto,
  toPreviewSummaryDto,
  toReviewDto,
  toSummaryDto,
  type SimilarityRow,
} from './community.rules.js';
import type { BuildDetail } from './community.schema.js';
import { DreadcastApi } from '../../api.contract.js';
import { CurrentUser, MaybeCurrentUser } from '../../platform/auth.js';
import { NoStoreLive, PublicCacheLive } from '../../platform/cache.js';
import type { Json } from '../../platform/database.gen.js';
import { toInternalError } from '../../platform/db-error.js';
import { BuildRepo } from '../build/build.repo.js';
import { parseSnapshot } from '../build/build.rules.js';
import { ProfileRepo } from '../profile/profile.repo.js';
import { SubscriptionRepo } from '../subscription/subscription.repo.js';

const REVIEWS_PAGE_SIZE = 20;
const RECOMMENDATIONS_LIMIT = 12;

export const CommunityHandlers = HttpApiBuilder.group(
  DreadcastApi,
  'community',
  (handlers) =>
    Effect.gen(function* () {
      const community = yield* CommunityRepo;
      const reviews = yield* ReviewRepo;
      const builds = yield* BuildRepo;
      const subscriptions = yield* SubscriptionRepo;
      const profiles = yield* ProfileRepo;

      const isSubscriber = subscriptions.hasActive.pipe(
        Effect.mapError(toInternalError),
      );

      const requireSubscription = Effect.flatMap(isSubscriber, (active) =>
        active
          ? Effect.void
          : Effect.fail(communityError('SUBSCRIPTION_REQUIRED')),
      );

      /** Summaries of the similar publications, in similarity order. */
      const hydrate = (similarities: ReadonlyArray<SimilarityRow>) =>
        similarities.length === 0
          ? Effect.succeed([])
          : community
              .search({
                ids: similarities.map((row) => row.publication_id),
                gameVersion: '*',
                limit: similarities.length,
                offset: 0,
              })
              .pipe(
                Effect.map(({ rows }) => orderBySimilarity(similarities, rows)),
                Effect.mapError(toCommunityError),
              );

      const signedInDetail = (id: string) =>
        Effect.gen(function* () {
          const { userId } = yield* CurrentUser;
          const { search, content, subscriber, myReview, pseudo } =
            yield* Effect.all(
              {
                search: community
                  .search({ ids: [id], gameVersion: '*', limit: 1, offset: 0 })
                  .pipe(Effect.mapError(toCommunityError)),
                content: community
                  .content(id)
                  .pipe(Effect.mapError(toInternalError)),
                subscriber: isSubscriber,
                myReview: reviews
                  .mine(id)
                  .pipe(Effect.mapError(toInternalError)),
                pseudo: profiles.pseudo.pipe(Effect.mapError(toInternalError)),
              },
              { concurrency: 'unbounded' },
            );

          const row = search.rows[0];
          if (!row) {
            return yield* communityError('PUBLICATION_NOT_FOUND');
          }

          const detail: BuildDetail = {
            summary: toSummaryDto(row),
            content: content
              ? {
                  snapshot: parseSnapshot(content.snapshot),
                  stats: content.stats,
                }
              : null,
            locked: !content,
            is_subscriber: subscriber,
            my_review: myReview
              ? toReviewDto(
                  myReview,
                  pseudo ?? '',
                  userId,
                  row.content_updated_at,
                )
              : null,
          };
          return detail;
        });

      const guestDetail = (id: string) =>
        Effect.gen(function* () {
          const row = yield* community
            .preview(id)
            .pipe(Effect.mapError(toCommunityError));
          if (!row) {
            return yield* communityError('PUBLICATION_NOT_FOUND');
          }

          const detail: BuildDetail = {
            summary: toPreviewSummaryDto(row),
            content: null,
            locked: true,
            is_subscriber: false,
            my_review: null,
          };
          return detail;
        });

      /** Author and last content update, 404 when the publication is gone. */
      const requireHeader = (id: string) =>
        community.header(id).pipe(
          Effect.mapError(toInternalError),
          Effect.flatMap((header) =>
            header
              ? Effect.succeed(header)
              : Effect.fail(communityError('PUBLICATION_NOT_FOUND')),
          ),
        );

      return handlers
        .handle('meta', () =>
          community.gameVersions.pipe(
            Effect.map((versions) => ({
              current_version:
                versions.find((version) => version.is_current)?.code ?? null,
              versions,
            })),
            Effect.mapError(toInternalError),
          ),
        )
        .handle('search', ({ query }) =>
          Effect.gen(function* () {
            if (hasAdvancedFilters(query)) {
              yield* requireSubscription;
            }

            const { rows, total } = yield* community
              .search(searchQueryToParams(query))
              .pipe(Effect.mapError(toCommunityError));

            return {
              items: rows.map(toSummaryDto),
              total,
              page: query.page,
              page_size: query.pageSize,
            };
          }),
        )
        .handle('publish', ({ payload }) =>
          community
            .publish(
              { ...payload, description: normalizeText(payload.description) },
              roundStats(payload.stats),
            )
            .pipe(
              Effect.map((id) => ({ id })),
              Effect.mapError(toCommunityError),
            ),
        )
        .handle('mine', () =>
          Effect.all(
            {
              publications: community.mine,
              ownBuilds: builds.listOrdered,
              subscriber: subscriptions.hasActive,
            },
            { concurrency: 'unbounded' },
          ).pipe(
            Effect.map(({ publications, ownBuilds, subscriber }) => {
              const slots = slotsById(ownBuilds);
              return publications.map((row) =>
                toMyPublicationDto(row, slots, !subscriber),
              );
            }),
            Effect.mapError(toInternalError),
          ),
        )
        .handle('detail', ({ params }) =>
          MaybeCurrentUser.use((user) =>
            Option.match(user, {
              onNone: () => guestDetail(params.id),
              onSome: (signedIn) =>
                Effect.provideService(
                  signedInDetail(params.id),
                  CurrentUser,
                  signedIn,
                ),
            }),
          ),
        )
        .handle('update', ({ params, payload }) =>
          community
            .update(
              params.id,
              { ...payload, description: normalizeText(payload.description) },
              payload.stats && roundStats(payload.stats),
            )
            .pipe(
              Effect.as({ id: params.id }),
              Effect.mapError(toCommunityError),
            ),
        )
        .handle('unpublish', ({ params }) =>
          Effect.gen(function* () {
            const deleted = yield* community
              .unpublish(params.id)
              .pipe(Effect.mapError(toCommunityError));
            if (deleted.length === 0) {
              return yield* communityError('PUBLICATION_NOT_FOUND');
            }
            return { id: params.id };
          }),
        )
        .handle('copy', ({ params }) =>
          Effect.gen(function* () {
            yield* requireSubscription;

            const { title, content } = yield* Effect.all(
              {
                title: community.title(params.id),
                content: community.content(params.id),
              },
              { concurrency: 'unbounded' },
            ).pipe(Effect.mapError(toInternalError));
            if (!title || !content) {
              return yield* communityError('PUBLICATION_NOT_FOUND');
            }

            const snapshot = parseSnapshot(content.snapshot) as Record<
              string,
              unknown
            >;
            const savedAt = new Date();
            const inserted = yield* builds
              .insert(
                {
                  ...snapshot,
                  name: copyName(title),
                  savedAt: savedAt.getTime(),
                } as Json,
                savedAt.toISOString(),
              )
              .pipe(Effect.mapError(toCommunityError));

            const ownBuilds = yield* builds.listOrdered.pipe(
              Effect.mapError(toInternalError),
            );
            return {
              slot: slotsById(ownBuilds).get(inserted.id) ?? ownBuilds.length,
            };
          }),
        )
        .handle('reviews', ({ params, query }) =>
          Effect.gen(function* () {
            const { userId } = yield* CurrentUser;
            const page = Math.max(1, Number(query.page) || 1);

            const { header, subscriber } = yield* Effect.all(
              { header: requireHeader(params.id), subscriber: isSubscriber },
              { concurrency: 'unbounded' },
            );
            if (!subscriber && header.author_id !== userId) {
              return yield* communityError('SUBSCRIPTION_REQUIRED');
            }

            const { rows, total } = yield* reviews
              .page(
                params.id,
                (page - 1) * REVIEWS_PAGE_SIZE,
                REVIEWS_PAGE_SIZE,
              )
              .pipe(Effect.mapError(toInternalError));
            const pseudos = yield* profiles
              .pseudosOf([...new Set(rows.map((row) => row.reviewer_id))])
              .pipe(Effect.mapError(toInternalError));

            return {
              items: rows.map((row) =>
                toReviewDto(
                  row,
                  pseudos.get(row.reviewer_id) ?? 'Anonyme',
                  userId,
                  header.content_updated_at,
                ),
              ),
              total: total ?? rows.length,
              page,
              page_size: REVIEWS_PAGE_SIZE,
            };
          }),
        )
        .handle('saveReview', ({ params, payload }) =>
          Effect.gen(function* () {
            const { userId } = yield* CurrentUser;
            const { header, subscriber, pseudo } = yield* Effect.all(
              {
                header: requireHeader(params.id),
                subscriber: isSubscriber,
                pseudo: profiles.pseudo.pipe(Effect.mapError(toInternalError)),
              },
              { concurrency: 'unbounded' },
            );

            if (header.author_id === userId) {
              return yield* communityError('SELF_REVIEW');
            }
            if (!subscriber) {
              return yield* communityError('SUBSCRIPTION_REQUIRED');
            }
            if (!pseudo) {
              return yield* communityError('PSEUDO_REQUIRED');
            }

            const { stars } = payload;
            const body = normalizeText(payload.body);

            // Update then insert: a PostgREST upsert would need UPDATE on
            // every column, but only (stars, body) are updatable.
            const updateExisting = reviews.update(params.id, stars, body);
            const saved = yield* updateExisting.pipe(
              Effect.flatMap((row) =>
                row
                  ? Effect.succeed(row)
                  : reviews.insert(params.id, stars, body).pipe(
                      // Concurrent first review from another tab.
                      Effect.catchIf(
                        (error) => error.code === '23505',
                        () => updateExisting,
                      ),
                    ),
              ),
              Effect.mapError(toCommunityError),
            );

            if (!saved) {
              return yield* communityError('FORBIDDEN');
            }
            return toReviewDto(
              saved,
              pseudo,
              userId,
              header.content_updated_at,
            );
          }),
        )
        .handle('deleteReview', ({ params }) =>
          reviews
            .remove(params.id)
            .pipe(
              Effect.as({ deleted: true }),
              Effect.mapError(toCommunityError),
            ),
        )
        .handle('addFavorite', ({ params }) =>
          Effect.gen(function* () {
            yield* requireSubscription;
            yield* community.addFavorite(params.id).pipe(
              // Already a favorite: nothing to do.
              Effect.catchIf(
                (error) => error.code === '23505',
                () => Effect.void,
              ),
              Effect.mapError((error) =>
                error.code === '23503'
                  ? communityError('PUBLICATION_NOT_FOUND')
                  : toCommunityError(error),
              ),
            );
            return { is_favorite: true };
          }),
        )
        .handle('removeFavorite', ({ params }) =>
          community
            .removeFavorite(params.id)
            .pipe(
              Effect.as({ is_favorite: false }),
              Effect.mapError(toCommunityError),
            ),
        )
        .handle('similar', ({ payload }) =>
          Effect.gen(function* () {
            yield* requireSubscription;

            const similarities = yield* community
              .similar(
                payload,
                roundStats(payload.stats),
                payload.limit ?? RECOMMENDATIONS_LIMIT,
              )
              .pipe(Effect.mapError(toCommunityError));

            return {
              items: yield* hydrate(similarities),
              strategy: 'similar' as const,
            };
          }),
        )
        .handle('forYou', () =>
          Effect.gen(function* () {
            yield* requireSubscription;

            const similarities = yield* community
              .forYou(RECOMMENDATIONS_LIMIT)
              .pipe(Effect.mapError(toCommunityError));
            if (similarities.length > 0) {
              return {
                items: yield* hydrate(similarities),
                strategy: 'similar' as const,
              };
            }

            // No signal yet (no publication, favorite or 4+ star review).
            const trending = yield* community
              .search({
                sort: 'trending',
                limit: RECOMMENDATIONS_LIMIT + 6,
                offset: 0,
              })
              .pipe(Effect.mapError(toCommunityError));

            return {
              items: trending.rows
                .filter((row) => !row.is_mine)
                .slice(0, RECOMMENDATIONS_LIMIT)
                .map((row) => ({ ...toSummaryDto(row), similarity: null })),
              strategy: 'trending' as const,
            };
          }),
        );
    }),
).pipe(Layer.provide([NoStoreLive, PublicCacheLive]));
