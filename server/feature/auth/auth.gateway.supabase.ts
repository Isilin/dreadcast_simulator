import type { AuthGateway } from './auth.gateway.js';
import { internalError, unauthorized } from '../../platform/http-errors.js';
import type { SupabaseAuth } from '../../platform/supabase.js';

/** Supabase Auth. */
export const makeAuthGateway = (auth: SupabaseAuth): AuthGateway => ({
  signInWithPassword: async (email, password) => {
    // Fresh client: it keeps the new session in memory.
    const client = auth.client();
    let result: Awaited<ReturnType<typeof client.auth.signInWithPassword>>;
    try {
      result = await client.auth.signInWithPassword({ email, password });
    } catch (cause) {
      throw internalError(
        cause instanceof Error ? cause.message : 'Erreur de connexion',
      );
    }

    const { data, error } = result;
    if (error || !data.session) {
      throw unauthorized(error?.message ?? 'Connexion refusée');
    }

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
    };
  },
});
