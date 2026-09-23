import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { lazy, StrictMode, Suspense } from 'react';
import ReactDOM from 'react-dom/client';

import '@/styles/helpers.css';
import '@/styles/theme.css';
import './index.css';

import { routeTree } from './routeTree.gen';
import { ErrorBoundary } from './ui';

const router = createRouter({ routeTree });

const ReactQueryDevtools = lazy(async () => {
  const { ReactQueryDevtools: Devtools } =
    await import('@tanstack/react-query-devtools');
  return { default: Devtools };
});

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
          <RouterProvider router={router} />
          {import.meta.env.DEV ? (
            <Suspense fallback={null}>
              <ReactQueryDevtools initialIsOpen={false} />
            </Suspense>
          ) : null}
        </QueryClientProvider>
      </ErrorBoundary>
    </StrictMode>,
  );
}
