import { createApp } from '../app.js';
import type { Deps } from '../deps.js';
import type { AuthGateway } from '../feature/auth/auth.gateway.js';
import type { BuildRepo } from '../feature/build/build.repo.js';
import type { CatalogRepo } from '../feature/catalog/catalog.repo.js';
import type {
  CommunityPublicRepo,
  CommunityRepo,
  ReviewRepo,
} from '../feature/community/community.repo.js';
import type { ProfileRepo } from '../feature/profile/profile.repo.js';
import type { SubscriptionRepo } from '../feature/subscription/subscription.repo.js';
import type { User } from '../platform/auth.js';
import type { SupabaseClient } from '../platform/supabase.js';

export const TEST_USER_ID = '11111111-1111-4111-8111-111111111111';
export const VALID_TOKEN = 'valid-token';

const notFaked = (name: string) => () =>
  Promise.reject(new Error(`${name} is not faked in this test`));

/** Only VALID_TOKEN is a session; the real auth middlewares run on top. */
const resolveUser = async (accessToken: string): Promise<User | null> =>
  accessToken === VALID_TOKEN
    ? { userId: TEST_USER_ID, supabase: {} as SupabaseClient }
    : null;

const catalogStub: CatalogRepo = {
  items: notFaked('items'),
  kits: notFaked('kits'),
  implants: notFaked('implants'),
  races: notFaked('races'),
  titles: notFaked('titles'),
  drugs: notFaked('drugs'),
  drug: notFaked('drug'),
};

const buildStub: BuildRepo = {
  listOrdered: notFaked('listOrdered'),
  update: notFaked('update'),
  insert: notFaked('insert'),
  remove: notFaked('remove'),
};

const subscriptionStub: SubscriptionRepo = {
  activePlans: notFaked('activePlans'),
  activePlan: notFaked('activePlan'),
  listMine: notFaked('listMine'),
  hasActive: notFaked('hasActive'),
  create: notFaked('create'),
};

const profileStub: ProfileRepo = {
  pseudo: notFaked('pseudo'),
  pseudosOf: notFaked('pseudosOf'),
  createPseudo: notFaked('createPseudo'),
};

const communityPublicStub: CommunityPublicRepo = {
  gameVersions: notFaked('gameVersions'),
  preview: notFaked('preview'),
};

const communityStub: CommunityRepo = {
  search: notFaked('search'),
  publish: notFaked('publish'),
  update: notFaked('update'),
  unpublish: notFaked('unpublish'),
  mine: notFaked('mine'),
  content: notFaked('content'),
  title: notFaked('title'),
  header: notFaked('header'),
  addFavorite: notFaked('addFavorite'),
  removeFavorite: notFaked('removeFavorite'),
  similar: notFaked('similar'),
  forYou: notFaked('forYou'),
};

const reviewStub: ReviewRepo = {
  mine: notFaked('mine'),
  page: notFaked('page'),
  update: notFaked('update'),
  insert: notFaked('insert'),
  remove: notFaked('remove'),
};

const authGatewayStub: AuthGateway = {
  signInWithPassword: notFaked('signInWithPassword'),
};

/** Partial fakes: unlisted methods reject when called (500). */
export interface Fakes {
  catalog?: Partial<CatalogRepo>;
  builds?: Partial<BuildRepo>;
  subscriptions?: Partial<SubscriptionRepo>;
  profile?: Partial<ProfileRepo>;
  community?: Partial<CommunityPublicRepo & CommunityRepo>;
  reviews?: Partial<ReviewRepo>;
  authGateway?: Partial<AuthGateway>;
  checkDatabase?: () => Promise<void>;
}

const makeDeps = (fakes: Fakes): Deps => {
  const { gameVersions, preview, ...community } = fakes.community ?? {};
  const publicFakes: Partial<CommunityPublicRepo> = {
    ...(gameVersions && { gameVersions }),
    ...(preview && { preview }),
  };

  return {
    resolveUser,
    authGateway: { ...authGatewayStub, ...fakes.authGateway },
    catalog: { ...catalogStub, ...fakes.catalog },
    communityPublic: { ...communityPublicStub, ...publicFakes },
    community: () => ({ ...communityStub, ...community }),
    reviews: () => ({ ...reviewStub, ...fakes.reviews }),
    builds: () => ({ ...buildStub, ...fakes.builds }),
    subscriptions: () => ({ ...subscriptionStub, ...fakes.subscriptions }),
    profiles: () => ({ ...profileStub, ...fakes.profile }),
    checkDatabase: fakes.checkDatabase ?? (async () => undefined),
  };
};

/**
 * The whole API over fake services. Returns a `request(path, init)` helper
 * resolving to the Response.
 */
export const makeTestApi = (fakes: Fakes) => {
  const app = createApp(makeDeps(fakes));

  return (
    path: string,
    init: {
      method?: string;
      token?: string;
      authorization?: string;
      body?: unknown;
      /** Sent as is (e.g. malformed JSON), instead of `body`. */
      rawBody?: string;
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

    return app.request(`http://api.test${path}`, {
      method: init.method ?? 'GET',
      headers,
      body:
        init.rawBody ??
        (init.body === undefined ? undefined : JSON.stringify(init.body)),
    });
  };
};
