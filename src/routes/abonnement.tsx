import { createFileRoute } from '@tanstack/react-router';

import { SubscriptionPage } from '@/feature/subscription';
import Routes from '@/utils/routes';

export const Route = createFileRoute(Routes.abonnement)({
  component: RouteComponent,
});

function RouteComponent() {
  return <SubscriptionPage />;
}
