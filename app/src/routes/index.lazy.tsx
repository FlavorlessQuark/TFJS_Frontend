import { useState } from "react";
import { createLazyFileRoute } from '@tanstack/react-router'
import {
  Authenticated,
  Unauthenticated,
  useAction,
} from "convex/react";
import {SignInForm} from "@/SignInForm.tsx";
import {Layout} from "@/Layout"
import {api} from "../../convex/_generated/api";
import {Button} from "@/components/ui/button.tsx";

export const Route: any = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
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
    <div>
      <Authenticated>
          <Layout>
            <main className="flex flex-1 flex-col h-full gap-4 p-2 lg:gap-6 lg:p-6">
              {modelCount === 0 ? (
                  <div className="flex flex-1 items-center justify-center border border-dashed shadow-sm">
                    <div className="flex flex-col items-center gap-1 text-center">
                      <h3 className="text-2xl font-bold tracking-tight">
                        You have no models
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        You can start training as soon as you add a model!
                      </p>
                      <Button className="mt-4" onClick={handleButtonClick}>Add Model</Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-2">
                    clicked: {modelCount}
                  </div>
                )}
            </main>
          </Layout>
      </Authenticated>
      <Unauthenticated>
        <SignInForm/>
      </Unauthenticated>
    </div>
  );
}
