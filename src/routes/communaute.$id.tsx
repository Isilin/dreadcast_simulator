import { createFileRoute } from '@tanstack/react-router';

import { CommunityBuildDetail } from '@/feature/community';

export const Route = createFileRoute('/communaute/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  return <CommunityBuildDetail key={id} id={id} />;
}
