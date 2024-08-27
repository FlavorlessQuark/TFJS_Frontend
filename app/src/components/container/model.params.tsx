import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGlobalState } from "@/providers/StateProvider";
import { useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Button } from "../ui/button";

const ModelParams = ({params}) => {
  const [selectedParam, setSelectedParam] = useState("")
  const [selectedParamValue, setSelectedParamValue] = useState("")
  const [selectedType, setSelectedType] = useState("")


    return (
        <div>
            <Select  onValueChange={(e) => setSelectedParam(e)}>
                <SelectTrigger  id="model" className="items-start [&_[data-description]]:hidden">
                    <SelectValue  placeholder="Select a parameter"/>
                </SelectTrigger>
                <SelectContent>
                    { params && Object.keys(params).map((key) =>
                        <>
                            <SelectItem key={key} value={key}  >
                                {key}
                            </SelectItem>
                        </>
                    )}
                </SelectContent>
            </Select>
            {/* {
                <Select  onValueChange={(e) => setSelectedParam(e)}>
                <SelectTrigger  id="model" className="items-start [&_[data-description]]:hidden">
                    <SelectValue  placeholder="Select a type"/>
                </SelectTrigger>
                <SelectContent>
                    {layerAttrs &&  layerAttrs[layer.name] && layerAttrs[layer.name][selectedParam] && layerAttrs[layer.name][selectedParam].type.map((type) =>
                        <>
                            <SelectItem key={type} value={type}  >
                                {type}
                            </SelectItem>
                        </>
                    )}
                </SelectContent>
            </Select>

            } */}
        </div>
    )
}

export default ModelParams
