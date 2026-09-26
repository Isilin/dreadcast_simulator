import z from 'zod';

export const profileResponseDtoSchema = z.object({
  pseudo: z.string().min(1).nullable(),
});
