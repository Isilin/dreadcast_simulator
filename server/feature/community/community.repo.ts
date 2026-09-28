import { Context, Effect, Layer, Schema } from 'effect';

import type {
  PreviewRow,
  PublicationRow,
  ReviewRow,
  SearchParams,
  SearchRow,
  SimilarityRow,
} from './community.rules.js';
import {
  Specialization,
  StatsDto,
  type PublishPayload,
  type SimilarPayload,
  type UpdatePayload,
} from './community.schema.js';
import { CurrentUser } from '../../platform/auth.js';
import type { Database, Json } from '../../platform/database.gen.js';
import type { DbError } from '../../platform/db-error.js';
import {
  decodeRows,
  runCountedQuery,
  runQuery,
  Supabase,
} from '../../platform/supabase.js';
import { ItemType, RaceType, StatProperty } from '../catalog/catalog.schema.js';

// ---------------------------------------------------------------------------
// Row schemas: RPC results and JSON columns are loosely typed by the
// generated types, so they are validated here.
// ---------------------------------------------------------------------------

/** numeric / bigint columns may come back as strings. */
const Numeric = Schema.Union([Schema.Number, Schema.String]);

const previewFields = {
  id: Schema.String,
  title: Schema.String,
  description: Schema.NullOr(Schema.String),
  specialization: Specialization,
  detected_specialization: Specialization,
  game_version: Schema.String,
  race: RaceType,
  gender: Schema.Literals(['male', 'female']),
  weapon_types: Schema.NullOr(Schema.Array(ItemType)),
  has_heal_weapon: Schema.Boolean,
  key_stats: Schema.NullOr(
    Schema.Array(Schema.Struct({ stat: StatProperty, value: Numeric })),
  ),
  rating_count: Schema.Number,
  rating_avg: Schema.NullOr(Numeric),
  published_at: Schema.String,
  content_updated_at: Schema.String,
  author_pseudo: Schema.String,
};

const SearchRows = Schema.Array(
  Schema.Struct({
    ...previewFields,
    stats: Schema.NullOr(StatsDto),
    is_mine: Schema.Boolean,
    is_favorite: Schema.Boolean,
    total_count: Numeric,
  }),
);

const PreviewRowSchema = Schema.NullOr(Schema.Struct(previewFields));

const PublicationRows = Schema.Array(
  Schema.Struct({
    id: Schema.String,
    title: Schema.String,
    description: Schema.NullOr(Schema.String),
    specialization: Specialization,
    source_build_id: Schema.NullOr(Schema.String),
    game_version: Schema.String,
    rating_count: Schema.Number,
    rating_avg: Schema.NullOr(Numeric),
    published_at: Schema.String,
    content_updated_at: Schema.String,
  }),
);

const ContentRow = Schema.NullOr(
  Schema.Struct({ snapshot: Schema.Unknown, stats: StatsDto }),
);

const REVIEW_SELECT = 'id, reviewer_id, stars, body, created_at, updated_at';

type SearchArgs = Database['public']['Functions']['community_search']['Args'];

const emptyToNull = <T>(values: ReadonlyArray<T> | undefined) =>
  values && values.length > 0 ? values : null;

export interface GameVersionRow {
  code: string;
  label: string;
  released_at: string | null;
  is_current: boolean;
}

export interface PublicationContent {
  snapshot: unknown;
  stats: Readonly<Record<string, number>>;
}

// ---------------------------------------------------------------------------
// Publications, search, favorites, recommendations
// ---------------------------------------------------------------------------

