import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import AddContainerDialog from "../AddContainerDialog"

const NavSelector = ({pathname}: {pathname: string}) => {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  console.log("pathname", pathname)
  const datasets: any[] = [];
  
  const isContainersRoute = pathname === "/containers";

  return (
    <>
    {isContainersRoute && (
      <div className="flex justify-between h-14 items-center gap-4 bg-zinc-950 px-4 lg:h-[50px] lg:px-6 border-b">
        <div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between !h-7 !border !border-zinc-800 !rounded-lg !bg-zinc-950 text-xs"
            >
              {value
                ? datasets.find((dataset) => dataset.value === value)?.label
                : "Select a dataset..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search datasets..." />
              <CommandList>
                <CommandEmpty>No dataset found.</CommandEmpty>
                <CommandGroup>
                  {datasets.map((dataset) => (
                    <CommandItem
                      key={dataset.value}
                      value={dataset.value}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue)
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === dataset.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {dataset.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        </div>
        <div>
          <AddContainerDialog />
        </div>
      </div>
    )}
    </> 
  )
}

export default NavSelector;