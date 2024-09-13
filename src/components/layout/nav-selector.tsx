import * as React from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
 
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
import { useGlobalState } from "@/providers/StateProvider"
import { UploadButton, UploadFileResponse } from "@xixixao/uploadstuff/react";
import "@xixixao/uploadstuff/react/styles.css";
import { useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"


const NavSelector = ({pathname}: {pathname: string}) => {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const { state, setState } = useGlobalState();
  const [searchQuery, setSearchQuery] = React.useState("")

  const generateUploadUrl = useMutation(api.data.generateUploadUrl)

  console.log("pathname", pathname)
  const datasets: any[] = [];
  
  const isContainersRoute = pathname === "/containers" || pathname === "/community";

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
              <CommandInput 
                placeholder="Search datasets..." 
                onValueChange={setSearchQuery}
              />
              <CommandList>
                <CommandEmpty>
                  {searchQuery ? (
                    <div className="flex flex-col items-center justify-center p-2 gap-2">
                    No results found.
                    <UploadButton
                        className={(progress: number | null) =>
                          "cursor-pointer text-white py-1 px-2 rounded-lg flex justify-center items-center border border-zinc-800 w-full"
                        }
                        uploadUrl={generateUploadUrl}
                        fileTypes={[
                          "text/*",
                          "application/*",
                        ]}
                        onUploadComplete={async (
                          uploaded: UploadFileResponse[]
                        ) => {
                          const uploadedFile = (
                            uploaded[0].response as any
                          ).storageId as string;

                          console.log("uploadedFile", uploadedFile)
                        }}
                        onUploadError={(error: unknown) => {
                          alert(`ERROR! ${error}`);
                        }}
                        content={(progress: number | null) => {
                          if (progress === null) {
                            return "Upload";
                          }
                          return `${progress}%`;
                        }}
                      />
                      </div>
                  ) : <span className="p-2">Search for a dataset or upload a new one.</span>}
                </CommandEmpty>
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
        <div className="flex flex-row items-center space-x-2">
          {!state.openFilter && (
          <Button 
            variant="outline" 
            size="sm" 
            className="!h-7 !border !border-zinc-800 !rounded-lg !bg-zinc-950 text-xs"
            onClick={() => setState("openFilter", !state.openFilter)}
            >
            Filter
          </Button>
          )}
          <AddContainerDialog />
        </div>
      </div>
    )}
    </> 
  )
}

export default NavSelector;