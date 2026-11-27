import { customType } from 'drizzle-orm/pg-core';

/**
 * Postgres text output of a timestamptz ("2026-09-28 12:34:56.789+00", the
 * session runs in UTC) to its JSON form ("2026-09-28T12:34:56.789+00:00"),
 * the one PostgREST served. Idempotent: values read from JSON (nested
 * relational queries) already have it.
 */
export const toJsonTimestamp = (value: string): string =>
  value.replace(' ', 'T').replace(/([+-]\d\d)$/, '$1:00');

/** timestamp with time zone, read as its JSON string. */
export const timestamptz = customType<{ data: string; driverData: string }>({
  dataType: () => 'timestamp with time zone',
  fromDriver: toJsonTimestamp,
});
