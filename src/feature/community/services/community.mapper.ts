import type {
  CommunityBuildDetailDto,
  CommunityBuildSummaryDto,
  CommunityMetaResponseDto,
  CommunityRecommendationsResponseDto,
  CommunityReviewDto,
  MyPublicationDto,
} from './community.schema';
import type {
  CommunityBuildDetailData,
  CommunityBuildSummary,
  CommunityMeta,
  CommunityRecommendations,
  CommunityReview,
  MyPublication,
} from '../model';

export const toSummaryDomain = (
  dto: CommunityBuildSummaryDto,
): CommunityBuildSummary => ({
  id: dto.id,
  title: dto.title,
  description: dto.description,
  specialization: dto.specialization,
  detectedSpecialization: dto.detected_specialization,
  gameVersion: dto.game_version,
  race: dto.race,
  gender: dto.gender,
  weaponTypes: dto.weapon_types,
  hasHealWeapon: dto.has_heal_weapon,
  keyStats: dto.key_stats,
  ratingCount: dto.rating_count,
  ratingAverage: dto.rating_avg,
  publishedAt: dto.published_at,
  contentUpdatedAt: dto.content_updated_at,
  authorPseudo: dto.author_pseudo,
  stats: dto.stats,
  isMine: dto.is_mine,
  isFavorite: dto.is_favorite,
});

export const toReviewDomain = (dto: CommunityReviewDto): CommunityReview => ({
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
  dto: CommunityBuildDetailDto,
): CommunityBuildDetailData => ({
  summary: toSummaryDomain(dto.summary),
  content: dto.content,
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

export const toMetaDomain = (dto: CommunityMetaResponseDto): CommunityMeta => ({
  currentVersion: dto.current_version,
  versions: dto.versions.map((version) => ({
    code: version.code,
    label: version.label,
    releasedAt: version.released_at,
    isCurrent: version.is_current,
  })),
});

export const toRecommendationsDomain = (
  dto: CommunityRecommendationsResponseDto,
): CommunityRecommendations => ({
  items: dto.items.map((item) => ({
    ...toSummaryDomain(item),
    similarity: item.similarity,
  })),
  strategy: dto.strategy,
});
