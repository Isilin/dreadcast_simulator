import { describe, expect, it } from 'vitest';

import { makeTestApi } from './testing/test-api.js';

const request = makeTestApi({});

describe('API documentation', () => {
  it('serves the OpenAPI document generated from the contract', async () => {
    const response = await request('/api/openapi.json');

    expect(response.status).toBe(200);
    const document = (await response.json()) as {
      info: { title: string };
      paths: Record<string, unknown>;
    };
    expect(document.info.title).toBe('Dreadcast Simulator API');
    expect(Object.keys(document.paths)).toEqual(
      expect.arrayContaining([
        '/api/items',
        '/api/builds',
        '/api/community/builds/{id}',
      ]),
    );
  });

  it('serves the reference page', async () => {
    const response = await request('/api/docs');

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/html');
    expect(await response.text()).toContain('Dreadcast Simulator API');
  });
});
