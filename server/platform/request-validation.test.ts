import { createRoute, z } from '@hono/zod-openapi';
import { describe, expect, it } from 'vitest';

import { isHttpError, unprocessable } from './http-errors.js';
import { invalidRequestAs } from './request-validation.js';
import { featureRouter, jsonBody, jsonContent, middlewares } from './router.js';

const payload = z.object({ title: z.string() });
const success = z.object({ ok: z.boolean() });

const route = (path: string, annotated: boolean) =>
  createRoute({
    method: 'post',
    path,
    middleware: middlewares(
      invalidRequestAs((_, part) =>
        annotated
          ? unprocessable('Le titre est invalide.', 'INVALID_TITLE')
          : unprocessable(`unexpected ${part}`),
      ),
    ),
    request: { body: jsonBody(payload) },
    responses: { 200: jsonContent(success, 'OK') },
  });

const plainRoute = createRoute({
  method: 'post',
  path: '/plain',
  request: { body: jsonBody(payload) },
  responses: { 200: jsonContent(success, 'OK') },
});

const app = featureRouter()
  .openapi(route('/annotated', true), (c) => c.json({ ok: true }, 200))
  .openapi(plainRoute, (c) => c.json({ ok: true }, 200));

app.onError((error, c) =>
  isHttpError(error) ? c.json(error.body, error.status) : c.text('boom', 500),
);

const post = (path: string, body: unknown) =>
  app.request(`http://api.test${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

describe('request validation', () => {
  it('lets valid payloads through', async () => {
    const response = await post('/annotated', { title: 'ok' });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  });

  it('maps a validation failure with the route mapping', async () => {
    const response = await post('/annotated', { title: 42 });

    expect(response.status).toBe(422);
    expect(await response.json()).toEqual({
      error: 'Le titre est invalide.',
      code: 'INVALID_TITLE',
    });
  });

  it('falls back to a generic 400', async () => {
    const response = await post('/plain', {});

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: 'Requete invalide.',
      code: 'INVALID_PAYLOAD',
    });
  });
});
