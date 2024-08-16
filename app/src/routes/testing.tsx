import { createFileRoute } from '@tanstack/react-router'
import {Button} from "@/components/ui/button.tsx";
import {useMutation, useAction} from "convex/react";
import {api} from "../../convex/_generated/api";
import { useState } from 'react';


export const Route: any = createFileRoute('/testing')({
  component: Test,
})

type  param = {name:string, type:string}
type  layer = {name:string, params: Array<param>}

function Test() {
    const fetchLayersQuery = useAction(api.tensorflow_fn.list_layers)
    const save_layer = useMutation(api.model.save_layer)
    const types = ["number", "tensor", "number or tensor", "string", "boolean"]
    const [layers, editLayers] = useState<Array<layer>>([])

    const featch_layers = async () =>
    {
        const res = await fetchLayersQuery();
        console.log("Function values", res)

        const fn_form: Array<layer> = []
        for (let fn of res) {
            fn_form.push(
                {
                    name: fn,
                    params: []
                }
            )
        }

        editLayers(fn_form)
    }

    const save = async(i: number) => {
        save_layer(layers[i])
    }

    const add_layer_param = (layer: number) => {
        layers[layer].params.push({name:"_", type:"number"})
        editLayers([...layers])
    }
    const set_layer_param = (type:string, layer: number, param:number) => {
        layers[layer].params[param].type = type;
        // console.log(layers[layer])
        editLayers([...layers])
    }
    const set_layer_param_name = (name:string, layer: number, param:number) => {
        layers[layer].params[param].name = name;
        // console.log(layers[layer])
        editLayers([...layers])

    }

  return (
    <div>
        <Button onClick={ () => featch_layers()}> Fetch layer types </Button>
        <div> LAYERS:
            { layers && layers.map((e:any, layerIdx) => (
                <>
                    <div> {e.name}: </div>
                    <div> {e.params.map((parameter:param, paramIdx:any) => (
                        <>
                            {parameter.name}
                            <input type="text" placeholder='Param' value={layers[layerIdx].params[paramIdx].name} onChange={(e) => set_layer_param_name(e.target.value, layerIdx, paramIdx)}/>
                            <form>
                                <select id="dropdown" onChange={(e) => set_layer_param(e.target.value, layerIdx, paramIdx)}>
                                    {types.map((type) => (
                                        <option>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </form>
                        </>

                    ))} </div>
                    <Button onClick={() => add_layer_param(layerIdx)}> Add Param</Button>
                    <Button onClick={() => save(layerIdx)}> Save</Button>
                </>
                ))
            }
            </div>
    </div>
  );
}
