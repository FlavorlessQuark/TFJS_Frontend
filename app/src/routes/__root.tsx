import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient } from '@tanstack/react-query';
import {Authenticated, Unauthenticated} from "convex/react";
import {Layout} from "@/Layout.tsx";
import {SignInForm} from "@/SignInForm.tsx";
import {TooltipProvider} from "@/components/ui/tooltip.tsx";

export const Route: any = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: () => (
    <>
      <Authenticated>
        <TooltipProvider>
          <Layout>
            <Outlet />

            {/* Use this for Dev only */}
            {/* <ReactQueryDevtools buttonPosition="top-right" />
            <TanStackRouterDevtools position="bottom-right" /> */}
          </Layout>
        </TooltipProvider>
      </Authenticated>
      <Unauthenticated>
        <div className="h-screen w-screen flex justify-center items-center flex-col">
          <div className={'flex flex-row justify-start items-center space-x-2 mb-2'}>
            <img src="./flowvex.png" alt="convex" className={'h-8 w-8'} />
            <h1 className="text-2xl font-normal card-title">Flowvex</h1>
          </div>
          <SignInForm/>
        </div>
      </Unauthenticated>
    </>
  ),
})
