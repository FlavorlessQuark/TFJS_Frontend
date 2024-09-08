import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "../ui/input";

interface ModelParamValueProps {
    selectedType: string;
    setSelectedParamValue: (value: any) => void;
    options: string[];
}

const ModelParamValue = ({selectedType, setSelectedParamValue, options}: ModelParamValueProps) =>
{
    return (
        <>
            { selectedType == "number" &&
                    <div>
                        <Input onChange={(e) => setSelectedParamValue(parseInt(e.target.value))} type="number" />
                    </div>
            }
            { selectedType == "string" &&
                    <Select onValueChange={(e) => {setSelectedParamValue(e);}}>
                        <SelectTrigger  id="model" className="items-start [&_[data-description]]:hidden">
                            <SelectValue  placeholder="Select a value"/>
                        </SelectTrigger>
                        <SelectContent>
                            {options.map((option:string) =>
                                <>
                                    <SelectItem key={option} value={option}  >
                                        {option}
                                    </SelectItem>
                                </>
                            )}
                        </SelectContent>
                    </Select>
            }
            {
                selectedType == "[]" &&
                    <div>
                        <input defaultValue={"Enter comma separated values"} onChange={(e) =>
                            {
                                const strArr = e.target.value.split(",");
                                setSelectedParamValue(strArr.map(Number));
                            }
                        } type="text"></input>
                    </div>
            }
            {
                selectedType == "Tensor" &&
                    <div>Not yet supported</div>
            }
        </>

    )
}

export default ModelParamValue
