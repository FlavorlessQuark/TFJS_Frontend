import { createLazyFileRoute } from '@tanstack/react-router'
import {useQuery} from "convex/react";
import {api} from "../../convex/_generated/api";
import ContainerCard from "@/components/ContainerCard.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useGlobalState} from "@/providers/StateProvider.tsx";

export const Route: any = createLazyFileRoute('/community')({
  component: Index,
})

function Index() {
  const { setState } = useGlobalState();
  const containers = useQuery(api.container.getCommunityContainers) || [];

  return (
      <main className="flex flex-1 flex-col md:flex-row h-full gap-4 p-2 lg:gap-6 lg:p-6">
        {containers.length > 0 ? containers.map((container: any) => (
          <ContainerCard container={container} />
        )) : (
          <div className="flex flex-1 items-center justify-center border border-dashed shadow-sm rounded-lg">
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                There is no community models!
              </h3>
              <p className="text-sm text-muted-foreground">
                Create a model and share with everyone to show them how it's done!
              </p>
              <Button className="mt-4" onClick={() => setState("openContainerModal", true)}>Share a Model</Button>
            </div>
          </div>
        )}
      </main>
  );
}
