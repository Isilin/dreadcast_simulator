const Routes = {
  home: '/',
  connection: '/connection',
  subscription: '/subscription',
} as const;

type Routes = (typeof Routes)[keyof typeof Routes];

export default Routes;
