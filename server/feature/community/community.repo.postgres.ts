import { z } from '@hono/zod-openapi';
import { and, asc, count, desc, eq, sql } from 'drizzle-orm';

import type {
  CommunityPublicRepo,
  CommunityRepo,
  ReviewRepo,
} from './community.repo.js';
import type { SimilarityRow } from './community.rules.js';
import { Specialization, StatsDto } from './community.schema.js';
import { withAnon, withUser, type Db, type Tx } from '../../db/client.js';
import { decodeRows, firstOrNull, single } from '../../db/rows.js';
import {
  community_build,
  community_build_content,
  community_favorite,
  community_review,
  game_version,
} from '../../db/schema.js';
import { arrayLiteral, jsonParam, jsonRows } from '../../db/sql.js';
import type { User } from '../../platform/auth.js';
import { ItemType, RaceType, StatProperty } from '../catalog/catalog.schema.js';

// ---------------------------------------------------------------------------
// Row schemas: function results and JSON columns are loosely typed, so they
// are validated here.
// ---------------------------------------------------------------------------

/** numeric / bigint values may come back as strings. */
const Numeric = z.union([z.number(), z.string()]);

const previewFields = {
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  specialization: Specialization,
  detected_specialization: Specialization,
  game_version: z.string(),
  race: RaceType,
  gender: z.enum(['male', 'female']),
  weapon_types: z.array(ItemType).nullable(),
  has_heal_weapon: z.boolean(),
  key_stats: z
    .array(z.object({ stat: StatProperty, value: Numeric }))
    .nullable(),
  rating_count: z.number(),
  rating_avg: Numeric.nullable(),
  published_at: z.string(),
  content_updated_at: z.string(),
  author_pseudo: z.string(),
};

const decodeSearchRows = decodeRows(
  z.array(
    z.object({
      ...previewFields,
      stats: StatsDto.nullable(),
      is_mine: z.boolean(),
      is_favorite: z.boolean(),
      total_count: Numeric,
    }),
  ),
);

const decodePreviewRow = decodeRows(z.object(previewFields).nullable());

const decodePublicationRows = decodeRows(
  z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string().nullable(),
      specialization: Specialization,
      source_build_id: z.string().nullable(),
      game_version: z.string(),
      rating_count: z.number(),
      rating_avg: Numeric.nullable(),
      published_at: z.string(),
      content_updated_at: z.string(),
    }),
  ),
);

const decodeContentRow = decodeRows(
  z.object({ snapshot: z.unknown(), stats: StatsDto }).nullable(),
);

const REVIEW_COLUMNS = {
  id: community_review.id,
  reviewer_id: community_review.reviewer_id,
  stars: community_review.stars,
  body: community_review.body,
  created_at: community_review.created_at,
  updated_at: community_review.updated_at,
};

const emptyToNull = <T>(values: ReadonlyArray<T> | undefined) =>
  values && values.length > 0 ? values : null;

/** Rows of a set-returning function call, as JSON objects. */
const callRows = async (tx: Tx, call: ReturnType<typeof sql>) => {
  const result = await tx.execute<{ row: unknown }>(jsonRows(call));
  return result.rows.map(({ row }) => row);
};

// ---------------------------------------------------------------------------
// Public data
// ---------------------------------------------------------------------------

export const makeCommunityPublicRepo = (db: Db): CommunityPublicRepo => ({
  gameVersions: () =>
    withAnon(db, (tx) =>
      tx
        .select({
          code: game_version.code,
          label: game_version.label,
          released_at: game_version.released_at,
          is_current: game_version.is_current,
        })
        .from(game_version)
        .orderBy(desc(game_version.created_at)),
    ),
  preview: (id) =>
    withAnon(db, async (tx) =>
      decodePreviewRow(
        firstOrNull(
          await callRows(
            tx,
            sql`public.community_get_preview(p_id => ${id}::uuid)`,
          ),
        ),
      ),
    ),
});

// ---------------------------------------------------------------------------
// Publications, search, favorites, recommendations
// ---------------------------------------------------------------------------

