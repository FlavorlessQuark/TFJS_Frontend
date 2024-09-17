import {Card} from "@/components/ui/card.tsx";
import {Eye, Heart} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { useToggleLike } from "@/hooks/container/use-toggle-like";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import CardTitle from "./CardTitle";
import { Container } from "@/types";
interface ContainerCardProps {
  container: any;
}

const ContainerCard = ({ container }: ContainerCardProps) => {
  const { mutate } = useToggleLike();

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

  return (
    <Card id={container?._id} className={'md:min-w-[400px] w-full max-h-48 bg-background/50 hover:bg-background p-4 space-y-1 flex justify-center flex-col'}>
      <CardTitle container={container as Container} />
      <div>
        <span className="text-sm text-zinc-600 truncate">{container?.description}</span>
      </div>

      <div className="flex flex-row items-center justify-between space-x-2">
        <div className={'text-xs text-zinc-600'}>
          <Tooltip>
            <TooltipTrigger>
          Added {formatDistanceToNow(new Date(container._creationTime))} ago
          </TooltipTrigger>
          <TooltipContent>
            {format(new Date(container._creationTime), "MMM do, yyyy 'at' h:mm a")}
          </TooltipContent>
          </Tooltip>
        </div>

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
    </Card>
  )
}

export default ContainerCard;