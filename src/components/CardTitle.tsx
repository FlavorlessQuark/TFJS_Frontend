import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Container } from "@/types";

const CardTitle = ({container}: {container: Container}) => {
  return (
    <div className={'flex flex-row-items center space-x-4'}>
      <div className={'flex flex-row items-center space-x-1'}>
        <Avatar className={'h-6 w-6 border-purple-400 border'}>
          <AvatarImage src={container.creator.image} alt={container.creator.name} />
          <AvatarFallback className={"card-title"}>{container.creator.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className={'text-zinc-500 text-sm font-normal card-title'}>{container.creator.name}</span>
        <span className={'text-zinc-500 text-sm font-normal card-title'}>/</span>
        <h1 className="text-sm font-normal card-title">{container.name}</h1>
      </div>
    </div>
  )
}

export default CardTitle;
