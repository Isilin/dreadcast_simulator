import z from 'zod';

import { ImplantNameValues, StatValues } from '@/domain';

export const implantResponseDtoSchema = z.object({
  name: z.enum(ImplantNameValues),
  attributes: z.array(z.enum(StatValues)),
  valuePerLevel: z.array(z.number()),
});

export const implantArrayResponseSchema = z.array(implantResponseDtoSchema);
