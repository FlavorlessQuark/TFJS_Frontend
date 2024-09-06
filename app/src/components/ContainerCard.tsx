import {Card, CardTitle} from "@/components/ui/card.tsx";
import {Eye, Heart} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToggleLike } from "@/hooks/container/use-toggle-like";
import { toast } from "sonner";
const ContainerCard = ({ container }: { container: any }) => {
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

  const creatorEmail = container.creator.email.split('@')[0];

  return (
    <Card id={container?._id} className={'md:min-w-[400px] w-full h-16 max-h-32 bg-background/50 hover:bg-background p-4 flex justify-center flex-col'}>
      <CardTitle className={'card-title font-thin mb-1'}>
        {creatorEmail}/{container.name}
      </CardTitle>

      <div className="flex flex-row items-center justify-between space-x-2">
        <div className={'text-xs text-zinc-600'}>
          Added {formatDistanceToNow(new Date(container._creationTime))} ago
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