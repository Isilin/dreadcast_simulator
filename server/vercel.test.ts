import { describe, expect, it } from 'vitest';

import { toApiRequest } from './vercel.js';

describe('toApiRequest', () => {
  it('restores the original path and keeps the other query params', () => {
    const request = toApiRequest(
      new Request('https://app.test/api/server?__path=drugs&id=0'),
    );

    expect(request.url).toBe('https://app.test/api/drugs?id=0');
  });

  it('handles nested paths', () => {
    const request = toApiRequest(
      new Request(
        'https://app.test/api/server?__path=community/builds/abc/reviews&page=2',
      ),
    );

    expect(request.url).toBe(
      'https://app.test/api/community/builds/abc/reviews?page=2',
    );
  });

  it('keeps the method, headers and body', async () => {
    const request = toApiRequest(
      new Request('https://app.test/api/server?__path=builds', {
        method: 'PUT',
        headers: { Authorization: 'Bearer token' },
        body: JSON.stringify({ slot: 1 }),
      }),
    );

    expect(request.method).toBe('PUT');
    expect(request.headers.get('authorization')).toBe('Bearer token');
    expect(await request.json()).toEqual({ slot: 1 });
  });

  it('leaves a request without __path untouched', () => {
    const original = new Request('https://app.test/api/items');

    expect(toApiRequest(original)).toBe(original);
  });
});
