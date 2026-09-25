import z from 'zod';

export const titleResponseDtoSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

export const titleArrayResponseSchema = z.array(titleResponseDtoSchema);

export type TitleResponseDto = z.infer<typeof titleResponseDtoSchema>;
