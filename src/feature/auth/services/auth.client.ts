import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ??
  import.meta.env.NEXT_PUBLIC_SIMULATOR_SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  import.meta.env.NEXT_PUBLIC_SIMULATOR_SUPABASE_ANON_KEY;

export const hasSupabaseAuthConfig =
  Boolean(supabaseUrl) && Boolean(supabaseAnonKey);

export const supabaseClient = hasSupabaseAuthConfig
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null;
