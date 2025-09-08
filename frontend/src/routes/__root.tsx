import { Outlet, Link, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" activeProps={{ className: 'font-bold' }}>
          Home
        </Link>{' '}
        <Link to="/sandbox" activeProps={{ className: 'font-bold' }}>
          Sandbox
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
