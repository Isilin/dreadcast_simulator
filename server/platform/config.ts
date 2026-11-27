type Env = Readonly<Record<string, string | undefined>>;

export interface SupabaseConfig {
  readonly url: string;
  readonly anonKey: string;
}

const required = (env: Env, name: string): string => {
  const value = env[name];
  if (!value) {
    throw new Error(`Missing environment variable ${name}`);
  }
  return value;
};

/** Vercel exposes the Supabase integration under both names. */
const withPublicFallback = (env: Env, name: string): string =>
  required(env, env[name] ? name : `NEXT_PUBLIC_${name}`);

/** Supabase Auth (sign-in, session check) until our own sessions. */
export const readSupabaseConfig = (env: Env = process.env): SupabaseConfig => ({
  url: withPublicFallback(env, 'SIMULATOR_SUPABASE_URL'),
  anonKey: withPublicFallback(env, 'SIMULATOR_SUPABASE_ANON_KEY'),
});

export interface DatabaseConfig {
  readonly url: string;
  /** Connections of the pool (DATABASE_POOL_MAX, 10 by default). */
  readonly poolMax: number;
}

/**
 * `sslmode=require` as libpq means it (encrypted, certificate not checked):
 * node-postgres checks the certificate otherwise, and the Supabase pooler's
 * is signed by Supabase's own CA.
 */
const withLibpqSslModes = (url: string): string => {
  const parsed = new URL(url);
  if (
    parsed.searchParams.get('sslmode') === 'require' &&
    !parsed.searchParams.has('uselibpqcompat')
  ) {
    parsed.searchParams.set('uselibpqcompat', 'true');
  }
  return parsed.toString();
};

/**
 * Postgres connection: DATABASE_URL, else the pooled URL of the Vercel
 * Supabase integration (SIMULATOR_POSTGRES_URL).
 */
export const readDatabaseConfig = (env: Env = process.env): DatabaseConfig => {
  const poolMax = Number(env.DATABASE_POOL_MAX ?? 10);
  if (!Number.isInteger(poolMax) || poolMax < 1) {
    throw new Error('DATABASE_POOL_MAX must be a positive integer');
  }
  const url = required(
    env,
    env.DATABASE_URL ? 'DATABASE_URL' : 'SIMULATOR_POSTGRES_URL',
  );
  return { url: withLibpqSslModes(url), poolMax };
};
