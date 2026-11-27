import { PGlite } from '@electric-sql/pglite';
import { pg_trgm } from '@electric-sql/pglite/contrib/pg_trgm';
import { drizzle } from 'drizzle-orm/pglite';
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { dbSchema, type Db } from '../client.js';
import { migrate } from '../migrate.js';

export const MIGRATIONS_DIR = fileURLToPath(
  new URL('../migrations', import.meta.url),
);
const SEEDS_DIR = fileURLToPath(
  new URL('../../../supabase/seeds', import.meta.url),
);

export interface TestDb {
  /** Application database: queries go through withAnon / withUser. */
  readonly db: Db;
  /** Superuser connection, for fixtures that bypass row level security. */
  readonly admin: PGlite;
  readonly close: () => Promise<void>;
}

const migratedImage = async (seed: boolean): Promise<Blob> => {
  const client = await PGlite.create({ extensions: { pg_trgm } });
  await migrate(
    {
      query: (text, params) => client.query(text, params as Array<unknown>),
      exec: (text) => client.exec(text),
    },
    MIGRATIONS_DIR,
  );
  if (seed) {
    for (const file of (await readdir(SEEDS_DIR)).sort()) {
      await client.exec(await readFile(`${SEEDS_DIR}/${file}`, 'utf8'));
    }
  }
  const image = await client.dumpDataDir('none');
  await client.close();
  return image;
};

// Migrating takes seconds: done once per test file and seed option, each
// database then starts from a copy.
const images = new Map<boolean, Promise<Blob>>();

/** A fresh in-memory Postgres (PGlite), migrated and seeded by default. */
export const makeTestDb = async ({
  seed = true,
}: { seed?: boolean } = {}): Promise<TestDb> => {
  let image = images.get(seed);
  if (!image) {
    image = migratedImage(seed);
    images.set(seed, image);
  }
  const admin = await PGlite.create({
    extensions: { pg_trgm },
    loadDataDir: await image,
  });
  return {
    db: drizzle(admin, { schema: dbSchema }) as unknown as Db,
    admin,
    close: () => admin.close(),
  };
};

/** Claims of a user without admin metadata. */
export const userClaims = (userId: string) => ({
  userId,
  email: `${userId}@example.com`,
  appMetadata: {},
});

/** An active plan (admins create them). */
export const createPlan = async (
  { admin }: TestDb,
  code = 'month',
): Promise<void> => {
  await admin.query(
    `INSERT INTO public.subscription_plan
       (code, label, duration_ingame_years, price_cents, sort_order, is_active)
     VALUES ($1, 'Un mois', 1, 1000, 1, true)`,
    [code],
  );
};

/** A validated, running subscription (as validated by an admin). */
export const subscribe = async (
  { admin }: TestDb,
  userId: string,
  planCode = 'month',
): Promise<void> => {
  await admin.query(
    `INSERT INTO public.subscription
       (user_id, plan_code, plan_name, price_cents, starts_at, ends_at, status, validated_at)
     VALUES ($1, $2, 'Un mois', 1000, now() - interval '1 day', now() + interval '30 days', 'validated', now())`,
    [userId, planCode],
  );
};

/** Creates an account (auth.users) and returns its id. */
export const createUser = async (
  { admin }: TestDb,
  email: string,
  appMetadata: Readonly<Record<string, unknown>> = {},
  passwordHash: string | null = null,
): Promise<string> => {
  const { rows } = await admin.query<{ id: string }>(
    'INSERT INTO auth.users (email, raw_app_meta_data, encrypted_password) VALUES ($1, $2, $3) RETURNING id',
    [email, appMetadata, passwordHash],
  );
  const [row] = rows;
  if (!row) {
    throw new Error('User not created');
  }
  return row.id;
};
