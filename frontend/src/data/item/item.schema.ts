import z from 'zod';

export const itemResponseDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.url(),
  tech: z.number().min(0),
  integrity: z.number().min(0),
  type: z.enum(['head', 'chest', 'legs', 'feet', 'secondary', 'weapon']),
  prerequisites: z
    .array(
      z.object({
        skill: z.enum([
          'strength',
          'agility',
          'robustness',
          'perception',
          'stealth',
          'computing',
          'medicine',
          'engineering',
        ]),
        value: z.number().min(0),
      }),
    )
    .optional(),
  effects: z
    .array(
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
        ]),
        value: z.number(),
      }),
    )
    .optional(),
  minDamage: z.number().min(0).optional(),
  maxDamage: z.number().min(0).optional(),
  hands: z.number().min(0).max(2).optional(),
  reach: z.number().min(0).max(14).optional(),
  hitsPerRound: z.number().min(0).optional(),
});

export const itemArrayResponseSchema = z.array(itemResponseDtoSchema);
