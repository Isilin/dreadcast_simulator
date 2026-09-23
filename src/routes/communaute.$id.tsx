import { createFileRoute } from '@tanstack/react-router';

import { CommunityBuildDetail } from '@/feature/community';
import Routes from '@/utils/routes';

export const Route = createFileRoute(Routes.communityById)({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  return <CommunityBuildDetail key={id} id={id} />;
}
