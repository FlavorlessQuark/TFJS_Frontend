import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route: any = createRootRoute({
  component: () => (
    <>
      <Outlet />

      {/* Use this for Dev only */}
      <TanStackRouterDevtools />
    </>
  ),
})
