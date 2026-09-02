import z from 'zod';

const remoteBuildResponseSchema = z.object({
  slot: z.coerce.number().int().min(1),
  snapshot: z.record(z.string(), z.unknown()),
  saved_at: z.string().min(1),
});

export const remoteBuildArrayResponseSchema = z.array(
  remoteBuildResponseSchema,
);
export const remoteBuildResponseDtoSchema = remoteBuildResponseSchema;

export const createSharedBuildResponseSchema = z.object({
  id: z.uuid(),
});

export const sharedBuildResponseSchema = z.object({
  id: z.uuid(),
  slot: z.coerce.number().int().min(1),
  snapshot: z.record(z.string(), z.unknown()),
  saved_at: z.string().min(1),
  created_at: z.string().min(1),
});
