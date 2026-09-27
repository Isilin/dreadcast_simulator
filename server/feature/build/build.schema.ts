import { Schema } from 'effect';

/** 1-based position of a build in the user's creation order. */
export const Slot = Schema.Int.check(Schema.isGreaterThanOrEqualTo(1));

export const Build = Schema.Struct({
  slot: Schema.Number,
  snapshot: Schema.Unknown,
  saved_at: Schema.String,
});

export const UpsertBuildPayload = Schema.Struct({
  slot: Slot,
  snapshot: Schema.Record(Schema.String, Schema.Unknown),
});

export type Build = typeof Build.Type;
