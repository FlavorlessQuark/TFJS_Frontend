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
import { format, formatDistanceToNow } from "date-fns";

interface DatasetCardProps {
  dataset: any;
}

const DatasetCard = ({ dataset }: DatasetCardProps) => {
  console.log("DATASET", dataset)

  return (
    <Card id={dataset?._id} className={'md:min-w-[400px] w-full bg-background/50 hover:bg-background p-4 space-y-1 flex justify-center flex-col'}>
      <div className="flex flex-row items-center justify-between space-x-2">
      {dataset.name}
      </div>

      <div className="flex flex-row items-center justify-between space-x-2">
        <div className="flex flex-col space-y-1">
          <div className={'text-xs text-zinc-600'}>
            {dataset.description}
          </div>

          <div className={'text-xs text-zinc-600'}>
            XShape: [{dataset.xshape}]
          </div>

          <div className={'text-xs text-zinc-600'}>
            YShape: [{dataset.yshape}]
          </div>

          <div className={'text-xs text-zinc-600'}>
            Added: {formatDistanceToNow(dataset._creationTime)} ago
          </div>
        </div>

      </div>
    </Card>
  )
}

export default DatasetCard;