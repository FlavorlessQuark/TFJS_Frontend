import {createFileRoute} from '@tanstack/react-router'
import {useAction, useMutation, useQuery} from "convex/react";
import {api} from "../../../convex/_generated/api";
import ModelContainer from "@/components/container/model-container";
import { useEffect, useState } from 'react';
import { Container, Model } from '@/types';
import AddModelDialog from '@/components/AddModelDialog';
import ModelHeader from '@/components/layout/model-header';
import { Button } from "@/components/ui/button"

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
    <>
    <ModelHeader container={container as Container} model={model as Model} layerAttrs={layerAttrs} />
    <main className="grid w-full">
        <div className="flex flex-col">
          <main className="grid flex-1 gap-4 overflow-auto p-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div className="relative flex flex-col items-start gap-4 h-[calc(100vh-125px)]">
              {models && models.map((elem, i) => (
                elem && <div key={elem.name + i} className="w-full">
                  <ModelContainer layerAttrs={layerAttrs} model={elem} container={container as any} />
                  <div className="overflow-y-auto">
                    {elem.logs?.logs.map((log, i) => (
                      <div key={i}>
                        Batch {i} : {log}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div>
            </div>
          </main>
        </div>
    </main>
    </>
  );
}