export class CommunityRepo extends Context.Service<
  CommunityRepo,
  {
    /** Public: newest first. */
    readonly gameVersions: Effect.Effect<
      ReadonlyArray<GameVersionRow>,
      DbError
    >;
    /** Public preview of a publication (no content), null if unknown. */
    readonly preview: (id: string) => Effect.Effect<PreviewRow | null, DbError>;
    readonly search: (
      params: SearchParams,
    ) => Effect.Effect<
      { rows: ReadonlyArray<SearchRow>; total: number },
      DbError,
      CurrentUser
    >;
    /** Returns the id of the new publication. */
    readonly publish: (
      payload: PublishPayload,
      stats: Readonly<Record<string, number>>,
    ) => Effect.Effect<string, DbError, CurrentUser>;
    readonly update: (
      id: string,
      payload: UpdatePayload,
      stats: Readonly<Record<string, number>> | undefined,
    ) => Effect.Effect<void, DbError, CurrentUser>;
    /** Ids actually deleted: empty when not the author (or unknown). */
    readonly unpublish: (
      id: string,
    ) => Effect.Effect<ReadonlyArray<string>, DbError, CurrentUser>;
    /** Publications of the current user, newest first. */
    readonly mine: Effect.Effect<
      ReadonlyArray<PublicationRow>,
      DbError,
      CurrentUser
    >;
    /** Content, null when locked for the caller (RLS) or unknown. */
    readonly content: (
      id: string,
    ) => Effect.Effect<PublicationContent | null, DbError, CurrentUser>;
    readonly title: (
      id: string,
    ) => Effect.Effect<string | null, DbError, CurrentUser>;
    readonly header: (
      id: string,
    ) => Effect.Effect<
      { author_id: string; content_updated_at: string } | null,
      DbError,
      CurrentUser
    >;
    /** Fails with 23505 when already a favorite, 23503 if unknown. */
    readonly addFavorite: (
      id: string,
    ) => Effect.Effect<void, DbError, CurrentUser>;
    readonly removeFavorite: (
      id: string,
    ) => Effect.Effect<void, DbError, CurrentUser>;
    readonly similar: (
      payload: SimilarPayload,
      stats: Readonly<Record<string, number>>,
      limit: number,
    ) => Effect.Effect<ReadonlyArray<SimilarityRow>, DbError, CurrentUser>;
    readonly forYou: (
      limit: number,
    ) => Effect.Effect<ReadonlyArray<SimilarityRow>, DbError, CurrentUser>;
  }
>()('server/CommunityRepo') {
  static readonly layer = Layer.effect(
    CommunityRepo,
    Effect.gen(function* () {
      const supabase = yield* Supabase;

      return {
        gameVersions: Effect.suspend(() =>
          runQuery(
            supabase
              .anon()
              .from('game_version')
              .select('code, label, released_at, is_current')
              .order('created_at', { ascending: false }),
          ),
        ),
        preview: (id) =>
          Effect.suspend(() =>
            runQuery(
              supabase
                .anon()
                .rpc('community_get_preview', { p_id: id })
                .maybeSingle(),
            ),
          ).pipe(Effect.flatMap(decodeRows(PreviewRowSchema))),
        search: (params) =>
          CurrentUser.use(({ supabase: client }) => {
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

            return runQuery(client.rpc('community_search', args)).pipe(
              Effect.flatMap(decodeRows(SearchRows)),
              Effect.map((rows) => ({
                rows,
                total: rows.length > 0 ? Number(rows[0].total_count) : 0,
              })),
            );
          }),
        publish: (payload, stats) =>
          CurrentUser.use(({ supabase: client }) =>
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
          ),
        update: (id, payload, stats) =>
          CurrentUser.use(({ supabase: client }) =>
            runQuery(
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
            ),
          ).pipe(Effect.asVoid),
        unpublish: (id) =>
          CurrentUser.use(({ supabase: client, userId }) =>
            runQuery(
              client
                .from('community_build')
                .delete()
                .eq('id', id)
                .eq('author_id', userId)
                .select('id'),
            ).pipe(Effect.map((rows) => rows.map((row) => row.id))),
          ),
        mine: CurrentUser.use(({ supabase: client, userId }) =>
          runQuery(
            client
              .from('community_build')
              .select(
                'id, title, description, specialization, source_build_id, game_version, rating_count, rating_avg, published_at, content_updated_at',
              )
              .eq('author_id', userId)
              .order('published_at', { ascending: false }),
          ).pipe(Effect.flatMap(decodeRows(PublicationRows))),
        ),
        content: (id) =>
          CurrentUser.use(({ supabase: client }) =>
            runQuery(
              client
                .from('community_build_content')
                .select('snapshot, stats')
                .eq('publication_id', id)
                .maybeSingle(),
            ).pipe(Effect.flatMap(decodeRows(ContentRow))),
          ),
        title: (id) =>
          CurrentUser.use(({ supabase: client }) =>
            runQuery(
              client
                .from('community_build')
                .select('title')
                .eq('id', id)
                .maybeSingle(),
            ).pipe(Effect.map((row) => row?.title ?? null)),
          ),
        header: (id) =>
          CurrentUser.use(({ supabase: client }) =>
            runQuery(
              client
                .from('community_build')
                .select('author_id, content_updated_at')
                .eq('id', id)
                .maybeSingle(),
            ),
          ),
        addFavorite: (id) =>
          CurrentUser.use(({ supabase: client, userId }) =>
            runQuery(
              client
                .from('community_favorite')
                .insert({ publication_id: id, user_id: userId }),
            ),
          ).pipe(Effect.asVoid),
        removeFavorite: (id) =>
          CurrentUser.use(({ supabase: client, userId }) =>
            runQuery(
              client
                .from('community_favorite')
                .delete()
                .eq('publication_id', id)
                .eq('user_id', userId),
            ),
          ).pipe(Effect.asVoid),
        similar: (payload, stats, limit) =>
          CurrentUser.use(({ supabase: client }) =>
            runQuery(
              client.rpc('community_similar', {
                p_stats: stats as Json,
                p_exclude_ids: (payload.exclude_ids ?? null) as string[],
                p_game_version: (payload.version ?? null) as string,
                p_limit: limit,
              }),
            ),
          ),
        forYou: (limit) =>
          CurrentUser.use(({ supabase: client }) =>
            runQuery(client.rpc('community_for_you', { p_limit: limit })),
          ),
      };
    }),
  );
}

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

