import z from 'zod';

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
});

export type KitResponseDto = z.infer<typeof kitResponseDtoSchema>;

export const kitArrayResponseSchema = z.array(kitResponseDtoSchema);
