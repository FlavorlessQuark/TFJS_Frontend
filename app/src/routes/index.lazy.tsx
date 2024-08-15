import { createLazyFileRoute } from '@tanstack/react-router'
import {Authenticated, Unauthenticated, useQuery} from "convex/react";
import {UserMenu} from "@/components/UserMenu.tsx";
import {SignInForm} from "@/SignInForm.tsx";
import {Layout} from "@/Layout.tsx";
import {api} from "../../convex/_generated/api";

export const Route: any = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  const user = useQuery(api.users.viewer);

  return (
    <div className="p-2">
      <Layout
        menu={
          <Authenticated>
            <UserMenu>{user?.name ?? user?.email}</UserMenu>
          </Authenticated>
        }
      >
        <>
          <Authenticated>
            <div>Authenticated</div>
          </Authenticated>
          <Unauthenticated>
            <SignInForm />
          </Unauthenticated>
        </>
      </Layout>
    </div>
  )
}
