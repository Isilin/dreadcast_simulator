const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ??
  import.meta.env.NEXT_PUBLIC_SIMULATOR_SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  import.meta.env.NEXT_PUBLIC_SIMULATOR_SUPABASE_ANON_KEY;

export const hasSupabaseAuthConfig =
  Boolean(supabaseUrl) && Boolean(supabaseAnonKey);

export const missingConfigErrorMessage =
  'Configuration Supabase manquante : définissez VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY ou NEXT_PUBLIC_SIMULATOR_SUPABASE_URL/NEXT_PUBLIC_SIMULATOR_SUPABASE_ANON_KEY.';

export const getMissingAuthConfigErrorMessage = () => missingConfigErrorMessage;

export const isAuthConfigured = () => hasSupabaseAuthConfig;

export { supabaseAnonKey, supabaseUrl };
