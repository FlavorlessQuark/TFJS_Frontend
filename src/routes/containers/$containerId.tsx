import {createFileRoute} from '@tanstack/react-router'
import {useMutation, useQuery} from "convex/react";
import {api} from "../../../convex/_generated/api";
import ModelContainer from "@/components/container/model-container";
import { useEffect, useState } from 'react';
import { Container, Model } from '@/types';
import ModelHeader from '@/components/layout/model-header';
import {useDropzone} from 'react-dropzone';
import AddModelDialog from '@/components/AddModelDialog';
import { useGlobalState } from '@/providers/StateProvider';

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
  const {acceptedFiles, getRootProps, getInputProps, isDragActive} = useDropzone({ noClick: true });
  const { setState } = useGlobalState();

  useEffect(() => {
    if (container) {
      incrementViews({id: container._id});
    }
  }, [container?._id]);

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      setState("openModelModal", true);
    }
  }, [acceptedFiles]);

  if (!container) {
    return null;
  }

  const files = acceptedFiles.map(file => (
    <li key={file.name}>
      {file.name} - {file.size} bytes
    </li>
  ));

  return (
    <>
    <ModelHeader container={container as Container} model={model as Model} layerAttrs={layerAttrs} />
    <section className="container w-screen">
    <div {...getRootProps({className: `w-screen h-[calc(100vh-95px)] p-2 dropzone ${isDragActive ? 'bg-background/50 border border-purple-400 border-dashed' : ''}`})}>
    <main className="grid w-full">
        <div className="flex flex-col">
          <main className="grid flex-1 gap-4 overflow-auto p-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div className="relative flex flex-row items-start gap-4 h-[calc(100vh-125px)]">
              {models && models.map((elem, i) => (
                elem && <div key={elem.name + i} className="w-full">
                  <ModelContainer layerAttrs={layerAttrs} model={elem} container={container as any} />
                  <div className="overflow-y-auto">
                    {elem.logs?.logs.map((log: any, i: any) => (
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
    </div>
    </section>
    <AddModelDialog container={container as Container} acceptedFiles={acceptedFiles} />
    </>
  );
}
