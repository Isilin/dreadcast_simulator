import { createFileRoute } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';

import './App.css';

import { Fallback } from '@/ui';
import Routes from '@/utils/routes';

const BuildWorkbench = lazy(() =>
  import('@/feature/build').then(({ BuildWorkbench: Workbench }) => ({
    default: Workbench,
  })),
);

export const Route = createFileRoute(Routes.home)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Suspense fallback={<Fallback />}>
      <BuildWorkbench />
    </Suspense>
  );
}
