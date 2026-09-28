import { Effect, Schema, SchemaTransformation } from 'effect';

import {
  ItemType,
  RACE_TYPES,
  RaceType,
  STAT_KEYS,
  StatProperty,
} from '../catalog/catalog.schema.js';

export { RACE_TYPES, STAT_KEYS };

/** Mirrors src/feature/community (parity-tested). */
export const SPECIALIZATION_CODES = [
  'medecin',
  'informaticien',
  'ingenieur',
  'combattant_cac',
  'tireur',
  'furtif',
  'tank',
  'soutien',
  'polyvalent',
] as const;

const COMMUNITY_SORTS = [
  'trending',
  'top',
  'recent',
  'most_reviewed',
  'updated',
] as const;

const WEAPON_ITEM_TYPES = [
  '1handShot',
  '2handsShot',
  '1handMelee',
  '2handsMelee',
] as const;

/** Sanity bounds only: stats are computed client-side. */
const STAT_MIN = -1000;
const STAT_MAX = 10000;

export const TITLE_MAX_LENGTH = 64;
const TITLE_MIN_LENGTH = 3;
const DESCRIPTION_MAX_LENGTH = 1000;
const REVIEW_BODY_MAX_LENGTH = 280;

const SEARCH_PAGE_SIZE_DEFAULT = 24;
const SEARCH_PAGE_SIZE_MAX = 48;
const CSV_MAX_ENTRIES = 30;

export const Specialization = Schema.Literals(SPECIALIZATION_CODES);
export type SpecializationCode = typeof Specialization.Type;

const Gender = Schema.Literals(['male', 'female']);

// ---------------------------------------------------------------------------
// Payloads
// ---------------------------------------------------------------------------

const isStatKey = (key: string) =>
  (STAT_KEYS as ReadonlyArray<string>).includes(key);

/** Every stat of STAT_KEYS, and nothing else. */
export const Stats = Schema.Record(
  Schema.String,
  Schema.Finite.check(
    Schema.isBetween({ minimum: STAT_MIN, maximum: STAT_MAX }),
  ),
).check(
  Schema.makeFilter(
    (stats) =>
      Object.keys(stats).length === STAT_KEYS.length &&
      Object.keys(stats).every(isStatKey),
    { expected: 'every stat, once' },
  ),
);

const Title = Schema.Trim.check(
  Schema.isMinLength(TITLE_MIN_LENGTH),
  Schema.isMaxLength(TITLE_MAX_LENGTH),
);

/** Empty and missing texts become null (see normalizeText). */
const OptionalText = (maxLength: number) =>
  Schema.optional(
    Schema.NullOr(Schema.Trim.check(Schema.isMaxLength(maxLength))),
  );

export const PublishPayload = Schema.Struct({
  slot: Schema.Int.check(Schema.isGreaterThanOrEqualTo(1)),
  title: Title,
  description: OptionalText(DESCRIPTION_MAX_LENGTH),
  specialization: Specialization,
  detected_specialization: Specialization,
  stats: Stats,
});

export const UpdatePayload = Schema.Struct({
  title: Title,
  description: OptionalText(DESCRIPTION_MAX_LENGTH),
  specialization: Specialization,
  refresh: Schema.optional(Schema.Boolean),
  detected_specialization: Schema.optional(Specialization),
  stats: Schema.optional(Stats),
}).check(
  Schema.makeFilter(
    (payload) =>
      !payload.refresh ||
      (payload.stats !== undefined &&
        payload.detected_specialization !== undefined),
    { expected: 'stats and detected specialization when refreshing' },
  ),
);

export const ReviewPayload = Schema.Struct({
  stars: Schema.Int.check(Schema.isBetween({ minimum: 1, maximum: 5 })),
  body: OptionalText(REVIEW_BODY_MAX_LENGTH),
});

