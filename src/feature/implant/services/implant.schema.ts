import z from 'zod';

import { ImplantNameValues } from '../model/implant.types';

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

export const implantResponseDtoSchema = z.object({
  name: z.enum(ImplantNameValues),
  level_max: z.coerce.number().int().min(1),
  implant_attribute: z.array(
    z.object({
      attribute: statPropertySchema,
    }),
  ),
  implant_value: z.array(
    z.object({
      level: z.coerce.number().int().min(1),
      value: z.coerce.number(),
    }),
  ),
});

export const implantArrayResponseSchema = z.array(implantResponseDtoSchema);

export type ImplantResponseDto = z.infer<typeof implantResponseDtoSchema>;
