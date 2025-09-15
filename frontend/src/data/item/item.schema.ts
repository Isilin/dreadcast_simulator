import z from 'zod';

export const itemResponseDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.url(),
  tech: z.number().min(0),
  integrity: z.number().min(0),
  type: z.enum([
    'head',
    'chest',
    'legs',
    'feet',
    'secondary',
    'left_arm',
    'right_arm',
  ]),
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
});

export const itemArrayResponseSchema = z.array(itemResponseDtoSchema);
