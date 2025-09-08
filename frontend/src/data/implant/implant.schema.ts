import z from 'zod';

import { ImplantNameValues } from '@/domain/implant';
import { StatValues } from '@/domain/skill';

export const implantResponseDtoSchema = z.object({
  name: z.enum(ImplantNameValues),
  attributes: z.array(z.enum(StatValues)),
  valuePerLevel: z.array(z.number()),
});

export const implantArrayResponseSchema = z.array(implantResponseDtoSchema);
