import { Effect, Layer, Schema } from 'effect';
import { HttpRouter, HttpServer } from 'effect/unstable/http';
import {
  HttpApi,
  HttpApiBuilder,
  HttpApiEndpoint,
  HttpApiGroup,
} from 'effect/unstable/httpapi';
import { afterAll, describe, expect, it } from 'vitest';

import { Unprocessable } from './http-errors.js';
import {
  InvalidRequest,
  RequestValidation,
  RequestValidationLive,
} from './request-validation.js';

const payload = Schema.Struct({ title: Schema.String });
const success = Schema.Struct({ ok: Schema.Boolean });

class TestApi extends HttpApi.make('test')
  .add(
    HttpApiGroup.make('test')
      .add(
        HttpApiEndpoint.post('annotated', '/annotated', {
          payload,
          success,
        }).annotate(
          InvalidRequest,
          () =>
            new Unprocessable({
              error: 'Le titre est invalide.',
              code: 'INVALID_TITLE',
            }),
        ),
      )
      .add(HttpApiEndpoint.post('plain', '/plain', { payload, success })),
  )
  .middleware(RequestValidation) {}

const TestHandlers = HttpApiBuilder.group(TestApi, 'test', (handlers) =>
  handlers
    .handle('annotated', () => Effect.succeed({ ok: true }))
    .handle('plain', () => Effect.succeed({ ok: true })),
).pipe(Layer.provide(RequestValidationLive));

const { handler, dispose } = HttpRouter.toWebHandler(
  HttpApiBuilder.layer(TestApi).pipe(
    Layer.provide(TestHandlers),
    Layer.provide(HttpServer.layerServices),
  ),
  { disableLogger: true },
);

afterAll(dispose);

const post = (path: string, body: unknown) =>
  handler(
    new Request(`http://api.test${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  );

describe('RequestValidation', () => {
  it('lets valid payloads through', async () => {
    const response = await post('/annotated', { title: 'ok' });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  });

  it('maps a decoding failure with the endpoint annotation', async () => {
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
