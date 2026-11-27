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

/** Postgres connection: DATABASE_URL. */
export const readDatabaseConfig = (env: Env = process.env): DatabaseConfig => {
  const poolMax = Number(env.DATABASE_POOL_MAX ?? 10);
  if (!Number.isInteger(poolMax) || poolMax < 1) {
    throw new Error('DATABASE_POOL_MAX must be a positive integer');
  }
  return { url: required(env, 'DATABASE_URL'), poolMax };
};
