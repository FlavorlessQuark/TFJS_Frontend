import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGlobalState } from "@/providers/StateProvider";
import { useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Button } from "../ui/button";
import ModelParams from "./model.params";

const ModelContainer = ({layerAttrs, model}) => {
  const { state, setState } = useGlobalState();
  const [selectedLayer, setSelectedLayer] = useState("")

  const addLayer = useMutation(api.container.saveContainerModel)

  const addSelectedLayer = async(e) => {
        e.preventDefault();
        if (selectedLayer != "") {
            if (!model.layers)
                model.layers = []

            model.layers.push({name: selectedLayer, parameters: []})

            console.log("updating model", model)

            await addLayer({id:model._id,layers:model.layers})
        }
  }
  console.log(layerAttrs)

  return (
    <form className="grid w-full items-start gap-6">
      <fieldset className="grid gap-6 rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-sm font-medium">
          {model.name}
        </legend>
        <div className="grid gap-3">
            {
                    model.layers.map((layer, i) => (
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
                                <ModelParams params={layerAttrs[layer.name]}/>
                                <Button> Add param</Button>
                        </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    ))
            }
            <div>
                <Select  onValueChange={(e) => setSelectedLayer(e)}>
                    <SelectTrigger  id="model" className="items-start [&_[data-description]]:hidden">
                        <SelectValue  placeholder="Select a layer"/>
                    </SelectTrigger>
                    <SelectContent>
                        {layerAttrs && Object.keys(layerAttrs).map((key) =>
                            <SelectItem key={key} value={key}>
                                {key}
                            </SelectItem>
                        )}
                    </SelectContent>
                </Select>
                <Button onClick={(e) => addSelectedLayer(e)}> Add</Button>
            </div>
        </div>
      </fieldset>
    </form>
  )
}

export default ModelContainer;
