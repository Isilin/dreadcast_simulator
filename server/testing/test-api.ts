import { Effect, Layer } from 'effect';
import { HttpRouter } from 'effect/unstable/http';
import { afterAll } from 'vitest';

import { makeApiLayer } from '../api.layer.js';
import { AuthGateway } from '../feature/auth/auth.gateway.js';
import { BuildRepo } from '../feature/build/build.repo.js';
import { CatalogRepo } from '../feature/catalog/catalog.repo.js';
import { ProfileRepo } from '../feature/profile/profile.repo.js';
import { SubscriptionRepo } from '../feature/subscription/subscription.repo.js';
import { AuthenticationLive } from '../platform/auth.live.js';
import { Supabase, type SupabaseClient } from '../platform/supabase.js';

export const TEST_USER_ID = '11111111-1111-4111-8111-111111111111';
export const VALID_TOKEN = 'valid-token';

const notFaked = (name: string) =>
  Effect.die(new Error(`${name} is not faked in this test`));

/**
 * Supabase whose auth accepts VALID_TOKEN only. The real
 * AuthenticationLive runs on top of it.
 */
const FakeSupabase = Layer.succeed(Supabase, {
  anon: () => {
    throw new Error('Supabase.anon is not faked in this test');
  },
  forUser: (accessToken) =>
    ({
      auth: {
        getUser: async () =>
          accessToken === VALID_TOKEN
            ? { data: { user: { id: TEST_USER_ID } }, error: null }
            : { data: { user: null }, error: new Error('invalid JWT') },
      },
    }) as unknown as SupabaseClient,
});

interface Fakes {
  catalog?: CatalogRepo['Service'];
  builds?: BuildRepo['Service'];
  subscriptions?: SubscriptionRepo['Service'];
  profile?: ProfileRepo['Service'];
  authGateway?: AuthGateway['Service'];
}

const makeServices = (fakes: Fakes) =>
  Layer.mergeAll(
    AuthenticationLive.pipe(Layer.provide(FakeSupabase)),
    Layer.succeed(
      CatalogRepo,
      fakes.catalog ?? {
        items: notFaked('items'),
        kits: notFaked('kits'),
        implants: notFaked('implants'),
        races: notFaked('races'),
        titles: notFaked('titles'),
        drugs: notFaked('drugs'),
        drug: () => notFaked('drug'),
      },
    ),
    Layer.succeed(
      BuildRepo,
      fakes.builds ?? {
        listOrdered: notFaked('listOrdered'),
        update: () => notFaked('update'),
        insert: () => notFaked('insert'),
        remove: () => notFaked('remove'),
      },
    ),
    Layer.succeed(
      SubscriptionRepo,
      fakes.subscriptions ?? {
        activePlans: notFaked('activePlans'),
        activePlan: () => notFaked('activePlan'),
        listMine: notFaked('listMine'),
        create: () => notFaked('create'),
      },
    ),
    Layer.succeed(
      ProfileRepo,
      fakes.profile ?? {
        pseudo: notFaked('pseudo'),
        createPseudo: () => notFaked('createPseudo'),
      },
    ),
    Layer.succeed(
      AuthGateway,
      fakes.authGateway ?? {
        signInWithPassword: () => notFaked('signInWithPassword'),
      },
    ),
  );

/**
 * Web handler of the whole API over fake services, disposed after the file.
 * Returns a `request(path, init)` helper resolving to the Response.
 */
export const makeTestApi = (fakes: Fakes) => {
  const { handler, dispose } = HttpRouter.toWebHandler(
    makeApiLayer(makeServices(fakes)),
    { disableLogger: true },
  );
  afterAll(dispose);

  return (
    path: string,
    init: {
      method?: string;
      token?: string;
      authorization?: string;
      body?: unknown;
    } = {},
  ) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const authorization =
      init.authorization ?? (init.token ? `Bearer ${init.token}` : undefined);
    if (authorization) {
      headers.Authorization = authorization;
    }

    return handler(
      new Request(`http://api.test${path}`, {
        method: init.method ?? 'GET',
        headers,
        body: init.body === undefined ? undefined : JSON.stringify(init.body),
      }),
    );
  };
};
