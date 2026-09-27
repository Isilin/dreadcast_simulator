import type { SchemaIssue } from 'effect';

import type { CommunityErrorCode } from './community.errors.js';
import type {
  BuildSummary,
  MyPublication,
  Review,
  SearchQuery,
  SpecializationCode,
} from './community.schema.js';
import { TITLE_MAX_LENGTH } from './community.schema.js';

// ---------------------------------------------------------------------------
// Rows read from the database
// ---------------------------------------------------------------------------

export interface KeyStatRow {
  stat: BuildSummary['key_stats'][number]['stat'];
  value: number | string;
}

/** Row of the community_search RPC. */
export interface SearchRow {
  id: string;
  title: string;
  description: string | null;
  specialization: SpecializationCode;
  detected_specialization: SpecializationCode;
  game_version: string;
  race: string;
  gender: 'male' | 'female';
  weapon_types: ReadonlyArray<string> | null;
  has_heal_weapon: boolean;
  key_stats: ReadonlyArray<KeyStatRow> | null;
  rating_count: number;
  rating_avg: number | string | null;
  published_at: string;
  content_updated_at: string;
  author_pseudo: string;
  stats: Readonly<Record<string, number>> | null;
  is_mine: boolean;
  is_favorite: boolean;
  total_count: number | string;
}

/** Row of the public community_get_preview RPC: preview metadata only. */
export type PreviewRow = Omit<
  SearchRow,
  'stats' | 'is_mine' | 'is_favorite' | 'total_count'
>;

export interface ReviewRow {
  id: string;
  reviewer_id: string;
  stars: number;
  body: string | null;
  created_at: string;
  updated_at: string;
}

export interface PublicationRow {
  id: string;
  title: string;
  description: string | null;
  specialization: SpecializationCode;
  source_build_id: string | null;
  game_version: string;
  rating_count: number;
  rating_avg: number | string | null;
  published_at: string;
  content_updated_at: string;
}

export interface SimilarityRow {
  publication_id: string;
  similarity: number;
}

// ---------------------------------------------------------------------------
// Payloads
// ---------------------------------------------------------------------------

/** Empty or missing text is stored as null. */
export const normalizeText = (value: string | null | undefined) =>
  value ? value : null;

/** Stats are stored with 2 decimals. */
export const roundStats = (stats: Readonly<Record<string, number>>) =>
  Object.fromEntries(
    Object.entries(stats).map(([key, value]) => [
      key,
      Math.round(value * 100) / 100,
    ]),
  );

/** Path of the first failing value of a decoding issue. */
export const firstIssuePath = (
  issue: SchemaIssue.Issue,
): ReadonlyArray<PropertyKey> => {
  switch (issue._tag) {
    case 'Pointer':
      return [...issue.path, ...firstIssuePath(issue.issue)];
    case 'Filter':
    case 'Encoding':
      return firstIssuePath(issue.issue);
    case 'Composite':
    case 'AnyOf':
      return issue.issues[0] ? firstIssuePath(issue.issues[0]) : [];
    default:
      return [];
  }
};

/** Maps the first failing field of a payload to a stable error code. */
export const payloadErrorCode = (
  issue: SchemaIssue.Issue,
): CommunityErrorCode => {
  switch (firstIssuePath(issue)[0]) {
    case 'title':
      return 'INVALID_TITLE';
    case 'description':
      return 'INVALID_DESCRIPTION';
    case 'specialization':
    case 'detected_specialization':
      return 'INVALID_SPECIALIZATION';
    case 'stats':
      return 'INVALID_STATS';
    default:
      return 'INVALID_PAYLOAD';
  }
};

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

export interface SearchParams {
  query?: string;
  specializations?: ReadonlyArray<string>;
  minRating?: number;
  races?: ReadonlyArray<string>;
  genders?: ReadonlyArray<string>;
  weaponTypes?: ReadonlyArray<string>;
  healOnly?: boolean;
  /** undefined = current version, '*' = all versions. */
  gameVersion?: string;
  statMin?: Readonly<Record<string, number>>;
  implants?: ReadonlyArray<string>;
  drugIds?: ReadonlyArray<string>;
  itemIds?: ReadonlyArray<string>;
  favoritesOnly?: boolean;
  ids?: ReadonlyArray<string>;
  sort?: string;
  limit: number;
  offset: number;
}

