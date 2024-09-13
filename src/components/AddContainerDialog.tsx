import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGlobalState } from "@/providers/StateProvider";
import {Button} from "@/components/ui/button.tsx";
import {Book, BookLock, Box, Plus} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {useQuery} from "convex/react";
import { Tag, TagInput } from 'emblor';
import {api} from "../../convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem, FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {Separator} from "@/components/ui/separator.tsx";
import { useCreateContainer } from "@/hooks/container/use-create-container";
import { useState } from "react";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().min(5, {
    message: "Description must be at least 5 characters.",
  }),
  tags: z.array(z.object({ id: z.string(), text: z.string() })).optional(),
  public: z.boolean(),
})

const AddContainerDialog = () => {
  const { state, setState } = useGlobalState();
  const user = useQuery(api.users.viewer);
  const { mutate, isLoading } = useCreateContainer();
  const [tags, setTags] = useState<Tag[]>([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
      tags: [],
      public: false,
    },
  })

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    console.log("values", values);
    const tagsArray = values.tags ? values.tags.map(tag => tag.text) : [];

    mutate({
      name: values.name,
      description: values.description,
      public: values.public,
      tags: tagsArray
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
        setState("openContainerModal", false);
      }
    })
  }

  const onClose = (open: boolean) => {
    setState("openContainerModal", open);
    setTags([]);
    if (!open) {
      form.reset();
    }
  };

  return (
    <Dialog open={state.openContainerModal} onOpenChange={onClose}>
      <DialogTrigger>
        <Button className="h-7 text-xs !bg-transparent dark:!text-zinc-200 !border dark:!border-zinc-800" disabled={isLoading}>
          <Plus className="w-4 h-4 mr-2" />
          Add Container
        </Button>
      </DialogTrigger>
      <DialogContent className={'p-10 md:!w-[800px] !app-bg'}>
        <Form {...form}>
          <form onSubmit={() => void form.handleSubmit(onSubmit)} >
            <div className={'flex flex-col justify-center items-center gap-4'}>
              <Box className={'w-10 h-10 stroke-purple-800'}/>
              <div className={'flex flex-col justify-center items-center gap-1'}>
                <span className={'text-3xl font-bold'}>
                  Create a new model container
                </span>
                <span className={'text-lg font-thin text-zinc-600'}>
                  A container will have all model and dataset files and can be shared with others.
                </span>
              </div>

              {/* Model Owner / Model Name */}
              <div className={'flex flex-row items-center justify-center w-4/5 gap-x-4'}>
                <div className="grid w-1/3 items-center gap-1.5">
                  <Label htmlFor="name" className={'text-zinc-200 font-thin'}>Owner</Label>
                  <Input disabled type="name" id="name" placeholder={user?.name}/>
                </div>

                <div className={'flex flex-col items-center justify-center mt-3'}>
                  <span className={'text-3xl font-thin text-muted'}>/</span>
                </div>

                <div className="grid w-2/3 items-center gap-1.5">
                  <Label htmlFor="email" className={'text-zinc-200 font-thin'}>Container Name</Label>
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

              <div className={'flex flex-row items-center justify-center w-4/5 gap-x-4'}>
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="description" className={'text-zinc-200 font-thin'}>Description</Label>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({field}) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            {...field}
                            style={{resize: 'none'}}
                            placeholder="Enter description of container"
                            id="description"
                          />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className={'flex flex-row items-center justify-center w-4/5 gap-x-4'}>
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="description" className={'text-zinc-200 font-thin'}>Tags</Label>
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormControl>
                        <TagInput
                          {...field}
                          activeTagIndex={null}
                          setActiveTagIndex={() => {}}
                          placeholder="Enter a tag"
                          tags={tags}
                          className="sm:min-w-[450px]"
                          setTags={(newTags) => {
                            setTags(newTags);
                            field.onChange(newTags);
                          }}
                          styleClasses={{
                            tag: {
                              body: 'border border-purple-400 bg-purple-400/10',
                            }
                          }}
                        />                      
                      </FormControl>
                      <span className={'text-zinc-200 font-thin text-xs italic'}>
                        * Press enter to add a tag
                      </span>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
              </div>

              <Separator className={'my-4 w-4/5'}/>

              <div className={'flex flex-row items-center justify-center w-4/5 gap-x-4'}>
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="public" className={'mb-2 text-zinc-200 font-thin'}>Visibility</Label>
                  <FormField
                    control={form.control}
                    name="public"
                    render={({field}) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => field.onChange(value === "public")}
                            defaultValue="private"
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-start space-x-3 space-y-0">
                              <FormControl className={'!h-4 !w-5'}>
                                <RadioGroupItem value="private" />
                              </FormControl>
                              <FormLabel className="font-normal leading-snug">
                                <div className={'flex flex-row space-x-2'}>
                                  <BookLock />
                                  <div className={'flex flex-col justify-center items-start space-y-1'}>
                                    <span>Private</span>
                                    <span className={'text-zinc-500 font-thin'}>
                                      Only you  or users you share with can see and commit to this container.
                                    </span>
                                  </div>
                                </div>
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-start space-x-3 space-y-0">
                              <FormControl className={'!h-4 !w-6'}>
                                <RadioGroupItem value="public" />
                              </FormControl>
                              <FormLabel className="font-normal leading-snug">
                                <div className={'flex flex-row space-x-2'}>
                                  <Book />
                                  <div className={'flex flex-col justify-center items-start space-y-1'}>
                                    <span>Public</span>
                                    <span className={' text-zinc-500 font-thin'}>
                                      Anyone in the community can see this container. Only you  or users you share with can commit.</span>
                                  </div>
                                </div>
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className={'my-4 w-4/5 p-4 border border-muted bg-accent/50 text-sm flex items-center justify-center text-zinc-200'}>
                Once your container is created, you can upload your files using the web interface.
              </div>

              <div className={'w-4/5 flex items-end justify-end'}>
                <Button 
                  onClick={(e) => {
                    e.preventDefault();
                    onSubmit(form.getValues());
                  }}
                  disabled={isLoading} 
                  type="submit"
                >
                  Create container
                </Button>
              </div>

            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddContainerDialog;