export const SimilarPayload = Schema.Struct({
  stats: Stats,
  exclude_ids: Schema.optional(
    Schema.Array(Schema.String.check(Schema.isUUID())).check(
      Schema.isMaxLength(50),
    ),
  ),
  version: Schema.optional(Schema.String.check(Schema.isMaxLength(16))),
  limit: Schema.optional(
    Schema.Int.check(Schema.isBetween({ minimum: 1, maximum: 24 })),
  ),
});

export type PublishPayload = typeof PublishPayload.Type;
export type UpdatePayload = typeof UpdatePayload.Type;
export type SimilarPayload = typeof SimilarPayload.Type;

// ---------------------------------------------------------------------------
// Search query (?spec=a,b&minStats=strength:100&favorites=1...)
// ---------------------------------------------------------------------------

const splitCsv = (value: string) =>
  value
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

const Csv = <T>(item: Schema.Codec<T, string>) =>
  Schema.String.pipe(
    Schema.decodeTo(
      Schema.Array(item).check(Schema.isMaxLength(CSV_MAX_ENTRIES)),
      SchemaTransformation.transform<ReadonlyArray<string>, string>({
        decode: splitCsv,
        encode: (values) => values.join(','),
      }),
    ),
    // Missing parameter: decoded as ''.
    Schema.withDecodingDefault(Effect.succeed('')),
  );

const Flag = Schema.String.pipe(
  Schema.decodeTo(
    Schema.Boolean,
    SchemaTransformation.transform({
      decode: (value) => value === '1' || value === 'true',
      encode: (value) => (value ? '1' : ''),
    }),
  ),
  // Missing parameter: decoded as ''.
  Schema.withDecodingDefault(Effect.succeed('')),
);

/** `strength:100,medicine:50` -> { strength: 100, medicine: 50 }. */
const parseMinStats = (value: string): Record<string, number> =>
  Object.fromEntries(
    splitCsv(value).map((part) => {
      const [key, raw] = part.split(':');
      return [key, Number(raw)];
    }),
  );

const MinStats = Schema.String.pipe(
  Schema.decodeTo(
    Schema.Record(Schema.String, Schema.Number).check(
      Schema.makeFilter(
        (thresholds) =>
          Object.entries(thresholds).every(
            ([key, threshold]) => isStatKey(key) && Number.isFinite(threshold),
          ),
        { expected: 'stat:threshold pairs' },
      ),
    ),
    SchemaTransformation.transform({
      decode: parseMinStats,
      encode: (thresholds) =>
        Object.entries(thresholds)
          .map(([key, threshold]) => `${key}:${threshold}`)
          .join(','),
    }),
  ),
  // Missing parameter: decoded as ''.
  Schema.withDecodingDefault(Effect.succeed('')),
);

const PositiveIntFromString = (maximum: number, defaultValue: number) =>
  Schema.NumberFromString.check(
    Schema.isInt(),
    Schema.isBetween({ minimum: 1, maximum }),
  ).pipe(Schema.withDecodingDefault(Effect.succeed(String(defaultValue))));

export const SearchQuery = Schema.Struct({
  q: Schema.optionalKey(Schema.Trim.check(Schema.isMaxLength(64))),
  spec: Csv(Specialization),
  minRating: Schema.optionalKey(
    Schema.NumberFromString.check(Schema.isBetween({ minimum: 1, maximum: 5 })),
  ),
  race: Csv(Schema.Literals(RACE_TYPES)),
  gender: Csv(Gender),
  weapon: Csv(Schema.Literals(WEAPON_ITEM_TYPES)),
  heal: Flag,
  version: Schema.optionalKey(Schema.Trim.check(Schema.isMaxLength(16))),
  minStats: MinStats,
  implants: Csv(Schema.String.check(Schema.isMaxLength(64))),
  drugs: Csv(Schema.String.check(Schema.isMaxLength(32))),
  items: Csv(Schema.String.check(Schema.isMaxLength(32))),
  favorites: Flag,
  sort: Schema.Literals(COMMUNITY_SORTS).pipe(
    Schema.withDecodingDefault(Effect.succeed('trending' as const)),
  ),
  page: PositiveIntFromString(1000, 1),
  pageSize: PositiveIntFromString(
    SEARCH_PAGE_SIZE_MAX,
    SEARCH_PAGE_SIZE_DEFAULT,
  ),
});

