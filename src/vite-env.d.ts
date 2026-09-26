/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_SUBSCRIPTION_CREDITS_ADDRESS?: string;
  readonly NEXT_PUBLIC_SIMULATOR_SUPABASE_URL?: string;
  readonly NEXT_PUBLIC_SIMULATOR_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
