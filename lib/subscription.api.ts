import type { AuthenticatedSupabaseClient } from './helper.api.js';

export interface ActiveSubscriptionResult {
  isActive: boolean;
  error: { message: string } | null;
}

/**
 * Same rule as private.has_active_subscription(): validated and not expired.
 */
export const fetchHasActiveSubscription = async (
  supabase: AuthenticatedSupabaseClient,
  userId: string,
): Promise<ActiveSubscriptionResult> => {
  const { data, error } = await supabase
    .from('subscription')
    .select('id')
    .eq('user_id', userId)
    .eq('status', 'validated')
    .gte('ends_at', new Date().toISOString())
    .limit(1)
    .maybeSingle();

  return { isActive: Boolean(data), error };
};
