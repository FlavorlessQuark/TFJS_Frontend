import {createFileRoute} from '@tanstack/react-router'
import {
  Heart,
  Share,
} from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {useAction, useMutation, useQuery} from "convex/react";
import {api} from "../../../convex/_generated/api";
import ModelDrawer from "@/components/container/mobile-drawer";
import ModelContainer from "@/components/container/model-container";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import { useEffect, useState } from 'react';
import { Model } from '@/types';

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

  const testRun = useAction(api.tensorflow_fn.run_model)
  const container = useQuery(api.container.getContainer, { id: containerId }) || undefined;
  const addModel = useMutation(api.container.createContainerModel)
  const models = useQuery(api.container.getContainerModels, { id: containerId });
  const layerAttrs = useQuery(api.layers.getLayers);
  const incrementViews = useMutation(api.container.incrementViews);
  const [model, _] = useState<Model | null>(null);

  useEffect(() => {
    if (container) {
      incrementViews({id: container._id});
    }
  }, [container?._id]);

  if (!container) {
    return null;
  }

  return (
    <main className="grid h-full w-full">
        <div className="flex flex-col">
          <header className="sticky top-0 z-10 flex h-[53px] items-center gap-1 border-b bg-background px-4 w-full">
            <div className={'flex flex-row-items center space-x-4'}>
              <div className={'flex flex-row items-center space-x-1'}>
                <Avatar className={'h-6 w-6 border-purple-400 border'}>
                  <AvatarImage src={container.creator.image} alt={container.creator.name} />
                  <AvatarFallback>{container.creator.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className={'text-zinc-500 text-lg font-normal'}>{container.creator.name}</span>
                <span className={'text-zinc-500 text-lg font-normal'}>/</span>
                <h1 className="text-lg font-normal">{container.name}</h1>
              </div>
            </div>
            <ModelDrawer layerAttrs={layerAttrs} model={model as any} container={container as any} />
            <div className={'flex justify-end items-center ml-auto'}>
            <Button size="icon" className={'text-xs gap-x-1 !bg-zinc-950 dark:!text-zinc-200'}>
            <div className="heart-container">
              <motion.div
                className="heart-wrapper"
                initial={{ backgroundPositionY: '100%' }}
                whileHover={{ backgroundPositionY: '0%', scale: 1.2 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                <Heart className="heart-outline" />
                <motion.div className="heart-fill" />
              </motion.div>
            </div>
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
          <main className="grid flex-1 gap-4 overflow-auto p-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div className="relative flex flex-col items-start gap-8 col-span-1 md:col-span-2 lg:col-span-3">
              {models && models.map((elem, i) => (
                elem && <div key={elem.name + i} className="w-full">
                  <ModelContainer layerAttrs={layerAttrs} model={elem} container={container as any} />
                  <Button onClick={async () => await testRun({id:elem?._id})}> Run Model (test button)</Button>
                  <div>
                    {elem.logs?.logs.map((log, i) => (
                      <div key={i}>
                        Batch {i} : {log}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="relative flex justify-center items-center h-full min-h-[50vh] rounded-xl bg-transparent col-span-1 md:col-span-2 lg:col-span-3">
              <Button onClick={async() => await addModel({id:container._id, name:"test"})}> Add model</Button>
            </div>
          </main>
        </div>
    </main>
  );
}
