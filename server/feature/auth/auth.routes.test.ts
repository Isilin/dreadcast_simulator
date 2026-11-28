import { describe, expect, it, vi } from 'vitest';

import { tooManyRequests, unauthorized } from '../../platform/http-errors.js';
import {
  makeTestApi,
  TEST_USER_EMAIL,
  TEST_USER_ID,
  VALID_TOKEN,
} from '../../testing/test-api.js';

const signOut = vi.fn(async () => undefined);

const request = makeTestApi({
  auth: {
    signIn: async (email, password) => {
      if (email === 'blocked@example.com') {
        throw tooManyRequests('Trop de tentatives');
      }
      if (password !== 'secret') {
        throw unauthorized('Identifiants invalides.');
      }
      return {
        token: 'new-token',
        user: { userId: TEST_USER_ID, email, appMetadata: {} },
      };
    },
    signOut,
  },
});

const login = (body: unknown) =>
  request('/api/auth/login', { method: 'POST', body });

const SESSION_COOKIE_ATTRIBUTES =
  /; Max-Age=34560000; Path=\/api; HttpOnly; Secure; SameSite=Lax$/;

describe('POST /api/auth/login', () => {
  it('sets the session cookie and returns the user, never cached', async () => {
    const response = await login({
      email: 'zoe@example.com',
      password: 'secret',
    });

    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe(
      'no-store, no-cache, must-revalidate',
    );
    const cookie = response.headers.get('set-cookie') ?? '';
    expect(cookie.startsWith('dc_session=new-token')).toBe(true);
    expect(cookie).toMatch(SESSION_COOKIE_ATTRIBUTES);
    expect(await response.json()).toEqual({
      user: { id: TEST_USER_ID, email: 'zoe@example.com' },
    });
  });

  it('answers 401 on wrong credentials, without cookie', async () => {
    const response = await login({ email: 'zoe@example.com', password: 'bad' });

    expect(response.status).toBe(401);
    expect(response.headers.get('set-cookie')).toBeNull();
    expect(await response.json()).toEqual({
      error: 'Identifiants invalides.',
    });
  });

  it('answers 429 after too many failures', async () => {
    const response = await login({
      email: 'blocked@example.com',
      password: 'secret',
    });

    expect(response.status).toBe(429);
    expect(await response.json()).toEqual({ error: 'Trop de tentatives' });
  });

  it('answers 400 with the legacy message on an invalid payload', async () => {
    const response = await login({ email: 'not-an-email', password: 'x' });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: 'Payload de connexion invalide',
    });
  });

  it('answers the same 400 on malformed JSON', async () => {
    const response = await request('/api/auth/login', {
      method: 'POST',
      rawBody: '{bad json',
    });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: 'Payload de connexion invalide',
    });
  });
});

describe('GET /api/auth/me', () => {
  it('returns the user of the session cookie, never cached', async () => {
    const response = await request('/api/auth/me', { token: VALID_TOKEN });

    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe(
      'no-store, no-cache, must-revalidate',
    );
    expect(await response.json()).toEqual({
      user: { id: TEST_USER_ID, email: TEST_USER_EMAIL },
    });
  });

  it('answers 401 without session', async () => {
    const response = await request('/api/auth/me');
    expect(response.status).toBe(401);
  });
});

describe('POST /api/auth/logout', () => {
  it('ends the session and clears the cookie', async () => {
    const response = await request('/api/auth/logout', {
      method: 'POST',
      token: VALID_TOKEN,
    });

    expect(response.status).toBe(204);
    expect(signOut).toHaveBeenCalledWith(VALID_TOKEN);
    expect(response.headers.get('set-cookie')).toMatch(
      /^dc_session=; Max-Age=0; Path=\/api/,
    );
  });

  it('answers 204 without session too', async () => {
    signOut.mockClear();
    const response = await request('/api/auth/logout', { method: 'POST' });

    expect(response.status).toBe(204);
    expect(signOut).not.toHaveBeenCalled();
  });
});
