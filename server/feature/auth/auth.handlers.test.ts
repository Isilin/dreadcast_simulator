import { Effect } from 'effect';
import { describe, expect, it } from 'vitest';

import { Unauthorized } from '../../platform/http-errors.js';
import { makeTestApi } from '../../testing/test-api.js';

const request = makeTestApi({
  authGateway: {
    signInWithPassword: (email, password) =>
      password === 'secret'
        ? Effect.succeed({ accessToken: `at-${email}`, refreshToken: 'rt' })
        : Effect.fail(new Unauthorized({ error: 'Invalid login credentials' })),
  },
});

const login = (body: unknown) =>
  request('/api/auth/login', { method: 'POST', body });

describe('POST /api/auth/login', () => {
  it('returns the session tokens, never cached', async () => {
    const response = await login({
      email: 'zoe@example.com',
      password: 'secret',
    });

    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe(
      'no-store, no-cache, must-revalidate',
    );
    expect(await response.json()).toEqual({
      accessToken: 'at-zoe@example.com',
      refreshToken: 'rt',
    });
  });

  it('forwards the Supabase refusal as 401', async () => {
    const response = await login({ email: 'zoe@example.com', password: 'bad' });

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      error: 'Invalid login credentials',
    });
  });

  it('answers 400 with the legacy message on an invalid payload', async () => {
    const response = await login({ email: 'not-an-email', password: 'x' });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: 'Payload de connexion invalide',
    });
  });
});
