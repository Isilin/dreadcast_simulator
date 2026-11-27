import { z } from '@hono/zod-openapi';

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

export const Specialization = z.enum(SPECIALIZATION_CODES);
export type SpecializationCode = z.infer<typeof Specialization>;

const Gender = z.enum(['male', 'female']);

// ---------------------------------------------------------------------------
// Payloads
// ---------------------------------------------------------------------------

const isStatKey = (key: string) =>
  (STAT_KEYS as ReadonlyArray<string>).includes(key);

/** Every stat of STAT_KEYS, and nothing else. */
export const Stats = z
  .record(z.string(), z.number().min(STAT_MIN).max(STAT_MAX))
  .refine(
    (stats) =>
      Object.keys(stats).length === STAT_KEYS.length &&
      Object.keys(stats).every(isStatKey),
    { message: 'every stat, once' },
  );

const Title = z.string().trim().min(TITLE_MIN_LENGTH).max(TITLE_MAX_LENGTH);

/** Empty and missing texts become null (see normalizeText). */
const OptionalText = (maxLength: number) =>
  z.string().trim().max(maxLength).nullable().optional();

export const PublishPayload = z.object({
  slot: z.number().int().min(1),
  title: Title,
  description: OptionalText(DESCRIPTION_MAX_LENGTH),
  specialization: Specialization,
  detected_specialization: Specialization,
  stats: Stats,
});

export const UpdatePayload = z
  .object({
    title: Title,
    description: OptionalText(DESCRIPTION_MAX_LENGTH),
    specialization: Specialization,
    refresh: z.boolean().optional(),
    detected_specialization: Specialization.optional(),
    stats: Stats.optional(),
  })
  .refine(
    (payload) =>
      !payload.refresh ||
      (payload.stats !== undefined &&
        payload.detected_specialization !== undefined),
    { message: 'stats and detected specialization when refreshing' },
  );

export const ReviewPayload = z.object({
  stars: z.number().int().min(1).max(5),
  body: OptionalText(REVIEW_BODY_MAX_LENGTH),
});

export const SimilarPayload = z.object({
  stats: Stats,
  exclude_ids: z.array(z.uuid()).max(50).optional(),
  version: z.string().max(16).optional(),
  limit: z.number().int().min(1).max(24).optional(),
});

export type PublishPayload = z.infer<typeof PublishPayload>;
export type UpdatePayload = z.infer<typeof UpdatePayload>;
export type SimilarPayload = z.infer<typeof SimilarPayload>;

/** Publication id in the path. */
export const PublicationParams = z.object({
  id: z.uuid().openapi({ param: { name: 'id', in: 'path' } }),
});

// ---------------------------------------------------------------------------
// Search query (?spec=a,b&minStats=strength:100&favorites=1...)
// ---------------------------------------------------------------------------

const splitCsv = (value: string) =>
  value
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

/** Comma-separated list; a missing parameter is an empty list. */
const Csv = <T extends z.ZodType<string, string>>(item: T) =>
  z
    .string()
    .default('')
    .transform(splitCsv)
    .pipe(z.array(item).max(CSV_MAX_ENTRIES));

/** `1` or `true`; anything else (or missing) is false. */
const Flag = z
  .string()
  .default('')
  .transform((value) => value === '1' || value === 'true');

/** `strength:100,medicine:50` -> { strength: 100, medicine: 50 }. */
const parseMinStats = (value: string): Record<string, number> =>
  Object.fromEntries(
    splitCsv(value).map((part) => {
      const [key, raw] = part.split(':');
      return [key, Number(raw)];
    }),
  );

const MinStats = z
  .string()
  .default('')
  .transform(parseMinStats)
  .pipe(
    z
      .record(z.string(), z.number())
      .refine((thresholds) => Object.keys(thresholds).every(isStatKey), {
        message: 'stat:threshold pairs',
      }),
  );

const PositiveIntFromString = (maximum: number, defaultValue: number) =>
  z
    .string()
    .default(String(defaultValue))
    .transform(Number)
    .pipe(z.number().int().min(1).max(maximum));

