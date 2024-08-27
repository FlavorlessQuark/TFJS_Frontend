import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Rabbit} from "lucide-react";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {useGlobalState} from "@/providers/StateProvider";
import {cn} from "@/lib/utils.ts";
import {demoModels} from "@/lib/constants.ts";
import { Button } from "../ui/button";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "../../../convex/_generated/api";

const ModelContainer = ({layerAttrs, model}) => {
  const { state, setState } = useGlobalState();
  const [selected, setSelected] = useState("")
  const addLayer = useMutation(api.container.saveContainerModel)
  console.log("container in model container", layerAttrs);
  const layers = [];

  const addSelectedLayer = async(e) => {
        e.preventDefault();
        if (selected != "") {
            if (!model.layers)
                model.layers = []

            model.layers.push({name: selected, parameters: []})
            await addLayer(model)
        }
  }

  return (
      <fieldset className="grid gap-6 rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-sm font-medium">
          {model.name}
        </legend>
        <div className="grid gap-3">
            {
                    model.layers && model.layers.map((layer, i) => {
                    <Accordion
                        type="single"
                        collapsible
                        value={state.openModelLayer ? '1' : undefined}
                        onValueChange={(value) => setState("openModelLayer", value === '1')}
                    >
                        <AccordionItem value={i}>
                        <AccordionTrigger className={'mb-1'}>
                            <span className="font-medium">{layer.name}</span>
                        </AccordionTrigger>
                        <AccordionContent>
                            <nav className={'grid items-start gap-0.5'}>
                                {layers.length < 1 && (
                                <div className={cn("text-xs cursor-default text-foreground/50 p-2 ml-3")}>
                                    <Button>
                                        Add param
                                    </Button>
                                </div>
                                )}
                            </nav>
                        </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                })
            }
            <div>
                <Select >
                    <SelectTrigger  id="model" className="items-start [&_[data-description]]:hidden">
                        <SelectValue placeholder="Select a layer"/>
                    </SelectTrigger>
                    <SelectContent >
                        {layerAttrs && layerAttrs.map((layer) =>
                            <SelectItem key={layer.name} value={layer.name}>
                                {layer.name}
                            </SelectItem>
                        )}
                    </SelectContent>
                </Select>
                <Button onClick={(e) => addLayer(e)}> Add</Button>
            </div>
        </div>
      </fieldset>
  )
}

export default ModelContainer;
