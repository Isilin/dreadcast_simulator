import z from 'zod';

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
  damage_bonus: z.number().min(0).max(5).nullable(),
  hands: z.number().min(1).max(2).nullable(),
  reach: z.number().min(0).max(14).nullable(),
  hits_per_round: z.number().min(0).nullable(),
  item_prerequisite: z.array(itemStatModifierSchema),
  item_effect: z.array(itemStatModifierSchema),
});

export type ItemResponseDto = z.infer<typeof itemResponseDtoSchema>;

export const itemArrayResponseSchema = z.array(itemResponseDtoSchema);
