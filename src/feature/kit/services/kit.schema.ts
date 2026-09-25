import z from 'zod';

import {
  implantPrerequisiteDtoSchema,
  titlePrerequisiteDtoSchema,
} from '@/feature/prerequisite/services/prerequisite.schema';

const kitEffectSchema = z.object({
  property: z.enum([
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
  ]),
  value: z.number(),
});

export const kitResponseDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  tech: z.number().min(0),
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
  kit_effect: z.array(kitEffectSchema),
  // Optional: absent from API deployments older than the kit prerequisites.
  kit_prerequisite: z.array(kitEffectSchema).optional(),
  kit_prerequisite_title: z.array(titlePrerequisiteDtoSchema).optional(),
  kit_prerequisite_implant: z.array(implantPrerequisiteDtoSchema).optional(),
});

export type KitResponseDto = z.infer<typeof kitResponseDtoSchema>;

export const kitArrayResponseSchema = z.array(kitResponseDtoSchema);
