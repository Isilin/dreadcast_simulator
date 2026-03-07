import z from 'zod';

import { ImplantNameValues } from '../model/implant.types';

export const implantResponseDtoSchema = z.object({
  name: z.enum(ImplantNameValues),
  attributes: z.array(
    z.enum([
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
  ),
  valuePerLevel: z.array(z.number()),
});

export const implantArrayResponseSchema = z.array(implantResponseDtoSchema);
