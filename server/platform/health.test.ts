import { describe, expect, it, vi } from 'vitest';

import { makeTestApi } from '../testing/test-api.js';

describe('GET /api/health', () => {
  it('answers ok when the database answers, never cached', async () => {
    const request = makeTestApi({ checkDatabase: async () => undefined });
    const response = await request('/api/health');

    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe(
      'no-store, no-cache, must-revalidate',
    );
    expect(await response.json()).toEqual({ status: 'ok' });
  });

  it('answers 503 without details when the database is down', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const request = makeTestApi({
      checkDatabase: () => Promise.reject(new Error('connection refused')),
    });
    const response = await request('/api/health');

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ status: 'error' });
  });
});
