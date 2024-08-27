import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Button } from "../ui/button";
import ModelParamValue from "./model.params";

const ModelLayer = ({layer, layerIdx, params, addToLayer}) => {
  const [selectedParam, setSelectedParam] = useState(undefined)
  const [selectedParamValue, setSelectedParamValue] = useState<any>(undefined)
  const [selectedType, setSelectedType] = useState<any>(undefined)

    return (
        <>
            <Select onValueChange={(e) => {
                    setSelectedParam(e);
                    setSelectedType(undefined);
                    setSelectedParamValue(undefined)
                }}>
                <SelectTrigger  id="model" className="items-start [&_[data-description]]:hidden">
                    <SelectValue  placeholder="Select a parameter"/>
                </SelectTrigger>
                <SelectContent>
                    {params && Object.keys(params).map((key) =>
                        <>
                            <SelectItem key={key} value={key}  >
                                {key}
                            </SelectItem>
                        </>
                    )}
                </SelectContent>
            </Select>
            { selectedParam &&
                <Select  onValueChange={(e) => {setSelectedType(e); setSelectedParamValue("")}}>
                    <SelectTrigger  id="model" className="items-start [&_[data-description]]:hidden">
                        <SelectValue  placeholder="Select a type"/>
                    </SelectTrigger>
                    <SelectContent>
                        {selectedParam && params[selectedParam].type.map((type) =>
                            <>
                                <SelectItem key={type} value={type}  >
                                    {type}
                                </SelectItem>
                            </>
                        )}
                    </SelectContent>
                </Select>
            }
            {selectedType && <ModelParamValue setSelectedParamValue={setSelectedParamValue} selectedType={selectedType} options={params[selectedParam].options} />}

            <Button onClick={(e) => addToLayer(e, layerIdx,{name: selectedParam, value: selectedParamValue})}> Add param</Button>
        </>

    )
}

export default ModelLayer
