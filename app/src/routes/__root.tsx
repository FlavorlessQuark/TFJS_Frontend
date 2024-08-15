import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import {Authenticated, Unauthenticated} from "convex/react";
import {Layout} from "@/Layout.tsx";
import {SignInForm} from "@/SignInForm.tsx";

export const Route: any = createRootRoute({
  component: () => (
    <>
      <Authenticated>
        <Layout>
          <Outlet />

          {/* Use this for Dev only */}
          <TanStackRouterDevtools />
        </Layout>
      </Authenticated>
      <Unauthenticated>
        <SignInForm/>
      </Unauthenticated>
    </>
  ),
})
