import { createFileRoute } from '@tanstack/react-router';

import './App.css';

import { BuildWorkbench } from '@/feature/build';
import Routes from '@/utils/routes';

export const Route = createFileRoute(Routes.home)({
  component: RouteComponent,
});

function RouteComponent() {
  return <BuildWorkbench />;
}
