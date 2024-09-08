import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Button } from "../ui/button";
import ModelParamValue from "./model.params";
import { cn } from "@/lib/utils";

interface LayerParams {
  [key: string]: {
    map(arg0: (type: string) => import("react/jsx-runtime").JSX.Element): import("react").ReactNode;
    desc: string;
    name: string;
    type: string[];
    options?: string[];
  };
}

interface Layer {
  name: string;
  parameters: Array<{ name: string; value: any }>;
}

interface ModelLayerProps {
  layer?: Layer;
  layerIdx: number;
  params: LayerParams;
  addToLayer: any;
}

const ModelLayer = ({ layerIdx, params, addToLayer }: ModelLayerProps) => {
  const [selectedParam, setSelectedParam] = useState<string | undefined>(undefined)
  const [selectedParamValue, setSelectedParamValue] = useState<any>(undefined)
  const [selectedType, setSelectedType] = useState<string | undefined>(undefined)

    return (
        <>
            <Select onValueChange={(e) => {
                    setSelectedParam(e);
                    setSelectedType(undefined);
                    setSelectedParamValue(undefined)
                }}>
                <SelectTrigger id="model" className="items-start [&_[data-description]]:hidden mb-1">
                    <SelectValue placeholder="Select a parameter"/>
                </SelectTrigger>
                <SelectContent>
                    {params && Object.keys(params).map((key) =>
                        <SelectItem key={key} value={key}>
                            {key}
                        </SelectItem>
                    )}
                </SelectContent>
            </Select>
            
            {selectedParam && params &&
                <Select onValueChange={(e) => {setSelectedType(e); setSelectedParamValue("")}}>
                    <SelectTrigger id="model" className={cn("items-start [&_[data-description]]:hidden", selectedType && "mb-1")}>
                        <SelectValue placeholder="Select a type"/>
                    </SelectTrigger>
                    <SelectContent>
                        {params[selectedParam]?.type?.map((type: string) =>
                            <SelectItem key={type} value={type}>
                                {type}
                            </SelectItem>
                        )}
                    </SelectContent>
                </Select>
            }

            {
            selectedType && selectedParam && 
             <ModelParamValue 
                setSelectedParamValue={setSelectedParamValue} 
                selectedType={selectedType} 
                options={params[selectedParam]?.options || []} 
             />
            }

            <Button 
                className="mt-1 w-full  !bg-zinc-100 hover:!bg-zinc-300 hover:!text-zinc-950" 
                onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    if (selectedParam && selectedParamValue !== undefined) {
                        addToLayer(e, layerIdx, {name: selectedParam, value: selectedParamValue});
                    }
                }}
                disabled={!selectedParam || selectedParamValue === undefined}
            > 
                Add param
            </Button>
        </>
    )
}

export default ModelLayer;
