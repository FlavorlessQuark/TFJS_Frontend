import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGlobalState } from "@/providers/StateProvider";
import {Button} from "@/components/ui/button.tsx";
import {Box, Plus} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {useQuery} from "convex/react";
import { api } from "../../convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner"
import {Separator} from "@/components/ui/separator.tsx";
import { useCreateModel } from "@/hooks/model/use-create-model";
import { Container } from "@/types";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  containerId: z.string().optional(),
})

const AddModelDialog = ({ container }: { container: Container }) => {
  const { state, setState } = useGlobalState();
  const user = useQuery(api.users.viewer);
  const { mutate, isLoading } = useCreateModel();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      containerId: container._id
    },
  })

  async function onSubmit(values: z.infer<typeof FormSchema>) {

    mutate({
      id: container?._id,
      name: values.name,
    }, {
      onSuccess: (data) => {
        console.log("data", data)
        toast.success(`${values.name} created successfully.`)
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`)
      },
      onFinally: () => {
        form.reset();
        setState("openModelModal", false);
      }
    })
  }

  const onClose = (open: boolean) => {

    setState("openModelModal", open);
    if (!open) {
      form.reset();
    }
  };

  return (
    <Dialog open={state.openModelModal} onOpenChange={onClose}>
      <DialogTrigger onClick={() => setState("openModelLayer", true)}>
        <Button className="h-7 text-xs !bg-transparent dark:!text-zinc-200 !border dark:!border-zinc-800 gap-1.5 hover:!bg-zinc-900" disabled={isLoading}>
          <Plus className="size-3.5" />
          Add Model
        </Button>
      </DialogTrigger>
      <DialogContent className={'p-10 md:!w-[800px] !app-bg'}>
        <Form {...form}>
          <form onSubmit={() => void form.handleSubmit(onSubmit)} >
            <div className={'flex flex-col justify-center items-center gap-4'}>
              <Box className={'w-10 h-10 stroke-purple-800'}/>
              <div className={'flex flex-col justify-center items-center gap-1'}>
                <span className={'text-3xl font-bold'}>
                  Create a new model
                </span>
                <span className={'text-lg font-thin text-zinc-600'}>
                  A model is a collection of layers and can be used to train a model.
                </span>
              </div>

              {/* Container / Model Name */}
              <div className={'flex flex-row items-center justify-center w-4/5 gap-x-4'}>
                <div className="grid w-1/3 items-center gap-1.5">
                  <Label htmlFor="container" className={'text-zinc-200 font-thin'}>Container</Label>
                  <Input disabled type="container" id="container" placeholder={container?.name}/>
                </div>

                <div className={'flex flex-col items-center justify-center mt-3'}>
                  <span className={'text-3xl font-thin text-muted'}>/</span>
                </div>

                <div className="grid w-2/3 items-center gap-1.5">
                  <Label htmlFor="email" className={'text-zinc-200 font-thin'}>Model Name</Label>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({field}) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} type="name" id="name" placeholder="Name"/>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator className={'my-4 w-4/5'}/>

              <div className={'my-4 w-4/5 p-4 border border-muted bg-accent/50 rounded-xl text-sm flex items-center justify-center text-zinc-200'}>
                Once your Model is created, you can upload your files using the web interface.
              </div>

              <div className={'w-4/5 flex items-end justify-end'}>
                <Button onClick={(e) => {
                e.preventDefault()

                mutate({
                  id: container._id, 
                  name: form.getValues("name")
                  }, {
                    onSuccess: (data) => {
                      console.log("data", data)
                      toast.success(`${form.getValues("name")} created successfully.`)
                    },
                    onError: (error) => {
                      toast.error(`Error: ${error.message}`)
                    },
                    onFinally: () => {
                      form.reset();
                      setState("openModelModal", false);
                    }
                  })}
                }
                >
                  Add model
                </Button>
              </div>

            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddModelDialog;
