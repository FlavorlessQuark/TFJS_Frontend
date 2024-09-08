"use client"

import * as React from "react"
import { ArrowLeftIcon, CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { CommandList } from "cmdk"

import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow, 
} from "@/components/ui/table"
import { FileUploader } from "@/components/Uploader"
import { CheckCircle, Import } from "lucide-react"

interface CsvImporterProps
  extends React.ComponentPropsWithoutRef<typeof DialogTrigger>,
    ButtonProps {
      fields: {
        label: string
        value: string
        required?: boolean
    }[]
    onImport: (data: Record<string, unknown>[]) => void
    setUploadedFile: (file: File | null) => void
  }

export function CsvImporter({
  fields,
  onImport,
  setUploadedFile,
  className,
  ...props
}: CsvImporterProps) {
  const [open, setOpen] = React.useState(false)
  const [step, setStep] = React.useState<"upload" | "map">("upload")

  // TODO: create authorization for creating a new import - disable import button if not owner / no permission

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
          <Button
            className={'border border-border h-8 rounded-lg !bg-transparent hover:!bg-muted/30 gap-x-2'}
            {...props}
          >
          <Import />
          Start import
        </Button>
      </DialogTrigger>
      {step === "upload" && (
        <DialogContent className="p-8 sm:max-w-3xl md:w-[800px]">
          <DialogHeader>
            <DialogTitle>Import CSV</DialogTitle>
            <DialogDescription>
              Drag and drop your files here or click to browse.
            </DialogDescription>
          </DialogHeader>
          <FileUploader
            accept={{ 
              "text/csv": [],
            }}
            multiple={false}
            maxSize={10 * 1024 * 1024}
            maxFileCount={1}
            onUpload={async (files: any) => {
              const file = files[0]

              setUploadedFile(file)

              if (!file) return
            }}
          />
          <DialogFooter className={'text-xs text-zinc-600 italic'}>
            * Currently we only support CSV, XLS, and XLSX files.
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  )
}

interface PreviewTableHeadProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {
  field: { label: string; value: string; required?: boolean }
  onFieldChange: (props: { value: string; required?: boolean }) => void
  onFieldToggle: (props: { value: string; checked: boolean }) => void
  currentFieldMapping: string | undefined
  originalFieldMappings: Record<string, string | undefined>
}

function PreviewTableHead({
  field,
  onFieldChange,
  onFieldToggle,
  currentFieldMapping,
  originalFieldMappings,
  className,
  ...props
}: PreviewTableHeadProps) {
  const id = React.useId()
  const [open, setOpen] = React.useState(false)

  return (
    <TableHead className={cn("whitespace-nowrap py-2", className)} {...props}>
      <div className="flex items-center gap-4 pr-1.5">
        <div className="flex items-center gap-2">
          <Checkbox
            id={`${id}-${field.value}`}
            defaultChecked
            onCheckedChange={(checked) => {
              onFieldToggle({
                value: field.value,
                checked: !!checked,
              })
            }}
            disabled={field.required}
          />
          <Label htmlFor={`${id}-${field.value}`} className="truncate">
            {field.label}
          </Label>
        </div>
        <ArrowLeftIcon className="size-4" aria-hidden="true" />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              role="combobox"
              aria-expanded={open}
              className="w-48 justify-between"
            >
              {currentFieldMapping || "Select field..."}
              <CaretSortIcon className="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] !max-h-fit p-0" align="start">
            <Command>
              <CommandInput placeholder="Search field..." />
              <CommandList className={'max-h-52 h-full w-full overflow-auto'}>
                <CommandEmpty>No field found.</CommandEmpty>
                <CommandGroup>
                  {[...new Set(Object.values(originalFieldMappings))].map(
                    (fm) => (
                      <CommandItem
                        key={fm}
                        value={fm}
                        className={'flex flex-row justify-between items-center'}
                        onSelect={() => {
                          onFieldChange({
                            value: fm ?? "",
                          })
                          setOpen(false)
                        }}
                      >
                        <span className="line-clamp-1">{fm}</span>
                        <CheckCircle
                          className={cn(
                            "mr-2 size-4",
                            currentFieldMapping === fm
                              ? "opacity-100 fill-indigo-500"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    )
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </TableHead>
  )
}