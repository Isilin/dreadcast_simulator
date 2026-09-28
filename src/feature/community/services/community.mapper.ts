import type {
  BuildDetail,
  BuildSummary,
  MetaResponse,
  MyPublication as MyPublicationDto,
  RecommendationsResponse,
  Review,
} from '@server/feature/community/community.schema';

import type {
  CommunityBuildDetailData,
  CommunityBuildSummary,
  CommunityMeta,
  CommunityRecommendations,
  CommunityReview,
  MyPublication,
} from '../model';

import { StatValues, type Stat } from '@/domain';
import type { BuildSnapshot } from '@/feature/persistence';

const STATS = Object.keys(StatValues) as Stat[];

/** Every stat, 0 when the API omits it. */
const toStats = (
  stats: Readonly<Record<string, number>>,
): Record<Stat, number> =>
  Object.fromEntries(STATS.map((stat) => [stat, stats[stat] ?? 0])) as Record<
    Stat,
    number
  >;

/** Detail whose snapshot went through decodeCommunitySnapshot. */
export type DecodedBuildDetail = Omit<BuildDetail, 'content'> & {
  content: {
    snapshot: BuildSnapshot;
    stats: Readonly<Record<string, number>>;
  } | null;
};

export const toSummaryDomain = (dto: BuildSummary): CommunityBuildSummary => ({
  id: dto.id,
  title: dto.title,
  description: dto.description,
  specialization: dto.specialization,
  detectedSpecialization: dto.detected_specialization,
  gameVersion: dto.game_version,
  race: dto.race,
  gender: dto.gender,
  weaponTypes: [...dto.weapon_types],
  hasHealWeapon: dto.has_heal_weapon,
  keyStats: dto.key_stats.map((entry) => ({ ...entry })),
  ratingCount: dto.rating_count,
  ratingAverage: dto.rating_avg,
  publishedAt: dto.published_at,
  contentUpdatedAt: dto.content_updated_at,
  authorPseudo: dto.author_pseudo,
  stats: dto.stats ? toStats(dto.stats) : null,
  isMine: dto.is_mine,
  isFavorite: dto.is_favorite,
});

export const toReviewDomain = (dto: Review): CommunityReview => ({
  id: dto.id,
  stars: dto.stars,
  body: dto.body,
  createdAt: dto.created_at,
  updatedAt: dto.updated_at,
  reviewerPseudo: dto.reviewer_pseudo,
  isMine: dto.is_mine,
  outdated: dto.outdated,
});

export const toDetailDomain = (
  dto: DecodedBuildDetail,
): CommunityBuildDetailData => ({
  summary: toSummaryDomain(dto.summary),
  content: dto.content
    ? { snapshot: dto.content.snapshot, stats: toStats(dto.content.stats) }
    : null,
  locked: dto.locked,
  isSubscriber: dto.is_subscriber,
  myReview: dto.my_review ? toReviewDomain(dto.my_review) : null,
});

export const toMyPublicationDomain = (
  dto: MyPublicationDto,
): MyPublication => ({
  id: dto.id,
  title: dto.title,
  description: dto.description,
  specialization: dto.specialization,
  sourceSlot: dto.source_slot === null ? null : String(dto.source_slot),
  gameVersion: dto.game_version,
  ratingCount: dto.rating_count,
  ratingAverage: dto.rating_avg,
  publishedAt: dto.published_at,
  contentUpdatedAt: dto.content_updated_at,
  frozen: dto.frozen,
});

export const toMetaDomain = (dto: typeof MetaResponse.Type): CommunityMeta => ({
  currentVersion: dto.current_version,
  versions: dto.versions.map((version) => ({
    code: version.code,
    label: version.label,
    releasedAt: version.released_at,
    isCurrent: version.is_current,
  })),
});

export const toRecommendationsDomain = (
  dto: RecommendationsResponse,
): CommunityRecommendations => ({
  items: dto.items.map((item) => ({
    ...toSummaryDomain(item),
    similarity: item.similarity,
  })),
  strategy: dto.strategy,
});
