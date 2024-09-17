import CardTitle from '@/components/CardTitle';
import ModelDrawer from "@/components/container/mobile-drawer";
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Heart,
  Settings,
  Share,
  Trash,
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from '../ui/textarea';
import { Tag as EmblorTag, TagInput } from 'emblor';
import { useState } from 'react';

type Tag = EmblorTag & { id: string };

type ModelHeaderProps = {
  container: Container;
  model: Model;
  layerAttrs: any;
}

const ModelHeader = ({ container, model, layerAttrs }: ModelHeaderProps) => {
  const isLiked = container?.liked;
  const { mutate } = useToggleLike();
  const generateUploadUrl = useMutation(api.data.generateUploadUrl)
  const updateContainer = useMutation(api.container.updateContainer)
  const deleteContainer = useMutation(api.container.deleteContainer)
  const [tags, setTags] = useState<Tag[]>(
    container.tags?.map(tag => ({ id: tag, label: tag, value: tag, text: tag })) ?? []
  );
  const [localContainer, setLocalContainer] = useState<Container>(container);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const handleUpdateContainer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateContainer({
      id: localContainer._id!,
      name: localContainer.name ?? '',
      description: localContainer.description ?? '',
      tags: tags.map(tag => tag.text),
      public: localContainer.public ?? false
    });
    setIsDialogOpen(false);
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
    <AddDatasetDialog container={container as Container} />
    <AddModelDialog container={container as Container} />
    <RunModal container={container as Container} />
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-7 text-xs !bg-transparent dark:!text-zinc-200 border-none px-2 hover:!bg-zinc-900 card-title">
          <Settings className="size-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleUpdateContainer}>
          <DialogHeader>
            <DialogTitle>Edit Container</DialogTitle>
            <DialogDescription>
              Make changes to your container here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="items-center gap-4">
              <Input 
                id="name" 
                value={localContainer.name || ''} 
                onChange={(e) => setLocalContainer({...localContainer, name: e.target.value})}
                className="w-full" 
              />
            </div>
            <div className="items-center gap-4">
              <Textarea 
                id="description" 
                value={localContainer.description || ''} 
                onChange={(e) => setLocalContainer({...localContainer, description: e.target.value})}
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              <TagInput
                activeTagIndex={null}
                setActiveTagIndex={() => {}}
                placeholder="Enter a tag"
                tags={tags}
                setTags={(newTags) => {
                  setTags(newTags);
                  setLocalContainer(prev => ({
                    ...prev,  
                    tags: (Array.isArray(newTags) ? newTags : prev.tags)?.map(tag => 
                      typeof tag === 'string' ? tag : tag.text
                    ) ?? []
                  }));
                }}
                styleClasses={{
                  tag: {
                    body: 'border border-purple-400 bg-purple-400/10',
                  },
                  input: '!w-[400px]'
                }}
              />    
            </div>
            <div className="flex justify-end items-center gap-4">
              <Label htmlFor="public" className="text-right">
                Public
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch 
                  id="public" 
                  checked={localContainer.public || false}
                  onCheckedChange={(checked) => setLocalContainer({...localContainer, public: checked})}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-row items-center justify-between w-full">
            <Button 
              type="button" 
              size="icon" 
              className="!bg-destructive hover:!bg-destructive/90 !text-white"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this container?')) {
                  deleteContainer({ id: container._id });
                }
              }}
            >
              <Trash className="size-3.5" />
            </Button>
            <div className="flex flex-row items-center justify-end gap-x-4 w-full">
              <DialogClose asChild>
                <span className="text-sm hover:underline cursor-pointer">Cancel</span>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    </div>
  </header>
  )
}

export default ModelHeader;
