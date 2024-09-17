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
import { cn } from '@/lib/utils';

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
                  {elem.logs && (
                  <div className="mt-4 mb-1">
                    <span className="text-sm card-title ">Logs</span>
                  </div>
                  )}
                  <div className={cn("w-96 overflow-y-auto max-h-[300px] p-2 !bg-zinc-900 border border-zinc-700 rounded-md", elem.logs ? "mt-4" : "!border-none !bg-transparent")}>
                    <div className="text-sm card-title">
                      {elem.logs?.logs.map((log: any, i: any) => (
                        <div key={i}>
                          Batch {i} : {log}
                        </div>
                      ))}
                      {/* logs: [
                        'acc: 0.00  loss: 2017.48  size: 5.00  ',
                        'acc: 0.00  loss: 777.21  size: 5.00  ',
                        'acc: 0.00  loss: 3487.04  size: 5.00  ',
                        'acc: 0.20  loss: 1059.54  size: 5.00  ',
                        'acc: 0.00  loss: 791.34  size: 5.00  ',
                        'acc: 0.00  loss: 1409.95  size: 5.00  ',
                        'acc: 0.00  loss: 920.88  size: 5.00  ',
                        'acc: 0.00  loss: 1009.85  size: 2.00  ',
                        'acc: 0.20  loss: 996.94  size: 5.00  ',
                        'acc: 0.00  loss: 1795.19  size: 5.00  ',
                        'acc: 0.00  loss: 712.63  size: 5.00  ',
                        'acc: 0.00  loss: 1738.16  size: 5.00  ',
                        'acc: 0.00  loss: 693.62  size: 5.00  ',
                        'acc: 0.00  loss: 1783.26  size: 5.00  ',
                        'acc: 0.00  loss: 1459.60  size: 5.00  ',
                        'acc: 0.00  loss: 2160.67  size: 2.00  ',
                        'acc: 0.00  loss: 1665.91  size: 5.00  ',
                        'acc: 0.00  loss: 2678.84  size: 5.00  ',
                        'acc: 0.00  loss: 956.36  size: 5.00  ',
                        'acc: 0.20  loss: 836.97  size: 5.00  ',
                        'acc: 0.00  loss: 1730.38  size: 5.00  ',
                        'acc: 0.00  loss: 844.34  size: 5.00  ',
                        'acc: 0.00  loss: 616.02  size: 5.00  ',
                        'acc: 0.00  loss: 120.70  size: 2.00  ',
                        'acc: 0.00  loss: 682.77  size: 5.00  ',
                        'acc: 0.00  loss: 1590.02  size: 5.00  ',
                        'acc: 0.00  loss: 1239.40  size: 5.00  ',
                        'acc: 0.00  loss: 1377.30  size: 5.00  ',
                        'acc: 0.00  loss: 1107.35  size: 5.00  ',
                        'acc: 0.20  loss: 1401.47  size: 5.00  ',
                        'acc: 0.00  loss: 729.34  size: 5.00  ',
                        'acc: 0.00  loss: 1133.50  size: 2.00  ',
                        'acc: 0.00  loss: 1679.06  size: 5.00  ',
                        'acc: 0.00  loss: 396.19  size: 5.00  ',
                        'acc: 0.00  loss: 351.45  size: 5.00  ',
                        'acc: 0.20  loss: 862.87  size: 5.00  ',
                        'acc: 0.00  loss: 1352.98  size: 5.00  ',
                        'acc: 0.00  loss: 1151.55  size: 5.00  ',
                        'acc: 0.00  loss: 1097.69  size: 5.00  ',
                        'acc: 0.00  loss: 2444.58  size: 2.00  '
                      ], */}
                    </div>
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
