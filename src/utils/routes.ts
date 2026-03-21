const Routes = {
  home: '/',
  connection: '/connection',
  subscription: '/subscription',
  shared: '/shared',
  sharedById: '/shared/$id',
} as const;

type Routes = (typeof Routes)[keyof typeof Routes];

export default Routes;