export const SearchQuery = z.object({
  q: z.string().trim().max(64).optional(),
  spec: Csv(Specialization),
  minRating: z
    .string()
    .transform(Number)
    .pipe(z.number().min(1).max(5))
    .optional(),
  race: Csv(z.enum(RACE_TYPES)),
  gender: Csv(Gender),
  weapon: Csv(z.enum(WEAPON_ITEM_TYPES)),
  heal: Flag,
  version: z.string().trim().max(16).optional(),
  minStats: MinStats,
  implants: Csv(z.string().max(64)),
  drugs: Csv(z.string().max(32)),
  items: Csv(z.string().max(32)),
  favorites: Flag,
  sort: z.enum(COMMUNITY_SORTS).default('trending'),
  page: PositiveIntFromString(1000, 1),
  pageSize: PositiveIntFromString(
    SEARCH_PAGE_SIZE_MAX,
    SEARCH_PAGE_SIZE_DEFAULT,
  ),
});

/** Decoded search query. */
export type SearchQuery = z.output<typeof SearchQuery>;
/** Query string sent by the client (every value a string). */
export type SearchQueryInput = z.input<typeof SearchQuery>;

export const ReviewsQuery = z.object({
  // Lenient like before: anything but a positive integer means page 1.
  page: z.string().optional(),
});

// ---------------------------------------------------------------------------
// Responses
// ---------------------------------------------------------------------------

export const StatsDto = z.record(z.string(), z.number());

const KeyStat = z.object({ stat: StatProperty, value: z.number() });

const buildSummaryFields = {
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  specialization: Specialization,
  detected_specialization: Specialization,
  game_version: z.string(),
  race: RaceType,
  gender: Gender,
  weapon_types: z.array(ItemType),
  has_heal_weapon: z.boolean(),
  key_stats: z.array(KeyStat),
  rating_count: z.number(),
  rating_avg: z.number().nullable(),
  published_at: z.string(),
  content_updated_at: z.string(),
  author_pseudo: z.string(),
  /** null when the caller cannot read the content (not a subscriber). */
  stats: StatsDto.nullable(),
  is_mine: z.boolean(),
  is_favorite: z.boolean(),
};

export const BuildSummary = z
  .object(buildSummaryFields)
  .openapi('BuildSummary');

export const SearchResponse = z
  .object({
    items: z.array(BuildSummary),
    total: z.number(),
    page: z.number(),
    page_size: z.number(),
  })
  .openapi('SearchResponse');

export const Review = z
  .object({
    id: z.string(),
    stars: z.number().int().min(1).max(5),
    body: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
    reviewer_pseudo: z.string(),
    is_mine: z.boolean(),
    /** Written before the last content update of the publication. */
    outdated: z.boolean(),
  })
  .openapi('Review');

export const BuildDetail = z
  .object({
    summary: BuildSummary,
    /** null when locked (caller is neither a subscriber nor the author). */
    content: z.object({ snapshot: z.unknown(), stats: StatsDto }).nullable(),
    locked: z.boolean(),
    is_subscriber: z.boolean(),
    my_review: Review.nullable(),
  })
  .openapi('BuildDetail');

export const ReviewsResponse = z
  .object({
    items: z.array(Review),
    total: z.number(),
    page: z.number(),
    page_size: z.number(),
  })
  .openapi('ReviewsResponse');

export const MyPublication = z
  .object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    specialization: Specialization,
    /** Current 1-based slot of the source build, null if it was deleted. */
    source_slot: z.number().int().min(1).nullable(),
    game_version: z.string(),
    rating_count: z.number(),
    rating_avg: z.number().nullable(),
    published_at: z.string(),
    content_updated_at: z.string(),
    /** Subscription expired: visible but cannot be updated. */
    frozen: z.boolean(),
  })
  .openapi('MyPublication');

const GameVersion = z.object({
  code: z.string(),
  label: z.string(),
  released_at: z.string().nullable(),
  is_current: z.boolean(),
});

export const MetaResponse = z
  .object({
    current_version: z.string().nullable(),
    versions: z.array(GameVersion),
  })
  .openapi('MetaResponse');

export const RecommendationsResponse = z
  .object({
    items: z.array(
      z.object({
        ...buildSummaryFields,
        similarity: z.number().nullable(),
      }),
    ),
    strategy: z.enum(['similar', 'trending']),
  })
  .openapi('RecommendationsResponse');

export const IdResponse = z.object({ id: z.string() });
export const FavoriteResponse = z.object({ is_favorite: z.boolean() });
export const CopyResponse = z.object({ slot: z.number() });
export const DeletedResponse = z.object({ deleted: z.boolean() });

export type BuildSummary = z.infer<typeof BuildSummary>;
export type Review = z.infer<typeof Review>;
export type BuildDetail = z.infer<typeof BuildDetail>;
export type MyPublication = z.infer<typeof MyPublication>;
export type MetaResponse = z.infer<typeof MetaResponse>;
export type RecommendationsResponse = z.infer<typeof RecommendationsResponse>;
