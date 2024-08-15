import { createLazyFileRoute } from '@tanstack/react-router'
import {useQuery} from "convex/react";
import {api} from "../../convex/_generated/api";
import ContainerCard from "@/components/ContainerCard.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useGlobalState} from "@/providers/StateProvider.tsx";

export const Route: any = createLazyFileRoute('/containers')({
  component: Index,
})

function Index() {
  const { setState } = useGlobalState();
  const containers = useQuery(api.container.getMyContainers) || [];

  return (
      <main className="flex flex-1 flex-col md:flex-row h-full gap-4 p-2 lg:gap-6 lg:p-6">
        {containers.length > 0 ? containers.map((container: any) => (
          <ContainerCard container={container} />
        )) : (
          <div className="flex flex-1 items-center justify-center border border-dashed shadow-sm">
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                You have no models
              </h3>
              <p className="text-sm text-muted-foreground">
                You can start training as soon as you add a model!
              </p>
              <Button className="mt-4" onClick={() => setState("openContainerModal", true)}>Add Model</Button>
            </div>
          </div>
        )}
      </main>
  );
}
