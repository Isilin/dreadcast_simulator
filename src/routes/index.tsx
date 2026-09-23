import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { lazy, Suspense, useEffect, useState } from 'react';

import './App.css';

import { Fallback } from '@/ui';
import Routes from '@/utils/routes';

const BuildWorkbench = lazy(() =>
  import('@/feature/build').then(({ BuildWorkbench: Workbench }) => ({
    default: Workbench,
  })),
);

interface HomeSearch {
  /** Slot to open, e.g. after copying a build from the Communauté. */
  slot?: number;
}

export const Route = createFileRoute(Routes.home)({
  validateSearch: (search: Record<string, unknown>): HomeSearch => {
    const slot = Number(search.slot);
    return Number.isInteger(slot) && slot > 0 ? { slot } : {};
  },
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { slot } = Route.useSearch();
  const [initialSlot] = useState(slot);

  // The slot is only an instruction for the first render: drop it from the
  // URL so that a reload reopens the last active slot instead.
  useEffect(() => {
    if (slot !== undefined) {
      void navigate({ to: Routes.home, search: {}, replace: true });
    }
  }, [navigate, slot]);

  return (
    <Suspense fallback={<Fallback />}>
      <BuildWorkbench initialSlot={initialSlot} />
    </Suspense>
  );
}
