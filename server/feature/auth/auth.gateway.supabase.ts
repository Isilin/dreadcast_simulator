import type { AuthGateway } from './auth.gateway.js';
import { internalError, unauthorized } from '../../platform/http-errors.js';
import type { Supabase } from '../../platform/supabase.js';

/** Supabase Auth. */
export const makeAuthGateway = (supabase: Supabase): AuthGateway => ({
  signInWithPassword: async (email, password) => {
    let result: Awaited<
      ReturnType<ReturnType<Supabase['anon']>['auth']['signInWithPassword']>
    >;
    try {
      // Fresh client: it keeps the new session in memory.
      result = await supabase.anon().auth.signInWithPassword({
        email,
        password,
      });
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
