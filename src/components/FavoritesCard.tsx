import {Card} from "@/components/ui/card.tsx";
import {Eye, Heart} from "lucide-react";
import { useToggleLike } from "@/hooks/container/use-toggle-like";
import { toast } from "sonner";
import CardTitle from "./CardTitle";
import { Container } from "@/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { format } from "date-fns";
import { useState } from "react";

interface FavoritesCardProps {
  container: any;
}

const FavoritesCard = ({ container }: FavoritesCardProps) => {
  const { mutate } = useToggleLike();
  const [open, setOpen] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
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
  };

  console.log("COnTAINEr", container)

  return (
    <Card id={container?._id} className={'md:min-w-[400px] w-full bg-background/50 hover:bg-background p-4 space-y-1 flex justify-center flex-col'}>
      <div className="flex flex-row items-center justify-between space-x-2">
      <CardTitle container={container as Container} />
      <div className="flex flex-row items-center space-x-3">
          <div
            className={'cursor-pointer card-title text-xs text-zinc-600 gap-x-1 font-thin flex flex-row items-center'}
            onClick={(e) => {
              void handleClick(e);
            }}
          >
            <Eye className={'h-3 w-3 card-title text-xs text-zinc-600'}/>
            {container.views || 0}
          </div>
          <div
            className={'hover:cursor-pointer card-title text-xs text-zinc-600 gap-x-1 font-thin flex flex-row items-center'}
            onClick={(e) => {
              void handleClick(e);
            }}
          >
            {container.likes?.length > 0 ? <Heart className={'h-3 w-3 fill-pink-500 stroke-pink-800'}/> :
              <Heart className={'h-3 w-3 card-title text-xs text-zinc-600'}/>}
            {container.likes?.length || 0}
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center justify-between space-x-2">
        <div className="flex flex-col space-y-1">
          <div className={'text-xs text-zinc-600'}>
            {container?.models?.length || 0} models trained
          </div>

          <div className={'text-xs text-zinc-600'}>
            Best accuracy on set: 
          </div>

          <div>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setOpen(!open);
            }}>
              <span className={'text-xs text-zinc-600 hover:underline cursor-pointer'}>
                Dataset: {container?.dataset?.name || "Unknown"}
              </span>
            </PopoverTrigger>
            <PopoverContent className="w-80" side="bottom" sideOffset={10} align="start">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none card-title">
                    {container?.creator?.name || "Unknown"}/{container?.dataset?.name || "Unknown"}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {container?.description || "Unknown"}
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="width">Uploaded</Label>
                    <Input
                      disabled={true}
                      id="width"
                      defaultValue="100%"
                      className="col-span-2 h-8 hover:!border hover:!border-purple-400"
                      value={format(container?.dataset?._creationTime || new Date(), 'MMM d, yyyy')}
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="maxWidth">XShape</Label>
                    <Input
                      disabled={true}
                      id="maxWidth"
                      defaultValue="300px"
                      className="col-span-2 h-8 hover:!border hover:!border-purple-400"
                      value={container?.dataset?.xshape || "Unknown"}
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="height">YShape</Label>
                    <Input
                      disabled={true}
                      id="height"
                      defaultValue="25px"
                      className="col-span-2 h-8 hover:!border hover:!border-purple-400"
                      value={container?.dataset?.yshape || "Unknown"}
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="maxHeight" className={'w-fit text-zinc-600 hover:underline cursor-pointer'}>Data</Label>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          </div>
        </div>

      </div>
    </Card>
  )
}

export default FavoritesCard;