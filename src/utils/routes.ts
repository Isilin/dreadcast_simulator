const Routes = {
  home: '/',
  connection: '/connection',
  subscription: '/subscription',
  community: '/communaute',
  communityById: '/communaute/$id',
} as const;

type Routes = (typeof Routes)[keyof typeof Routes];

export default Routes;