export class ReviewRepo extends Context.Service<
  ReviewRepo,
  {
    readonly mine: (
      publicationId: string,
    ) => Effect.Effect<ReviewRow | null, DbError, CurrentUser>;
    /** Most recently updated first. */
    readonly page: (
      publicationId: string,
      from: number,
      size: number,
    ) => Effect.Effect<
      { rows: ReadonlyArray<ReviewRow>; total: number | null },
      DbError,
      CurrentUser
    >;
    /** Null when the user has no review on the publication yet. */
    readonly update: (
      publicationId: string,
      stars: number,
      body: string | null,
    ) => Effect.Effect<ReviewRow | null, DbError, CurrentUser>;
    /** Fails with 23505 when a review already exists. */
    readonly insert: (
      publicationId: string,
      stars: number,
      body: string | null,
    ) => Effect.Effect<ReviewRow, DbError, CurrentUser>;
    readonly remove: (
      publicationId: string,
    ) => Effect.Effect<void, DbError, CurrentUser>;
  }
>()('server/ReviewRepo') {
  static readonly layer = Layer.succeed(ReviewRepo, {
    mine: (publicationId) =>
      CurrentUser.use(({ supabase, userId }) =>
        runQuery(
          supabase
            .from('community_review')
            .select(REVIEW_SELECT)
            .eq('publication_id', publicationId)
            .eq('reviewer_id', userId)
            .maybeSingle(),
        ),
      ),
    page: (publicationId, from, size) =>
      CurrentUser.use(({ supabase }) =>
        runCountedQuery(
          supabase
            .from('community_review')
            .select(REVIEW_SELECT, { count: 'exact' })
            .eq('publication_id', publicationId)
            .order('updated_at', { ascending: false })
            .order('id', { ascending: true })
            .range(from, from + size - 1),
        ).pipe(Effect.map(({ data, count }) => ({ rows: data, total: count }))),
      ),
    update: (publicationId, stars, body) =>
      CurrentUser.use(({ supabase, userId }) =>
        runQuery(
          supabase
            .from('community_review')
            .update({ stars, body })
            .eq('publication_id', publicationId)
            .eq('reviewer_id', userId)
            .select(REVIEW_SELECT)
            .maybeSingle(),
        ),
      ),
    insert: (publicationId, stars, body) =>
      CurrentUser.use(({ supabase, userId }) =>
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
      ),
    remove: (publicationId) =>
      CurrentUser.use(({ supabase, userId }) =>
        runQuery(
          supabase
            .from('community_review')
            .delete()
            .eq('publication_id', publicationId)
            .eq('reviewer_id', userId),
        ),
      ).pipe(Effect.asVoid),
  });
}
