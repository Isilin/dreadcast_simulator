import { Tooltip } from '@base-ui-components/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import '@/styles/helpers.css';
import '@/styles/theme.css';
import './index.css';

import { ImplantsProvider } from './feature/implant';
import { ItemsProvider } from './feature/item';
import { KitsProvider } from './feature/kit';
import { BuildTabs } from './feature/persistence/ui';
import { ProfileProvider } from './feature/profile';
import { routeTree } from './routeTree.gen';
const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient();

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <title>DreadCast Simulator</title>
      <meta
        name="description"
        content="Compose ton build, compare les stats et partage un lien."
      />

      <meta
        property="og:url"
        content="https://dreadcast-simulator-kappa.vercel.app/"
      />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Construis ton équipement" />
      <meta
        property="og:description"
        content="Compose ton build, compare les stats et partage un lien."
      />
      <meta
        property="og:image"
        content="https://opengraph.b-cdn.net/production/images/849b1e80-62a3-4848-b661-99984376e3ef.png?token=ir-CtzjHBYyyyNNCrkZjJe3MO5K2SfWhv9HaZ8Fu7YY&height=656&width=1200&expires=33297405378"
      />

      <meta name="twitter:card" content="summary_large_image" />
      <meta
        property="twitter:domain"
        content="dreadcast-simulator-kappa.vercel.app"
      />
      <meta
        property="twitter:url"
        content="https://dreadcast-simulator-kappa.vercel.app/"
      />
      <meta name="twitter:title" content="Construis ton équipement" />
      <meta
        name="twitter:description"
        content="Compose ton build, compare les stats et partage un lien."
      />
      <meta
        name="twitter:image"
        content="https://opengraph.b-cdn.net/production/images/849b1e80-62a3-4848-b661-99984376e3ef.png?token=ir-CtzjHBYyyyNNCrkZjJe3MO5K2SfWhv9HaZ8Fu7YY&height=656&width=1200&expires=33297405378"
      />

      <QueryClientProvider client={queryClient}>
        <Tooltip.Provider>
          <ImplantsProvider>
            <ItemsProvider>
              <KitsProvider>
                <ProfileProvider>
                  <RouterProvider router={router} />
                  <BuildTabs />
                </ProfileProvider>
              </KitsProvider>
            </ItemsProvider>
          </ImplantsProvider>
        </Tooltip.Provider>
      </QueryClientProvider>
    </StrictMode>,
  );
}
