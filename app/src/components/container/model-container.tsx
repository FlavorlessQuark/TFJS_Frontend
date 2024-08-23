import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Rabbit} from "lucide-react";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {useGlobalState} from "@/providers/StateProvider";
import {cn} from "@/lib/utils.ts";
import {demoModels} from "@/lib/constants.ts";

const ModelContainer = (container: any) => {
  const { state, setState } = useGlobalState();
  console.log("container in model container", container);
  const layers = [];

  return (
    <form className="grid w-full items-start gap-6">
      <fieldset className="grid gap-6 rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-sm font-medium">
          Modal A
        </legend>
        <div className="grid gap-3">
          <Label htmlFor="model">Model</Label>
          <Select>
            <SelectTrigger
              id="model"
              className="items-start [&_[data-description]]:hidden"
            >
              <SelectValue placeholder="Select a model"/>
            </SelectTrigger>
            <SelectContent>
              {demoModels.map((model) => {
                return (
                  <SelectItem key={model.id} value={model.value}>
                    <div className="flex items-start gap-3 text-muted-foreground">
                      {model.icon === "Rabbit" && <Rabbit size={24}/>}
                      <div className="grid gap-0.5">
                        <p>
                          {model.preName}{" "}
                          <span className="font-medium text-foreground">
                            {model.name}
                          </span>
                        </p>
                        <p className="text-xs" data-description>
                          {model.description}
                        </p>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="temperature">Layers</Label>

          <Accordion
            type="single"
            collapsible
            value={state.openModelLayer ? '1' : undefined}
            onValueChange={(value) => setState("openModelLayer", value === '1')}
          >
            <AccordionItem value={"1"}>
              <AccordionTrigger className={'mb-1'}>
                <span className="font-medium">LAYER_NAME</span>
              </AccordionTrigger>
              <AccordionContent>
                <nav className={'grid items-start gap-0.5'}>
                    {layers.length < 1 && (
                      <div className={cn("text-xs cursor-default text-foreground/50 p-2 ml-3")}>
                        No layers yet
                      </div>
                    )}
                </nav>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </fieldset>
    </form>
  )
}

export default ModelContainer;