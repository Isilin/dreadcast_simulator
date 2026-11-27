import { z } from '@hono/zod-openapi';

import type {
  CommunityPublicRepo,
  CommunityRepo,
  ReviewRepo,
} from './community.repo.js';
import { Specialization, StatsDto } from './community.schema.js';
import type { User } from '../../platform/auth.js';
import type { Database, Json } from '../../platform/database.gen.js';
import {
  decodeRows,
  runCountedQuery,
  runQuery,
  type Supabase,
} from '../../platform/supabase.js';
import { ItemType, RaceType, StatProperty } from '../catalog/catalog.schema.js';

// ---------------------------------------------------------------------------
// Row schemas: RPC results and JSON columns are loosely typed by the
// generated types, so they are validated here.
// ---------------------------------------------------------------------------

/** numeric / bigint columns may come back as strings. */
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

const REVIEW_SELECT = 'id, reviewer_id, stars, body, created_at, updated_at';

type SearchArgs = Database['public']['Functions']['community_search']['Args'];

const emptyToNull = <T>(values: ReadonlyArray<T> | undefined) =>
  values && values.length > 0 ? values : null;

// ---------------------------------------------------------------------------
// Public data
// ---------------------------------------------------------------------------

export const makeCommunityPublicRepo = (
  supabase: Supabase,
): CommunityPublicRepo => ({
  gameVersions: () =>
    runQuery(
      supabase
        .anon()
        .from('game_version')
        .select('code, label, released_at, is_current')
        .order('created_at', { ascending: false }),
    ),
  preview: async (id) =>
    decodePreviewRow(
      await runQuery(
        supabase
          .anon()
          .rpc('community_get_preview', { p_id: id })
          .maybeSingle(),
      ),
    ),
});

// ---------------------------------------------------------------------------
// Publications, search, favorites, recommendations
// ---------------------------------------------------------------------------

export const makeCommunityRepo = ({
  supabase: client,
  userId,
}: User): CommunityRepo => ({
  search: async (params) => {
    // Explicit nulls, as the SQL function expects.
    const args = {
      p_query: params.query ?? null,
      p_specializations: emptyToNull(params.specializations),
      p_min_rating: params.minRating ?? null,
      p_races: emptyToNull(params.races),
      p_genders: emptyToNull(params.genders),
      p_weapon_types: emptyToNull(params.weaponTypes),
      p_heal_only: params.healOnly ?? false,
      p_game_version: params.gameVersion ?? null,
      p_stat_min:
        params.statMin && Object.keys(params.statMin).length > 0
          ? params.statMin
          : null,
      p_implants: emptyToNull(params.implants),
      p_drug_ids: emptyToNull(params.drugIds),
      p_item_ids: emptyToNull(params.itemIds),
      p_author_id: null,
      p_favorites_only: params.favoritesOnly ?? false,
      p_ids: emptyToNull(params.ids),
      p_sort: params.sort ?? 'trending',
      p_limit: params.limit,
      p_offset: params.offset,
    } as unknown as SearchArgs;

    const rows = decodeSearchRows(
      await runQuery(client.rpc('community_search', args)),
    );
    return {
      rows,
      total: rows.length > 0 ? Number(rows[0].total_count) : 0,
    };
  },
  publish: (payload, stats) =>
    runQuery(
      client.rpc('community_publish', {
        p_slot: payload.slot,
        p_title: payload.title,
        p_description: payload.description as string,
        p_specialization: payload.specialization,
        p_detected_specialization: payload.detected_specialization,
        p_stats: stats as Json,
      }),
    ),
  update: async (id, payload, stats) => {
    await runQuery(
      client.rpc('community_update_publication', {
        p_id: id,
        p_title: payload.title,
        p_description: payload.description as string,
        p_specialization: payload.specialization,
        p_refresh: payload.refresh ?? false,
        p_detected_specialization: (payload.detected_specialization ??
          null) as string,
        p_stats: (stats ?? null) as Json,
      }),
    );
  },
  unpublish: async (id) => {
    const rows = await runQuery(
      client
        .from('community_build')
        .delete()
        .eq('id', id)
        .eq('author_id', userId)
        .select('id'),
    );
    return rows.map((row) => row.id);
  },
  mine: async () =>
    decodePublicationRows(
      await runQuery(
        client
          .from('community_build')
          .select(
            'id, title, description, specialization, source_build_id, game_version, rating_count, rating_avg, published_at, content_updated_at',
          )
          .eq('author_id', userId)
          .order('published_at', { ascending: false }),
      ),
    ),
  content: async (id) =>
    decodeContentRow(
      await runQuery(
        client
          .from('community_build_content')
          .select('snapshot, stats')
          .eq('publication_id', id)
          .maybeSingle(),
      ),
    ),
  title: async (id) => {
    const row = await runQuery(
      client.from('community_build').select('title').eq('id', id).maybeSingle(),
    );
    return row?.title ?? null;
  },
  header: (id) =>
    runQuery(
      client
        .from('community_build')
        .select('author_id, content_updated_at')
        .eq('id', id)
        .maybeSingle(),
    ),
  addFavorite: async (id) => {
    await runQuery(
      client
        .from('community_favorite')
        .insert({ publication_id: id, user_id: userId }),
    );
  },
  removeFavorite: async (id) => {
    await runQuery(
      client
        .from('community_favorite')
        .delete()
        .eq('publication_id', id)
        .eq('user_id', userId),
    );
  },
  similar: (payload, stats, limit) =>
    runQuery(
      client.rpc('community_similar', {
        p_stats: stats as Json,
        p_exclude_ids: (payload.exclude_ids ?? null) as string[],
        p_game_version: (payload.version ?? null) as string,
        p_limit: limit,
      }),
    ),
  forYou: (limit) =>
    runQuery(client.rpc('community_for_you', { p_limit: limit })),
});

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

export const makeReviewRepo = ({ supabase, userId }: User): ReviewRepo => ({
  mine: (publicationId) =>
    runQuery(
      supabase
        .from('community_review')
        .select(REVIEW_SELECT)
        .eq('publication_id', publicationId)
        .eq('reviewer_id', userId)
        .maybeSingle(),
    ),
  page: async (publicationId, from, size) => {
    const { data, count } = await runCountedQuery(
      supabase
        .from('community_review')
        .select(REVIEW_SELECT, { count: 'exact' })
        .eq('publication_id', publicationId)
        .order('updated_at', { ascending: false })
        .order('id', { ascending: true })
        .range(from, from + size - 1),
    );
    return { rows: data, total: count };
  },
  update: (publicationId, stars, body) =>
    runQuery(
      supabase
        .from('community_review')
        .update({ stars, body })
        .eq('publication_id', publicationId)
        .eq('reviewer_id', userId)
        .select(REVIEW_SELECT)
        .maybeSingle(),
    ),
  insert: (publicationId, stars, body) =>
    runQuery(
      supabase
        .from('community_review')
        .insert({
          publication_id: publicationId,
          reviewer_id: userId,
          stars,
          body,
        })
        .select(REVIEW_SELECT)
        .single(),
    ),
  remove: async (publicationId) => {
    await runQuery(
      supabase
        .from('community_review')
        .delete()
        .eq('publication_id', publicationId)
        .eq('reviewer_id', userId),
    );
  },
});
