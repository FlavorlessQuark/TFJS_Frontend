import { Layout } from "@/Layout";
import { SignInForm } from "@/SignInForm";
import { UserMenu } from "@/components/UserMenu";
import { Authenticated, Unauthenticated, useAction, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";

export default function App() {
  const user = useQuery(api.users.viewer);
  const addModelAction = useAction(api.tensorflow_fn._createModelAction);
  const [modelCount, setCount] = useState(0)

  const doAction = async () => {
    const res = await addModelAction({});

    setCount(res)
  }

  return (
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
          <button onClick={doAction}> Create model</button>
          <div> Total models created : {modelCount} </div>
        </Authenticated>
        <Unauthenticated>
          <SignInForm />
        </Unauthenticated>
      </>
    </Layout>
  );
}
