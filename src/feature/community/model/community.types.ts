import type { Specialization, Stat } from '@/domain';
import type { ItemType, WeaponHands, WeaponKind } from '@/feature/item';
import type { BuildSnapshot } from '@/feature/persistence';
import type { Gender, RaceType } from '@/feature/profile';

export {
  SPECIALIZATION_LABELS,
  SpecializationValues,
  type Specialization,
} from '@/domain';
export {
  WEAPON_KIND_LABELS,
  WeaponHandsValues,
  WeaponKindValues,
  type WeaponHands,
  type WeaponKind,
} from '@/feature/item';

export const CommunitySortValues = [
  'trending',
  'top',
  'recent',
  'most_reviewed',
  'updated',
] as const;
export type CommunitySort = (typeof CommunitySortValues)[number];

export const COMMUNITY_SORT_LABELS: Record<CommunitySort, string> = {
  trending: 'Tendance',
  top: 'Mieux notés',
  recent: 'Plus récents',
  most_reviewed: "Plus d'avis",
  updated: 'Mis à jour',
};

/** '*' = every game version. */
export const ALL_GAME_VERSIONS = '*';

export interface CommunityFilters {
  query: string;
  specializations: Specialization[];
  minRating: number | null;
  races: RaceType[];
  genders: Gender[];
  weaponKind: WeaponKind | null;
  weaponHands: WeaponHands | null;
  healOnly: boolean;
  /** null = current version, ALL_GAME_VERSIONS = all. */
  gameVersion: string | null;
  /** Subscriber-only filters. */
  minStats: Partial<Record<Stat, number>>;
  implants: string[];
  drugs: string[];
  items: string[];
  favoritesOnly: boolean;
  sort: CommunitySort;
  page: number;
}

export interface CommunityKeyStat {
  stat: Stat;
  value: number;
}

export interface CommunityBuildSummary {
  id: string;
  title: string;
  description: string | null;
  specialization: Specialization;
  detectedSpecialization: Specialization;
  gameVersion: string;
  race: RaceType;
  gender: Gender;
  weaponTypes: ItemType[];
  hasHealWeapon: boolean;
  keyStats: CommunityKeyStat[];
  ratingCount: number;
  ratingAverage: number | null;
  publishedAt: string;
  contentUpdatedAt: string;
  authorPseudo: string;
  /** null when the viewer is not a subscriber. */
  stats: Record<Stat, number> | null;
  isMine: boolean;
  isFavorite: boolean;
}

export interface CommunitySearchResult {
  items: CommunityBuildSummary[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CommunityReview {
  id: string;
  stars: number;
  body: string | null;
  createdAt: string;
  updatedAt: string;
  reviewerPseudo: string;
  isMine: boolean;
  /** Written before the last update of the publication. */
  outdated: boolean;
}

export interface CommunityReviewsPage {
  items: CommunityReview[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CommunityBuildDetailData {
  summary: CommunityBuildSummary;
  /** null when locked for the viewer. */
  content: {
    snapshot: BuildSnapshot;
    stats: Record<Stat, number>;
  } | null;
  locked: boolean;
  isSubscriber: boolean;
  myReview: CommunityReview | null;
}

export interface MyPublication {
  id: string;
  title: string;
  description: string | null;
  specialization: Specialization;
  sourceSlot: string | null;
  gameVersion: string;
  ratingCount: number;
  ratingAverage: number | null;
  publishedAt: string;
  contentUpdatedAt: string;
  frozen: boolean;
}

export interface GameVersion {
  code: string;
  label: string;
  releasedAt: string | null;
  isCurrent: boolean;
}

export interface CommunityMeta {
  currentVersion: string | null;
  versions: GameVersion[];
}

export interface CommunityRecommendation extends CommunityBuildSummary {
  similarity: number | null;
}

export interface CommunityRecommendations {
  items: CommunityRecommendation[];
  strategy: 'similar' | 'trending';
}

export interface PublishBuildPayload {
  slot: string;
  title: string;
  description: string | null;
  specialization: Specialization;
  detectedSpecialization: Specialization;
  stats: Record<Stat, number>;
}

export interface UpdatePublicationPayload {
  title: string;
  description: string | null;
  specialization: Specialization;
  /** Re-copies the source build ("Mettre à jour la publication"). */
  refresh: boolean;
  detectedSpecialization?: Specialization;
  stats?: Record<Stat, number>;
}

export interface ReviewPayload {
  stars: number;
  body: string | null;
}
