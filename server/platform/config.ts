export interface SupabaseConfig {
  readonly url: string;
  readonly anonKey: string;
}

/** Vercel exposes the Supabase integration under both names. */
const withPublicFallback = (
  env: Readonly<Record<string, string | undefined>>,
  name: string,
): string => {
  const value = env[name] ?? env[`NEXT_PUBLIC_${name}`];
  if (!value) {
    throw new Error(`Missing environment variable ${name}`);
  }
  return value;
};

export const readSupabaseConfig = (
  env: Readonly<Record<string, string | undefined>> = process.env,
): SupabaseConfig => ({
  url: withPublicFallback(env, 'SIMULATOR_SUPABASE_URL'),
  anonKey: withPublicFallback(env, 'SIMULATOR_SUPABASE_ANON_KEY'),
});
