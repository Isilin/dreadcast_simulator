import { z } from '@hono/zod-openapi';

/** 1-based position of a build in the user's creation order. */
export const Slot = z.number().int().min(1);

export const Build = z
  .object({
    slot: z.number(),
    snapshot: z.unknown(),
    saved_at: z.string(),
  })
  .openapi('Build');

export const UpsertBuildPayload = z.object({
  slot: Slot,
  snapshot: z.record(z.string(), z.unknown()),
});

/** `?slot=` of DELETE /builds (query values are strings). */
export const SlotQuery = z.object({
  slot: z.string().transform(Number).pipe(Slot),
});

export type Build = z.infer<typeof Build>;
