import type { StatProperty } from './item.types.js';

export type SpecializationCode =
  | 'medecin'
  | 'informaticien'
  | 'ingenieur'
  | 'combattant_cac'
  | 'tireur'
  | 'furtif'
  | 'tank'
  | 'soutien'
  | 'polyvalent';

export type CommunitySort =
  | 'trending'
  | 'top'
  | 'recent'
  | 'most_reviewed'
  | 'updated';

export type CommunityStatsDto = Record<StatProperty, number>;

export interface CommunityKeyStatDto {
  stat: StatProperty;
  value: number;
}

export interface CommunityBuildSummaryDto {
  id: string;
  title: string;
  description: string | null;
  specialization: SpecializationCode;
  detected_specialization: SpecializationCode;
  game_version: string;
  race: string;
  gender: 'male' | 'female';
  weapon_types: string[];
  has_heal_weapon: boolean;
  key_stats: CommunityKeyStatDto[];
  rating_count: number;
  rating_avg: number | null;
  published_at: string;
  content_updated_at: string;
  author_pseudo: string;
  /** null when the caller cannot read the content (not a subscriber). */
  stats: CommunityStatsDto | null;
  is_mine: boolean;
  is_favorite: boolean;
}

export interface CommunitySearchResponseDto {
  items: CommunityBuildSummaryDto[];
  total: number;
  page: number;
  page_size: number;
}

export interface CommunityReviewDto {
  id: string;
  stars: number;
  body: string | null;
  created_at: string;
  updated_at: string;
  reviewer_pseudo: string;
  is_mine: boolean;
  /** Written before the last content update of the publication. */
  outdated: boolean;
}

export interface CommunityBuildDetailDto {
  summary: CommunityBuildSummaryDto;
  /** null when locked (caller is neither a subscriber nor the author). */
  content: {
    snapshot: unknown;
    stats: CommunityStatsDto;
  } | null;
  locked: boolean;
  is_subscriber: boolean;
  my_review: CommunityReviewDto | null;
}

export interface CommunityReviewsResponseDto {
  items: CommunityReviewDto[];
  total: number;
  page: number;
  page_size: number;
}

export interface MyPublicationDto {
  id: string;
  title: string;
  description: string | null;
  specialization: SpecializationCode;
  /** Current 1-based slot of the source build, null if it was deleted. */
  source_slot: number | null;
  game_version: string;
  rating_count: number;
  rating_avg: number | null;
  published_at: string;
  content_updated_at: string;
  /** Subscription expired: visible but cannot be updated. */
  frozen: boolean;
}

export interface GameVersionDto {
  code: string;
  label: string;
  released_at: string | null;
  is_current: boolean;
}

export interface CommunityMetaResponseDto {
  current_version: string | null;
  versions: GameVersionDto[];
}

export interface CommunityRecommendationDto extends CommunityBuildSummaryDto {
  similarity: number | null;
}

export interface CommunityRecommendationsResponseDto {
  items: CommunityRecommendationDto[];
  strategy: 'similar' | 'trending';
}

export interface PublishCommunityBuildResponseDto {
  id: string;
}

export interface CopyCommunityBuildResponseDto {
  slot: number;
}

export interface ProfileResponseDto {
  pseudo: string | null;
}

export interface ApiErrorDto {
  error: string;
  code?: string;
}
