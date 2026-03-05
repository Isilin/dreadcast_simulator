import { Tooltip } from '@base-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import '@/styles/helpers.css';
import '@/styles/theme.css';
import './index.css';

import { ImplantsProvider } from './feature/implant';
import { ItemsProvider } from './feature/item';
import { KitsProvider } from './feature/kit';
import { ProfileProvider } from './feature/profile';
import { routeTree } from './routeTree.gen';
import { ErrorBoundary } from './ui';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <Tooltip.Provider>
            <ImplantsProvider>
              <ItemsProvider>
                <KitsProvider>
                  <ProfileProvider>
                    <RouterProvider router={router} />
                  </ProfileProvider>
                </KitsProvider>
              </ItemsProvider>
            </ImplantsProvider>
          </Tooltip.Provider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ErrorBoundary>
    </StrictMode>,
  );
}
