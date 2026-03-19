const Routes = {
  home: '/',
  connexion: '/connexion',
  abonnement: '/abonnement',
} as const;

type Routes = (typeof Routes)[keyof typeof Routes];

export default Routes;
