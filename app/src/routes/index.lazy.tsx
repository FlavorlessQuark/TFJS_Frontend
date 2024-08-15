import { useState } from "react";
import { createLazyFileRoute } from '@tanstack/react-router'
import { Authenticated, Unauthenticated, useAction, useQuery } from "convex/react";
import {UserMenu} from "@/components/UserMenu.tsx";
import {SignInForm} from "@/SignInForm.tsx";
import {Layout} from "@/Layout.tsx";
import {api} from "../../convex/_generated/api";

export const Route: any = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  const user = useQuery(api.users.viewer);
  const addModelAction = useAction(api.tensorflow_fn._createModelAction);
  const [modelCount, setCount] = useState<number>(0);

  const doAction = async () => {
    const res: number = await addModelAction({});
    setCount(res);
  };

  const handleButtonClick = () => {
    void doAction()
  };

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
            <button onClick={handleButtonClick}>Create model</button>
            <div>Total models created: {modelCount}</div>
          </Authenticated>
          <Unauthenticated>
            <SignInForm />
          </Unauthenticated>
        </>
      </Layout>
    </div>
  );
}
