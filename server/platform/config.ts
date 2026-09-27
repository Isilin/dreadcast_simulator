import { Config } from 'effect';

/** Vercel exposes the Supabase integration under both names. */
const withPublicFallback = (name: string) =>
  Config.String(name).pipe(
    Config.orElse(() => Config.String(`NEXT_PUBLIC_${name}`)),
  );

export const SupabaseConfig = Config.all({
  url: withPublicFallback('SIMULATOR_SUPABASE_URL'),
  anonKey: withPublicFallback('SIMULATOR_SUPABASE_ANON_KEY'),
});
