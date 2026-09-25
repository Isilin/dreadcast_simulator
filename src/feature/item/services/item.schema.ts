import z from 'zod';

import {
  implantPrerequisiteDtoSchema,
  titlePrerequisiteDtoSchema,
} from '@/feature/prerequisite/services/prerequisite.schema';

const statPropertySchema = z.enum([
  'strength',
  'agility',
  'robustness',
  'perception',
  'stealth',
  'computing',
  'medicine',
  'engineering',
  'health',
  'stamina',
  'integrity',
  'speed',
  'raceDamage',
  'hitRating',
  'teamHeal',
  'cacDamage',
  'criticalCacChance',
  'criticalCacDamage',
  'hitDamages',
  'criticalHitDamage',
]);

const itemStatModifierSchema = z.object({
  property: statPropertySchema,
  value: z.number(),
});

export const itemResponseDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string(),
  tech: z.number().min(0),
  integrity: z.number().min(0),
  type: z.enum([
    'head',
    'chest',
    'legs',
    'feet',
    'secondary',
    '1handShot',
    '2handsShot',
    '1handMelee',
    '2handsMelee',
  ]),
  min_damage: z.number().min(0).nullable(),
  max_damage: z.number().min(0).nullable(),
  // Optional: absent from API deployments older than the heal weapons.
  min_heal: z.number().min(0).nullable().optional(),
  max_heal: z.number().min(0).nullable().optional(),
  damage_bonus: z.number().min(0).max(5).nullable(),
  hands: z.number().min(1).max(2).nullable(),
  reach: z.number().min(0).max(14).nullable(),
  hits_per_round: z.number().min(0).nullable(),
  item_prerequisite: z.array(itemStatModifierSchema),
  // Optional: absent from API deployments older than these prerequisites.
  item_prerequisite_title: z.array(titlePrerequisiteDtoSchema).optional(),
  item_prerequisite_implant: z.array(implantPrerequisiteDtoSchema).optional(),
  item_effect: z.array(itemStatModifierSchema),
});

export type ItemResponseDto = z.infer<typeof itemResponseDtoSchema>;

export const itemArrayResponseSchema = z.array(itemResponseDtoSchema);
