import { sql, type SQL } from 'drizzle-orm';

/**
 * Postgres array literal of `values` ('{"a","b"}'), null for null: one
 * parameter whatever the driver, cast in the query (`::text[]`).
 */
export const arrayLiteral = (
  values: ReadonlyArray<string> | null,
): string | null =>
  values === null
    ? null
    : `{${values
        .map(
          (value) =>
            `"${value.replaceAll('\\', '\\\\').replaceAll('"', '\\"')}"`,
        )
        .join(',')}}`;

/** JSON parameter, cast in the query (`::jsonb`). */
export const jsonParam = (value: unknown): string | null =>
  value === null || value === undefined ? null : JSON.stringify(value);

/**
 * Rows of a set-returning function as JSON objects (`to_jsonb`): the values
 * PostgREST served (JSON numbers, ISO timestamps, arrays).
 */
export const jsonRows = (call: SQL) =>
  sql<{ row: unknown }>`select to_jsonb(r) as row from ${call} as r`;