export const makeCommunityRepo =
  (db: Db) =>
  (user: User): CommunityRepo => {
    const asUser = <A>(work: (tx: Tx) => Promise<A>) =>
      withUser(db, user, work);
    const mine = eq(community_build.author_id, user.userId);

    return {
      search: (params) =>
        asUser(async (tx) => {
          const statMin =
            params.statMin && Object.keys(params.statMin).length > 0
              ? params.statMin
              : null;
          const rows = decodeSearchRows(
            await callRows(
              tx,
              sql`public.community_search(
                p_query => ${params.query ?? null}::text,
                p_specializations => ${arrayLiteral(emptyToNull(params.specializations))}::text[],
                p_min_rating => ${params.minRating ?? null}::numeric,
                p_races => ${arrayLiteral(emptyToNull(params.races))}::public.race_type[],
                p_genders => ${arrayLiteral(emptyToNull(params.genders))}::text[],
                p_weapon_types => ${arrayLiteral(emptyToNull(params.weaponTypes))}::public.item_type[],
                p_heal_only => ${params.healOnly ?? false}::boolean,
                p_game_version => ${params.gameVersion ?? null}::text,
                p_stat_min => ${jsonParam(statMin)}::jsonb,
                p_implants => ${arrayLiteral(emptyToNull(params.implants))}::text[],
                p_drug_ids => ${arrayLiteral(emptyToNull(params.drugIds))}::text[],
                p_item_ids => ${arrayLiteral(emptyToNull(params.itemIds))}::text[],
                p_author_id => ${null}::uuid,
                p_favorites_only => ${params.favoritesOnly ?? false}::boolean,
                p_ids => ${arrayLiteral(emptyToNull(params.ids))}::uuid[],
                p_sort => ${params.sort ?? 'trending'}::text,
                p_limit => ${params.limit}::integer,
                p_offset => ${params.offset}::integer
              )`,
            ),
          );
          return {
            rows,
            total: rows.length > 0 ? Number(rows[0]?.total_count) : 0,
          };
        }),
      publish: (payload, stats) =>
        asUser(async (tx) => {
          const result = await tx.execute<{ id: string }>(sql`
            select public.community_publish(
              p_slot => ${payload.slot}::integer,
              p_title => ${payload.title}::text,
              p_description => ${payload.description ?? null}::text,
              p_specialization => ${payload.specialization}::text,
              p_detected_specialization => ${payload.detected_specialization}::text,
              p_stats => ${jsonParam(stats)}::jsonb
            ) as id
          `);
          return single(result.rows).id;
        }),
      update: (id, payload, stats) =>
        asUser(async (tx) => {
          await tx.execute(sql`
            select public.community_update_publication(
              p_id => ${id}::uuid,
              p_title => ${payload.title ?? null}::text,
              p_description => ${payload.description ?? null}::text,
              p_specialization => ${payload.specialization ?? null}::text,
              p_refresh => ${payload.refresh ?? false}::boolean,
              p_detected_specialization => ${payload.detected_specialization ?? null}::text,
              p_stats => ${jsonParam(stats ?? null)}::jsonb
            )
          `);
        }),
      unpublish: (id) =>
        asUser(async (tx) => {
          const rows = await tx
            .delete(community_build)
            .where(and(eq(community_build.id, id), mine))
            .returning({ id: community_build.id });
          return rows.map((row) => row.id);
        }),
      mine: () =>
        asUser(async (tx) =>
          decodePublicationRows(
            await tx
              .select({
                id: community_build.id,
                title: community_build.title,
                description: community_build.description,
                specialization: community_build.specialization,
                source_build_id: community_build.source_build_id,
                game_version: community_build.game_version,
                rating_count: community_build.rating_count,
                rating_avg: community_build.rating_avg,
                published_at: community_build.published_at,
                content_updated_at: community_build.content_updated_at,
              })
              .from(community_build)
              .where(mine)
              .orderBy(desc(community_build.published_at)),
          ),
        ),
      content: (id) =>
        asUser(async (tx) =>
          decodeContentRow(
            firstOrNull(
              await tx
                .select({
                  snapshot: community_build_content.snapshot,
                  stats: community_build_content.stats,
                })
                .from(community_build_content)
                .where(eq(community_build_content.publication_id, id)),
            ),
          ),
        ),
      title: (id) =>
        asUser(async (tx) => {
          const row = firstOrNull(
            await tx
              .select({ title: community_build.title })
              .from(community_build)
              .where(eq(community_build.id, id)),
          );
          return row?.title ?? null;
        }),
      header: (id) =>
        asUser(async (tx) =>
          firstOrNull(
            await tx
              .select({
                author_id: community_build.author_id,
                content_updated_at: community_build.content_updated_at,
              })
              .from(community_build)
              .where(eq(community_build.id, id)),
          ),
        ),
      addFavorite: (id) =>
        asUser(async (tx) => {
          await tx
            .insert(community_favorite)
            .values({ publication_id: id, user_id: user.userId });
        }),
      removeFavorite: (id) =>
        asUser(async (tx) => {
          await tx
            .delete(community_favorite)
            .where(
              and(
                eq(community_favorite.publication_id, id),
                eq(community_favorite.user_id, user.userId),
              ),
            );
        }),
      similar: (payload, stats, limit) =>
        asUser(
          async (tx) =>
            (await callRows(
              tx,
              sql`public.community_similar(
                p_stats => ${jsonParam(stats)}::jsonb,
                p_exclude_ids => ${arrayLiteral(payload.exclude_ids ?? null)}::uuid[],
                p_game_version => ${payload.version ?? null}::text,
                p_limit => ${limit}::integer
              )`,
            )) as ReadonlyArray<SimilarityRow>,
        ),
      forYou: (limit) =>
        asUser(
          async (tx) =>
            (await callRows(
              tx,
              sql`public.community_for_you(p_limit => ${limit}::integer)`,
            )) as ReadonlyArray<SimilarityRow>,
        ),
    };
  };

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

