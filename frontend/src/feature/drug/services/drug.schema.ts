import z from 'zod';

export const drugResponseDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.url(),
  sideEffects: z.array(
    z.object({
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
    }),
  ),
});

export const drugArrayResponseSchema = z.array(drugResponseDtoSchema);
