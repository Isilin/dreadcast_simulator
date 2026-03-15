import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/abonnement')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/abonnement"!</div>;
}
