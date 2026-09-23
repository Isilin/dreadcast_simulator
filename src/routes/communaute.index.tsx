import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCallback, useMemo } from 'react';

import {
  CommunityPage,
  filtersToSearch,
  parseCommunitySearch,
  type CommunityFilters,
  type CommunityUrlSearch,
} from '@/feature/community';

export const Route = createFileRoute('/communaute/')({
  validateSearch: (search: Record<string, unknown>): CommunityUrlSearch =>
    filtersToSearch(parseCommunitySearch(search)),
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();
  const filters = useMemo(
    () => parseCommunitySearch(search as Record<string, unknown>),
    [search],
  );

  const handleFiltersChange = useCallback(
    (next: CommunityFilters) => {
      void navigate({
        search: filtersToSearch(next),
        // Typing and toggling filters replace the entry; pages are history.
        replace: next.page === filters.page,
      });
    },
    [filters.page, navigate],
  );

  return (
    <CommunityPage filters={filters} onFiltersChange={handleFiltersChange} />
  );
}
