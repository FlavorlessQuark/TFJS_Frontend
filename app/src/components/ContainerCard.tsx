import {Card, CardDescription, CardTitle} from "@/components/ui/card.tsx";
import {ThumbsUp} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { truncate } from "@/lib/utils";
import {api} from "../../convex/_generated/api";
import {useMutation} from "convex/react";

const ContainerCard = ({ container }: { container: any }) => {
  const toggleLike = useMutation(api.container.toggleLikes);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      await toggleLike({ id: container._id });
      console.log("Toggled like");
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <Card id={container?._id} className={'md:min-w-[400px] w-full h-32 max-h-32 bg-background/50 hover:bg-background p-4'}>
      <CardTitle className={'flex flex-row items-center justify-between card-title font-thin'}>
        {container.name}
        <div
          className={'hover:cursor-pointer flex flex-row items-start gap-x-2 w-fit text-sm font-thin border border-muted py-1 px-2 rounded-lg hover:bg-muted/50'}
          onClick={(e) => {
            void handleClick(e);
          }}
        >
          {container.likes?.length > 0 ? <ThumbsUp className={'h-4 w-4 fill-blue-500 stroke-blue-800'}/> :
            <ThumbsUp className={'h-4 w-4'}/>}
          {container.likes?.length || 0}
        </div>
      </CardTitle>
      <CardDescription className="text-balance w-full leading-relaxed pb-2">
        {truncate(container.description, 40)}
      </CardDescription>

      <div className={'text-xs mt-2 text-zinc-600'}>
        Added {formatDistanceToNow(new Date(container._creationTime))} ago
      </div>
    </Card>
  )
}

export default ContainerCard;