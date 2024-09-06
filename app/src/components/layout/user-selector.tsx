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
      <DropdownMenu>
        <DropdownMenuTrigger
          onClick={(e) => e.stopPropagation()} asChild
        >
          <Button className="!bg-zinc-950 -mr-3">
              <Avatar className='h-7 w-7 border border-zinc-600'>
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
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="bg-background -mt-0.5 w-64">
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
  )
}

export default UserSelector;