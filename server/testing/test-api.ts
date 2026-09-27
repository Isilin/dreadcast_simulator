import { Effect, Layer } from 'effect';
import { HttpRouter } from 'effect/unstable/http';
import { afterAll } from 'vitest';

import { makeApiLayer } from '../api.layer.js';
import { AuthGateway } from '../feature/auth/auth.gateway.js';
import { BuildRepo } from '../feature/build/build.repo.js';
import { CatalogRepo } from '../feature/catalog/catalog.repo.js';
import {
  CommunityRepo,
  ReviewRepo,
} from '../feature/community/community.repo.js';
import { ProfileRepo } from '../feature/profile/profile.repo.js';
import { SubscriptionRepo } from '../feature/subscription/subscription.repo.js';
import {
  AuthenticationLive,
  OptionalAuthenticationLive,
} from '../platform/auth.live.js';
import { Supabase, type SupabaseClient } from '../platform/supabase.js';

export const TEST_USER_ID = '11111111-1111-4111-8111-111111111111';
export const VALID_TOKEN = 'valid-token';

const notFaked = (name: string) =>
  Effect.die(new Error(`${name} is not faked in this test`));

/**
 * Supabase whose auth accepts VALID_TOKEN only. The real authentication
 * middlewares run on top of it.
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

const catalogStub: CatalogRepo['Service'] = {
  items: notFaked('items'),
  kits: notFaked('kits'),
  implants: notFaked('implants'),
  races: notFaked('races'),
  titles: notFaked('titles'),
  drugs: notFaked('drugs'),
  drug: () => notFaked('drug'),
};

const buildStub: BuildRepo['Service'] = {
  listOrdered: notFaked('listOrdered'),
  update: () => notFaked('update'),
  insert: () => notFaked('insert'),
  remove: () => notFaked('remove'),
};

const subscriptionStub: SubscriptionRepo['Service'] = {
  activePlans: notFaked('activePlans'),
  activePlan: () => notFaked('activePlan'),
  listMine: notFaked('listMine'),
  hasActive: notFaked('hasActive'),
  create: () => notFaked('create'),
};

const profileStub: ProfileRepo['Service'] = {
  pseudo: notFaked('pseudo'),
  pseudosOf: () => notFaked('pseudosOf'),
  createPseudo: () => notFaked('createPseudo'),
};

const communityStub: CommunityRepo['Service'] = {
  gameVersions: notFaked('gameVersions'),
  preview: () => notFaked('preview'),
  search: () => notFaked('search'),
  publish: () => notFaked('publish'),
  update: () => notFaked('update'),
  unpublish: () => notFaked('unpublish'),
  mine: notFaked('mine'),
  content: () => notFaked('content'),
  title: () => notFaked('title'),
  header: () => notFaked('header'),
  addFavorite: () => notFaked('addFavorite'),
  removeFavorite: () => notFaked('removeFavorite'),
  similar: () => notFaked('similar'),
  forYou: () => notFaked('forYou'),
};

const reviewStub: ReviewRepo['Service'] = {
  mine: () => notFaked('mine'),
  page: () => notFaked('page'),
  update: () => notFaked('update'),
  insert: () => notFaked('insert'),
  remove: () => notFaked('remove'),
};

const authGatewayStub: AuthGateway['Service'] = {
  signInWithPassword: () => notFaked('signInWithPassword'),
};

/** Partial fakes: unlisted methods die when called. */
export interface Fakes {
  catalog?: Partial<CatalogRepo['Service']>;
  builds?: Partial<BuildRepo['Service']>;
  subscriptions?: Partial<SubscriptionRepo['Service']>;
  profile?: Partial<ProfileRepo['Service']>;
  community?: Partial<CommunityRepo['Service']>;
  reviews?: Partial<ReviewRepo['Service']>;
  authGateway?: Partial<AuthGateway['Service']>;
}

const makeServices = (fakes: Fakes) =>
  Layer.mergeAll(
    Layer.mergeAll(AuthenticationLive, OptionalAuthenticationLive).pipe(
      Layer.provide(FakeSupabase),
    ),
    Layer.succeed(CatalogRepo, { ...catalogStub, ...fakes.catalog }),
    Layer.succeed(BuildRepo, { ...buildStub, ...fakes.builds }),
    Layer.succeed(SubscriptionRepo, {
      ...subscriptionStub,
      ...fakes.subscriptions,
    }),
    Layer.succeed(ProfileRepo, { ...profileStub, ...fakes.profile }),
    Layer.succeed(CommunityRepo, { ...communityStub, ...fakes.community }),
    Layer.succeed(ReviewRepo, { ...reviewStub, ...fakes.reviews }),
    Layer.succeed(AuthGateway, { ...authGatewayStub, ...fakes.authGateway }),
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
