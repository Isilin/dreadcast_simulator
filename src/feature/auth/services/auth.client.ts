import { createClient } from '@supabase/supabase-js';

import {
  hasSupabaseAuthConfig,
  missingConfigErrorMessage,
  supabaseAnonKey,
  supabaseUrl,
} from './auth.config';

export const supabaseClient = hasSupabaseAuthConfig
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null;

export const getSupabaseClient = async () => {
  if (!supabaseClient) {
    throw new Error(missingConfigErrorMessage);
  }

  return supabaseClient;
};
