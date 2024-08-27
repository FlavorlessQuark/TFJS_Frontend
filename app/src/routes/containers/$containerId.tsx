import {createFileRoute} from '@tanstack/react-router'
import {
  Share,
  ThumbsUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {useMutation, useQuery} from "convex/react";
import {api} from "../../../convex/_generated/api";
import ModelDrawer from "@/components/container/mobile-drawer";
import ModelContainer from "@/components/container/model-container";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

export const Route: any = createFileRoute('/containers/$containerId')({
  component: ContainerId,
  loader: async ({ params }) => {
    return {
      containerId: params.containerId,
    }
  }
})

function ContainerId() {
  const { containerId } = Route.useParams();

  const container = useQuery(api.container.getContainer, { id: containerId }) || undefined;
  const addModel = useMutation(api.container.createContainerModel)
  const models = useQuery(api.container.getContainerModels,{id: containerId})
  const layerAttrs = useQuery(api.layers.getLayers)

  if (!container) {
    return;
  }

  console.log('Caontginer', container, models)

  return (
    <main className="grid h-full w-full">
        <div className="flex flex-col">
          <header className="sticky top-0 z-10 flex h-[53px] items-center gap-1 border-b bg-background px-4 w-full">
            <div className={'flex flex-row-items center space-x-4'}>
              <div className={'flex flex-row items-end space-x-1'}>
                <Avatar className={'h-6 w-6'}>
                  <AvatarImage src={container.creator.image} alt={container.creator.name} />
                  <AvatarFallback>{container.creator.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className={'text-zinc-500'}>{container.creator.name}</span>
                <span className="text-muted-foreground">/</span>
                <h1 className="text-xl font-semibold">{container.name}</h1>
              </div>
            </div>
            <ModelDrawer container={container} />
            <div className={'flex justify-end items-center ml-auto space-x-2'}>
            <Button size="sm" className={'text-xs gap-x-1'}>
              <ThumbsUp className="size-3.5" /> like
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-sm"
            >
              <Share className="size-3.5"/>
              Share
            </Button>
            </div>
          </header>
          <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="relative hidden flex-col items-start gap-8 md:flex" x-chunk="dashboard-03-chunk-0">
                { models && models.map((elem) => (
                    <ModelContainer key={elem.name} layerAttrs={layerAttrs} model={elem} />
                    ))
                }
            </div>
            <div className="relative grid grid-cols-2 justify-center items-center h-full min-h-[50vh] rounded-xl bg-transparent lg:col-span-2">
              <Button onClick={async() => await addModel({id:container._id, name:"test"})}> Add model</Button>
            </div>
          </main>
        </div>
    </main>
  );
}
