import { Tooltip } from '@base-ui-components/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import './theme.css';

import { routeTree } from './routeTree.gen';
import { SuitProvider } from './ui/providers/suit.provider';

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
      <QueryClientProvider client={queryClient}>
        <Tooltip.Provider>
          <SuitProvider>
            <RouterProvider router={router} />
          </SuitProvider>
        </Tooltip.Provider>
      </QueryClientProvider>
    </StrictMode>,
  );
}
