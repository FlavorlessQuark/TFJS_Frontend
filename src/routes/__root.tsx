import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query';
import {Authenticated, Unauthenticated} from "convex/react";
import {Layout} from "@/Layout.tsx";
import {SignInForm} from "@/SignInForm.tsx";
import {TooltipProvider} from "@/components/ui/tooltip.tsx";
import { Separator } from '@/components/ui/separator';

export const Route: any = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: () => (
    <>
      <Authenticated>
        <TooltipProvider>
          <Layout>
            <Outlet />
          </Layout>
        </TooltipProvider>
      </Authenticated>
      <Unauthenticated>
        <div className="h-screen w-screen flex justify-center items-center flex-col">
          <div className="border border-purple-400 p-4 flex flex-col justify-center items-center w-[350px] md:w-[450px]">
            <div className={'flex flex-row justify-start items-center space-x-2'}>
              <img src="./flowvex.png" alt="convex" className={'h-8 w-8'} />
              <h1 className="text-2xl font-normal card-title">Flowvex</h1>
            </div>
            <Separator className="my-6" />
            <SignInForm />

          <div className="flex flex-row items-center w-full justify-around my-6">
            <span className="card-title hover:underline text-xs cursor-pointer">Privacy Policy</span>
            <span className="card-title hover:underline text-xs cursor-pointer">Terms of Service</span>
          </div>
          </div>
        </div>
      </Unauthenticated>
    </>
  ),
})
