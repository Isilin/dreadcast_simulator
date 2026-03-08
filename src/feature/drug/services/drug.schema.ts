import z from 'zod';

export const statModifierResponseDtoSchema = z.object({
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

export const drugResponseDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string(),
  stat_modifier: z.array(statModifierResponseDtoSchema),
});

export const drugArrayResponseSchema = z.array(drugResponseDtoSchema);

export type DrugResponseDto = z.infer<typeof drugResponseDtoSchema>;
export type DrugArrayResponseDto = z.infer<typeof drugArrayResponseSchema>;
