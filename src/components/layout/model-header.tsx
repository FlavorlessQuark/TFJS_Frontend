import CardTitle from '@/components/CardTitle';
import ModelDrawer from "@/components/container/mobile-drawer";
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Heart,
  Share,
  Upload,
} from "lucide-react"
import { Container, Model } from '@/types';
import AddModelDialog from '../AddModelDialog';
import { useToggleLike } from "@/hooks/container/use-toggle-like";
import { toast } from 'sonner';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { UploadButton, UploadFileResponse } from "@xixixao/uploadstuff/react";
import "@xixixao/uploadstuff/react/styles.css";
import RunModal from '../RunModal';
import AddDatasetDialog from '../AddDatasetDialog';

type ModelHeaderProps = {
  container: Container;
  model: Model;
  layerAttrs: any;
}

const ModelHeader = ({ container, model, layerAttrs }: ModelHeaderProps) => {
  const isLiked = container?.liked;
  const { mutate } = useToggleLike();
  const generateUploadUrl = useMutation(api.data.generateUploadUrl)

  const handleLike = async () => {
    mutate({ id: container._id },
      {
        onSuccess: (response) => {
          toast.success(response.message);
        },
        onError: (error) => {
          console.error("Error toggling like:", error);
        },
        onFinally: () => {
          console.log("Toggled like finally");
        },
      }
    );
  }

  return (
    <header className="sticky top-0 z-10 flex h-[53px] items-center gap-1 border-b bg-background px-4 w-full">
    <CardTitle container={container as Container} />

    <ModelDrawer layerAttrs={layerAttrs} model={model as any} container={container as any} />

    <div className={'flex justify-end items-center ml-auto space-x-2'}>
    <Button size="icon" className={'text-xs !bg-zinc-950 dark:!text-zinc-200'} onClick={handleLike}>
    <div>
      <motion.div
        initial={{ backgroundPositionY: '100%' }}
        whileHover={{ backgroundPositionY: '0%', scale: 1.2 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <Heart className={`size-3.5 ${isLiked ? 'fill-pink-500 stroke-pink-800' : ''}`} />
        <motion.div />
      </motion.div>
    </div>
    </Button>
    <Button
      variant="outline"
      size="sm"
      className="gap-1.5 h-7 text-xs !bg-transparent dark:!text-zinc-200 !border dark:!border-zinc-800 hover:!bg-zinc-900"
    >
      <Share className="size-3.5"/>
      Share
    </Button>
    <UploadButton
      className={(progress: number | null) =>
        "!gap-1.5 !h-7 text-xs !bg-transparent dark:!text-zinc-200 !border dark:!border-zinc-800 hover:!bg-zinc-900 flex items-center justify-center px-2"
      }
      uploadUrl={generateUploadUrl}
      fileTypes={["text/*", "application/*"]}
      onUploadComplete={async (
        uploaded: UploadFileResponse[]
      ) => {
        const uploadedFile = (
          uploaded[0].response as any
        ).storageId as string;

        console.log("uploadedFile", uploadedFile)
      }}
      onUploadError={(error: unknown) => {
        alert(`ERROR! ${error}`);
      }}
      content={(progress: number | null): string => {
        if (progress === null) {
          return `Upload dataset`
        }
        return `${progress}%`;
      }}
    />
    <AddDatasetDialog />
    <AddModelDialog container={container as Container} />
    <RunModal container={container as Container} />
    </div>
  </header>
  )
}

export default ModelHeader;
