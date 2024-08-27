import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ModelParamValue = ({selectedType, setSelectedParamValue, options}) =>
{
    return (
        <>
            { selectedType == "number" &&
                    <div>
                        <input onChange={(e) => setSelectedParamValue(parseInt(e.target.value))} type="number"></input>
                    </div>
            }
            { selectedType == "string" &&
                    <Select  onValueChange={(e) => {setSelectedParamValue(e);}}>
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