export type SearchQuery = typeof SearchQuery.Type;

// ---------------------------------------------------------------------------
// Responses
// ---------------------------------------------------------------------------

export const StatsDto = Schema.Record(Schema.String, Schema.Number);

const KeyStat = Schema.Struct({ stat: StatProperty, value: Schema.Number });

export const BuildSummary = Schema.Struct({
  id: Schema.String,
  title: Schema.String,
  description: Schema.NullOr(Schema.String),
  specialization: Specialization,
  detected_specialization: Specialization,
  game_version: Schema.String,
  race: RaceType,
  gender: Gender,
  weapon_types: Schema.Array(ItemType),
  has_heal_weapon: Schema.Boolean,
  key_stats: Schema.Array(KeyStat),
  rating_count: Schema.Number,
  rating_avg: Schema.NullOr(Schema.Number),
  published_at: Schema.String,
  content_updated_at: Schema.String,
  author_pseudo: Schema.String,
  /** null when the caller cannot read the content (not a subscriber). */
  stats: Schema.NullOr(StatsDto),
  is_mine: Schema.Boolean,
  is_favorite: Schema.Boolean,
});

export const SearchResponse = Schema.Struct({
  items: Schema.Array(BuildSummary),
  total: Schema.Number,
  page: Schema.Number,
  page_size: Schema.Number,
});

export const Review = Schema.Struct({
  id: Schema.String,
  stars: Schema.Int.check(Schema.isBetween({ minimum: 1, maximum: 5 })),
  body: Schema.NullOr(Schema.String),
  created_at: Schema.String,
  updated_at: Schema.String,
  reviewer_pseudo: Schema.String,
  is_mine: Schema.Boolean,
  /** Written before the last content update of the publication. */
  outdated: Schema.Boolean,
});

export const BuildDetail = Schema.Struct({
  summary: BuildSummary,
  /** null when locked (caller is neither a subscriber nor the author). */
  content: Schema.NullOr(
    Schema.Struct({ snapshot: Schema.Unknown, stats: StatsDto }),
  ),
  locked: Schema.Boolean,
  is_subscriber: Schema.Boolean,
  my_review: Schema.NullOr(Review),
});

export const ReviewsResponse = Schema.Struct({
  items: Schema.Array(Review),
  total: Schema.Number,
  page: Schema.Number,
  page_size: Schema.Number,
});

export const MyPublication = Schema.Struct({
  id: Schema.String,
  title: Schema.String,
  description: Schema.NullOr(Schema.String),
  specialization: Specialization,
  /** Current 1-based slot of the source build, null if it was deleted. */
  source_slot: Schema.NullOr(
    Schema.Int.check(Schema.isGreaterThanOrEqualTo(1)),
  ),
  game_version: Schema.String,
  rating_count: Schema.Number,
  rating_avg: Schema.NullOr(Schema.Number),
  published_at: Schema.String,
  content_updated_at: Schema.String,
  /** Subscription expired: visible but cannot be updated. */
  frozen: Schema.Boolean,
});

const GameVersion = Schema.Struct({
  code: Schema.String,
  label: Schema.String,
  released_at: Schema.NullOr(Schema.String),
  is_current: Schema.Boolean,
});

export const MetaResponse = Schema.Struct({
  current_version: Schema.NullOr(Schema.String),
  versions: Schema.Array(GameVersion),
});

export const RecommendationsResponse = Schema.Struct({
  items: Schema.Array(
    Schema.Struct({
      ...BuildSummary.fields,
      similarity: Schema.NullOr(Schema.Number),
    }),
  ),
  strategy: Schema.Literals(['similar', 'trending']),
});

export type BuildSummary = typeof BuildSummary.Type;
export type Review = typeof Review.Type;
export type BuildDetail = typeof BuildDetail.Type;
export type MyPublication = typeof MyPublication.Type;
export type RecommendationsResponse = typeof RecommendationsResponse.Type;
