import { createFileRoute } from '@tanstack/react-router';

import { SubscriptionPage } from '@/feature/subscription';

export const Route = createFileRoute('/subscription')({
  component: RouteComponent,
});

function RouteComponent() {
  return <SubscriptionPage />;
}
