import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGlobalState } from "@/providers/StateProvider";
import {Button} from "@/components/ui/button.tsx";
import {Box, CirclePlay, Plus} from "lucide-react";
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
import { Container, Model } from "@/types";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  modelId: z.string().optional(),
})

const RunModal = ({ model }: { model: Model }) => {
  const { state, setState } = useGlobalState();
  const user = useQuery(api.users.viewer);
  const { mutate, isLoading } = useCreateModel();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      modelId: model._id
    },
  })

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    console.log("values", values)
  }

  const onClose = (open: boolean) => {

    setState("openRunModal", open);
    if (!open) {
      form.reset();
    }
  };

  return (
    <Dialog open={state.openRunModal} onOpenChange={onClose}>
      <DialogTrigger onClick={() => setState("openModelLayer", true)}>
        <span className="text-xs text-muted-foreground card-title hover:!text-zinc-100 cursor-pointer hover:underline">
          Compile and Run
        </span>
      </DialogTrigger>
      <DialogContent className={'p-10 md:!w-[800px] !app-bg'}>
        <Form {...form}>
          <form onSubmit={() => void form.handleSubmit(onSubmit)} >
            <div className={'flex flex-col justify-center items-center gap-4'}>
              <CirclePlay className={'w-10 h-10 stroke-purple-800'}/>
              <div className={'flex flex-col justify-center items-center gap-1'}>
                <span className={'text-3xl font-bold'}>
                  Compile and Run
                </span>
                <span className={'text-lg font-thin text-zinc-600'}>
                  Compile and run your model.
                </span>
              </div>

              {/* Run commands */}
              <div className={'flex flex-row items-center justify-center w-4/5 gap-x-4'}>
                <div className="grid w-1/3 items-center gap-1.5">
                  <Label htmlFor="container" className={'text-zinc-200 font-thin'}>Build Command</Label>
                </div>
                <div className="grid w-2/3 items-center gap-1.5">
                  <Input disabled type="container" id="container" placeholder={model?.name}/>
                </div>
              </div>

              <div className={'flex flex-row items-center justify-center w-4/5 gap-x-4'}>
                <div className="grid w-1/3 items-center gap-1.5">
                  <Label htmlFor="container" className={'text-zinc-200 font-thin'}>Build Command</Label>
                </div>
                <div className="grid w-2/3 items-center gap-1.5">
                  <Input disabled type="container" id="container" placeholder={model?.name}/>
                </div>
              </div>
              
              <div className={'flex flex-row items-center justify-center w-4/5 gap-x-4'}>
                <div className="grid w-1/3 items-center gap-1.5">
                  <Label htmlFor="container" className={'text-zinc-200 font-thin'}>Build Command</Label>
                </div>
                <div className="grid w-2/3 items-center gap-1.5">
                  <Input disabled type="container" id="container" placeholder={model?.name}/>
                </div>
              </div>

              <Separator className={'my-4 w-4/5'}/>

              <div className={'my-4 w-4/5 p-4 border border-muted bg-accent/50 rounded-xl text-sm flex items-center justify-center text-zinc-200'}>
                Once your Model is created, you can upload your files using the web interface.
              </div>

              <div className={'w-4/5 flex items-end justify-end'}>
                <Button onClick={(e) => e.preventDefault()}>
                  Run model
                </Button>
              </div>

            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default RunModal;
