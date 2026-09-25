import z from 'zod';

import { ItemSpotValue, StatValues, type Stat } from '@/domain';
import { ImplantNameValues } from '@/feature/implant';
import { ItemTypeValues } from '@/feature/item';
import type { BuildSnapshot } from '@/feature/persistence';
import { RaceTypeValues } from '@/feature/profile';

const STAT_KEYS = Object.keys(StatValues) as [Stat, ...Stat[]];
const statSchema = z.enum(STAT_KEYS);

const specializationSchema = z.enum([
  'medecin',
  'informaticien',
  'ingenieur',
  'combattant_cac',
  'tireur',
  'furtif',
  'tank',
  'soutien',
  'polyvalent',
]);

const statsSchema = z
  .record(z.string(), z.coerce.number())
  .transform(
    (stats) =>
      Object.fromEntries(
        STAT_KEYS.map((stat) => [stat, stats[stat] ?? 0]),
      ) as Record<Stat, number>,
  );

/**
 * Community snapshots are untrusted JSON: normalize them to a complete
 * BuildSnapshot (every spot and implant present) instead of casting.
 */
export const communitySnapshotSchema = z
  .object({
    name: z.string().optional(),
    profile: z.object({
      race: z.enum(RaceTypeValues),
      gender: z.enum(['male', 'female']),
    }),
    implants: z.record(z.string(), z.number()).default({}),
    items: z
      .record(
        z.string(),
        z
          .object({
            id: z.string(),
            damageBonus: z.number().int().min(0).max(5).optional(),
          })
          .nullable(),
      )
      .default({}),
    kits: z
      .record(
        z.string(),
        z.array(z.object({ id: z.string(), number: z.number().int().min(0) })),
      )
      .default({}),
    drug: z.string().nullable().optional(),
    titles: z.array(z.string()).default([]),
  })
  .transform(
    (snapshot): BuildSnapshot => ({
      name: snapshot.name,
      profile: snapshot.profile,
      implants: Object.fromEntries(
        ImplantNameValues.map((name) => [name, snapshot.implants[name] ?? 0]),
      ) as BuildSnapshot['implants'],
      items: Object.fromEntries(
        ItemSpotValue.map((spot) => [spot, snapshot.items[spot] ?? null]),
      ) as BuildSnapshot['items'],
      kits: Object.fromEntries(
        ItemSpotValue.map((spot) => [spot, snapshot.kits[spot] ?? []]),
      ) as BuildSnapshot['kits'],
      drug: snapshot.drug ?? null,
      titles: [...new Set(snapshot.titles)].sort(),
    }),
  );

export const communityBuildSummaryDtoSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string().nullable(),
  specialization: specializationSchema,
  detected_specialization: specializationSchema,
  game_version: z.string(),
  race: z.enum(RaceTypeValues),
  gender: z.enum(['male', 'female']),
  weapon_types: z.array(z.enum(ItemTypeValues)),
  has_heal_weapon: z.boolean(),
  key_stats: z.array(z.object({ stat: statSchema, value: z.coerce.number() })),
  rating_count: z.coerce.number().int().min(0),
  rating_avg: z.coerce.number().nullable(),
  published_at: z.string(),
  content_updated_at: z.string(),
  author_pseudo: z.string(),
  stats: statsSchema.nullable(),
  is_mine: z.boolean(),
  is_favorite: z.boolean(),
});

export const communitySearchResponseDtoSchema = z.object({
  items: z.array(communityBuildSummaryDtoSchema),
  total: z.coerce.number().int().min(0),
  page: z.coerce.number().int().min(1),
  page_size: z.coerce.number().int().min(1),
});

export const communityReviewDtoSchema = z.object({
  id: z.uuid(),
  stars: z.number().int().min(1).max(5),
  body: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  reviewer_pseudo: z.string(),
  is_mine: z.boolean(),
  outdated: z.boolean(),
});

export const communityReviewsResponseDtoSchema = z.object({
  items: z.array(communityReviewDtoSchema),
  total: z.coerce.number().int().min(0),
  page: z.coerce.number().int().min(1),
  page_size: z.coerce.number().int().min(1),
});

export const communityBuildDetailDtoSchema = z.object({
  summary: communityBuildSummaryDtoSchema,
  content: z
    .object({
      snapshot: communitySnapshotSchema,
      stats: statsSchema,
    })
    .nullable(),
  locked: z.boolean(),
  is_subscriber: z.boolean(),
  my_review: communityReviewDtoSchema.nullable(),
});

export const myPublicationDtoSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string().nullable(),
  specialization: specializationSchema,
  source_slot: z.number().int().min(1).nullable(),
  game_version: z.string(),
  rating_count: z.coerce.number().int().min(0),
  rating_avg: z.coerce.number().nullable(),
  published_at: z.string(),
  content_updated_at: z.string(),
  frozen: z.boolean(),
});

export const myPublicationsResponseDtoSchema = z.array(myPublicationDtoSchema);

export const communityMetaResponseDtoSchema = z.object({
  current_version: z.string().nullable(),
  versions: z.array(
    z.object({
      code: z.string(),
      label: z.string(),
      released_at: z.string().nullable(),
      is_current: z.boolean(),
    }),
  ),
});

export const communityRecommendationsResponseDtoSchema = z.object({
  items: z.array(
    communityBuildSummaryDtoSchema.extend({
      similarity: z.number().nullable(),
    }),
  ),
  strategy: z.enum(['similar', 'trending']),
});

export const publishResponseDtoSchema = z.object({ id: z.uuid() });
export const copyResponseDtoSchema = z.object({
  slot: z.number().int().min(1),
});
export const favoriteResponseDtoSchema = z.object({ is_favorite: z.boolean() });

export type CommunityBuildSummaryDto = z.infer<
  typeof communityBuildSummaryDtoSchema
>;
export type CommunityReviewDto = z.infer<typeof communityReviewDtoSchema>;
export type CommunityBuildDetailDto = z.infer<
  typeof communityBuildDetailDtoSchema
>;
export type MyPublicationDto = z.infer<typeof myPublicationDtoSchema>;
export type CommunityMetaResponseDto = z.infer<
  typeof communityMetaResponseDtoSchema
>;
export type CommunityRecommendationsResponseDto = z.infer<
  typeof communityRecommendationsResponseDtoSchema
>;
