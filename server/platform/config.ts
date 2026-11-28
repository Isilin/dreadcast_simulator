type Env = Readonly<Record<string, string | undefined>>;

const required = (env: Env, name: string): string => {
  const value = env[name];
  if (!value) {
    throw new Error(`Missing environment variable ${name}`);
  }
  return value;
};

export interface DatabaseConfig {
  readonly url: string;
  /** Connections of the pool (DATABASE_POOL_MAX, 10 by default). */
  readonly poolMax: number;
}

/**
 * A postgres:// URL, checked at startup: any other URL (the Supabase API URL
 * for instance) would leave connections hanging. Errors never show the
 * password.
 */
const parsePostgresUrl = (name: string, value: string): URL => {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${name} is not a valid URL`);
  }
  if (url.protocol !== 'postgres:' && url.protocol !== 'postgresql:') {
    throw new Error(
      `${name} must be a postgres:// URL, got ${url.protocol}//${url.host}`,
    );
  }
  return url;
};

/**
 * `sslmode=require` as libpq means it (encrypted, certificate not checked):
 * node-postgres checks the certificate otherwise, and the Supabase pooler's
 * is signed by Supabase's own CA.
 */
const withLibpqSslModes = (url: URL): string => {
  if (
    url.searchParams.get('sslmode') === 'require' &&
    !url.searchParams.has('uselibpqcompat')
  ) {
    url.searchParams.set('uselibpqcompat', 'true');
  }
  return url.toString();
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
  const name = env.DATABASE_URL ? 'DATABASE_URL' : 'SIMULATOR_POSTGRES_URL';
  const url = parsePostgresUrl(name, required(env, name));
  return { url: withLibpqSslModes(url), poolMax };
};
