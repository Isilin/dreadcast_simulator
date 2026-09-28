import type { BuildDetail } from '@server/feature/community/community.schema';
import { Effect, Exit, Schema } from 'effect';

import type { DecodedBuildDetail } from './community.mapper';

import { ItemSpotValue } from '@/domain';
import { ImplantNameValues } from '@/feature/implant';
import type { BuildSnapshot } from '@/feature/persistence';
import { RaceTypeValues } from '@/feature/profile';

/** Shape accepted from a published snapshot (the API keeps it opaque). */
const PublishedSnapshot = Schema.Struct({
  name: Schema.optional(Schema.String),
  profile: Schema.Struct({
    race: Schema.Literals(RaceTypeValues),
    gender: Schema.Literals(['male', 'female']),
  }),
  implants: Schema.optional(Schema.Record(Schema.String, Schema.Number)),
  items: Schema.optional(
    Schema.Record(
      Schema.String,
      Schema.NullOr(
        Schema.Struct({
          id: Schema.String,
          damageBonus: Schema.optional(
            Schema.Int.check(Schema.isBetween({ minimum: 0, maximum: 5 })),
          ),
        }),
      ),
    ),
  ),
  kits: Schema.optional(
    Schema.Record(
      Schema.String,
      Schema.Array(
        Schema.Struct({
          id: Schema.String,
          number: Schema.Int.check(Schema.isGreaterThanOrEqualTo(0)),
        }),
      ),
    ),
  ),
  drug: Schema.optional(Schema.NullOr(Schema.String)),
  titles: Schema.optional(Schema.Array(Schema.String)),
});

/**
 * Community snapshots are untrusted JSON: validate them, then normalize them
 * to a complete BuildSnapshot (every spot and implant present) instead of
 * casting. Fails with a SchemaError (invalid payload).
 */
export const decodeCommunitySnapshot = (snapshot: unknown) =>
  Schema.decodeUnknownEffect(PublishedSnapshot)(snapshot).pipe(
    Effect.map(
      (published): BuildSnapshot => ({
        name: published.name,
        profile: published.profile,
        implants: Object.fromEntries(
          ImplantNameValues.map((name) => [
            name,
            published.implants?.[name] ?? 0,
          ]),
        ) as BuildSnapshot['implants'],
        items: Object.fromEntries(
          ItemSpotValue.map((spot) => [spot, published.items?.[spot] ?? null]),
        ) as BuildSnapshot['items'],
        kits: Object.fromEntries(
          ItemSpotValue.map((spot) => [spot, published.kits?.[spot] ?? []]),
        ) as BuildSnapshot['kits'],
        drug: published.drug ?? null,
        titles: [...new Set(published.titles ?? [])].sort(),
      }),
    ),
  );

/** Synchronous variant: null when the snapshot is invalid. */
export const toBuildSnapshot = (snapshot: unknown): BuildSnapshot | null => {
  const exit = Effect.runSyncExit(decodeCommunitySnapshot(snapshot));
  return Exit.isSuccess(exit) ? exit.value : null;
};

/** Build detail with its snapshot decoded (null content when locked). */
export const withDecodedSnapshot = <E, R>(
  detail: Effect.Effect<BuildDetail, E, R>,
): Effect.Effect<DecodedBuildDetail, E | Schema.SchemaError, R> =>
  Effect.flatMap(
    detail,
    (dto): Effect.Effect<DecodedBuildDetail, Schema.SchemaError> =>
      dto.content
        ? decodeCommunitySnapshot(dto.content.snapshot).pipe(
            Effect.map((snapshot) => ({
              ...dto,
              content: { snapshot, stats: dto.content!.stats },
            })),
          )
        : Effect.succeed({ ...dto, content: null }),
  );
