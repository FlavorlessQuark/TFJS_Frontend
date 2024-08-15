import { UserSelectorItems } from "@/types"
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthActions } from "@convex-dev/auth/react";
import { PersonIcon } from "@radix-ui/react-icons";
import { LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar";


const UserSelector = () => {
  const user = useQuery(api.users.viewer);
  const { signOut } = useAuthActions();

  const menuItems: UserSelectorItems[] = [
    {
      icon: <PersonIcon />,
      onClick: () => void console.log("Account Settings"),
      text: "Account Settings",
    },
    {
      icon: <LogOutIcon />,
      onClick: () => void signOut(),
      text: "Sign Out",
    },
  ];

  return (
    <div className='h-10 bg-zinc-900 hover:bg-zinc-800/50 border border-muted rounded-lg flex flex-row items-center justify-start'>
      <DropdownMenu>
        <DropdownMenuTrigger
          onClick={(e) => e.stopPropagation()} asChild
        >
          <Button
            className="border-none w-full justify-between items-center !bg-transparent text-gray-900 dark:text-white shadow-none">
            <div className='flex flex-row items-center space-x-2'>
              <Avatar className='h-4 w-4'>
                {user?.name && (
                    <>
                        <AvatarImage
                            src={user.image}
                            alt={user.name}
                        />
                        <AvatarFallback className='text-[8px] text-white'>
                            {user.name[0]}
                        </AvatarFallback>
                    </>
                )}
              </Avatar>
              <span className={'font-normal'}>
                {user?.name}
              </span>
            </div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="bg-zinc-900 w-80 rounded-xl mr-0 mt-2 ml-2">
          <DropdownMenuGroup>
            {menuItems.map((item, index) => (
              <div key={index}>
                {!item.submenu && (
                  <DropdownMenuItem className='rounded-lg' onClick={item.onClick}>
                    <div className="flex items-center gap-3">
                      <Avatar className='h-4 w-4'>
                        {item.icon}
                      </Avatar>
                      {item.text}
                    </div>
                  </DropdownMenuItem>
                )}

                {item.submenu && (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className='rounded-lg hover:bg-zinc-800/50'>
                      <div className="flex items-center gap-3">
                        <Avatar className='h-4 w-4'>
                          {item.icon}
                        </Avatar>
                        {item.text}
                      </div>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className='rounded-xl bg-zinc-900 hover:bg-zinc-800/50'>
                      {item.submenu.map((subitem, subindex) => (
                        <DropdownMenuItem key={subindex} onClick={subitem.onClick} className='rounded-lg bg-zinc-100 hover:!bg-zinc-200 dark:bg-zinc-900 dark:hover:!hover-bg'>
                          {subitem.text}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                )}

                {item.separator && <DropdownMenuSeparator />}
              </div>
            ))}

          </DropdownMenuGroup>
        </DropdownMenuContent>

      </DropdownMenu>
    </div>
  )
}

export default UserSelector;