export const makeReviewRepo =
  (db: Db) =>
  (user: User): ReviewRepo => {
    const asUser = <A>(work: (tx: Tx) => Promise<A>) =>
      withUser(db, user, work);
    const onPublication = (publicationId: string) =>
      eq(community_review.publication_id, publicationId);
    const myReviewOn = (publicationId: string) =>
      and(
        onPublication(publicationId),
        eq(community_review.reviewer_id, user.userId),
      );

    return {
      mine: (publicationId) =>
        asUser(async (tx) =>
          firstOrNull(
            await tx
              .select(REVIEW_COLUMNS)
              .from(community_review)
              .where(myReviewOn(publicationId)),
          ),
        ),
      page: (publicationId, from, size) =>
        asUser(async (tx) => {
          const rows = await tx
            .select(REVIEW_COLUMNS)
            .from(community_review)
            .where(onPublication(publicationId))
            .orderBy(
              desc(community_review.updated_at),
              asc(community_review.id),
            )
            .limit(size)
            .offset(from);
          const [total] = await tx
            .select({ total: count() })
            .from(community_review)
            .where(onPublication(publicationId));
          return { rows, total: total?.total ?? null };
        }),
      update: (publicationId, stars, body) =>
        asUser(async (tx) =>
          firstOrNull(
            await tx
              .update(community_review)
              .set({ stars, body })
              .where(myReviewOn(publicationId))
              .returning(REVIEW_COLUMNS),
          ),
        ),
      insert: (publicationId, stars, body) =>
        asUser(async (tx) =>
          single(
            await tx
              .insert(community_review)
              .values({
                publication_id: publicationId,
                reviewer_id: user.userId,
                stars,
                body,
              })
              .returning(REVIEW_COLUMNS),
          ),
        ),
      remove: (publicationId) =>
        asUser(async (tx) => {
          await tx.delete(community_review).where(myReviewOn(publicationId));
        }),
    };
  };