export const searchQueryToParams = (query: SearchQuery): SearchParams => ({
  query: query.q,
  specializations: query.spec,
  minRating: query.minRating,
  races: query.race,
  genders: query.gender,
  weaponTypes: query.weapon,
  healOnly: query.heal,
  gameVersion: query.version,
  statMin: query.minStats,
  implants: query.implants,
  drugIds: query.drugs,
  itemIds: query.items,
  favoritesOnly: query.favorites,
  sort: query.sort,
  limit: query.pageSize,
  offset: (query.page - 1) * query.pageSize,
});

/** Filters that require reading the publication content (subscribers). */
export const hasAdvancedFilters = (query: SearchQuery): boolean =>
  Object.keys(query.minStats).length > 0 ||
  query.implants.length > 0 ||
  query.drugs.length > 0 ||
  query.items.length > 0 ||
  query.favorites;

const toNumberOrNull = (value: number | string | null): number | null =>
  value === null ? null : Number(value);

export const toSummaryDto = (
  row: PreviewRow & Pick<SearchRow, 'stats' | 'is_mine' | 'is_favorite'>,
): BuildSummary => ({
  id: row.id,
  title: row.title,
  description: row.description,
  specialization: row.specialization,
  detected_specialization: row.detected_specialization,
  game_version: row.game_version,
  race: row.race,
  gender: row.gender,
  weapon_types: row.weapon_types ?? [],
  has_heal_weapon: row.has_heal_weapon,
  key_stats: (row.key_stats ?? []).map((entry) => ({
    stat: entry.stat,
    value: Number(entry.value),
  })),
  rating_count: row.rating_count,
  rating_avg: toNumberOrNull(row.rating_avg),
  published_at: row.published_at,
  content_updated_at: row.content_updated_at,
  author_pseudo: row.author_pseudo,
  stats: row.stats,
  is_mine: row.is_mine,
  is_favorite: row.is_favorite,
});

/** Locked preview of a publication (guest or non-subscriber). */
export const toPreviewSummaryDto = (row: PreviewRow): BuildSummary =>
  toSummaryDto({ ...row, stats: null, is_mine: false, is_favorite: false });

/** Search results in the order of the similarity ranking. */
export const orderBySimilarity = (
  similarities: ReadonlyArray<SimilarityRow>,
  rows: ReadonlyArray<SearchRow>,
) => {
  const summaries = new Map(rows.map((row) => [row.id, toSummaryDto(row)]));
  return similarities.flatMap((row) => {
    const summary = summaries.get(row.publication_id);
    return summary ? [{ ...summary, similarity: row.similarity }] : [];
  });
};

// ---------------------------------------------------------------------------
// Reviews, publications, copies
// ---------------------------------------------------------------------------

export const toReviewDto = (
  row: ReviewRow,
  pseudo: string,
  userId: string,
  contentUpdatedAt: string,
): Review => ({
  id: row.id,
  stars: row.stars,
  body: row.body,
  created_at: row.created_at,
  updated_at: row.updated_at,
  reviewer_pseudo: pseudo,
  is_mine: row.reviewer_id === userId,
  outdated: new Date(row.updated_at) < new Date(contentUpdatedAt),
});

export const toMyPublicationDto = (
  row: PublicationRow,
  slotOfBuild: ReadonlyMap<string, number>,
  frozen: boolean,
): MyPublication => ({
  id: row.id,
  title: row.title,
  description: row.description,
  specialization: row.specialization,
  source_slot: row.source_build_id
    ? (slotOfBuild.get(row.source_build_id) ?? null)
    : null,
  game_version: row.game_version,
  rating_count: row.rating_count,
  rating_avg: toNumberOrNull(row.rating_avg),
  published_at: row.published_at,
  content_updated_at: row.content_updated_at,
  frozen,
});

/** 1-based slot of each build id (builds in creation order). */
export const slotsById = (builds: ReadonlyArray<{ id: string }>) =>
  new Map(builds.map((build, index) => [build.id, index + 1]));

const COPY_SUFFIX = ' (copie)';

/** Name of a copied build, within the title length limit. */
export const copyName = (title: string) =>
  `${title.slice(0, TITLE_MAX_LENGTH - COPY_SUFFIX.length)}${COPY_SUFFIX}`;
