import { createFileRoute } from '@tanstack/react-router'
import {Button} from "@/components/ui/button.tsx";
import {useMutation, useAction} from "convex/react";
import {api} from "../../convex/_generated/api";
import { useEffect, useState } from 'react';
import tf_data from './tf_layers_data.json'

export const Route: any = createFileRoute('/testing')({
  component: Test,
})

type  param = {name:string, type:Array<string>, desc: string, options?:Array<string>}
type  layer = {name:string, params: Array<param>}

function Test() {
    const save_layer = useMutation(api.layers.saveLayers)


    const save_all = async () => {
        for (let layer of tf_data) {
            const current_layer:layer = {
                name: layer.name,
                params: []
            }
            for (let param of layer.parameters) {
                const current_params:param =
                {
                    name:param.name,
                    desc: param.desc,
                    type: param.types.types
                }
                if (param.types.options.length)
                    current_params.options = param.types.options
                if (!current_params.type.length)
                    current_params.type = ['boolean']
                current_layer.params.push(current_params)
            }
            save_layer(current_layer);
            console.log("inserted", current_layer)
        }
    }

    useEffect(() => {
        // save_all().then(() => {})

    }, [])

  return (
    <div></div>
    // <div>
    //     <Button onClick={ () => featch_layers()}> Fetch layer types </Button>
    //     <div> LAYERS:
    //         { layers && layers.map((e:any, layerIdx) => (
    //             <>
    //                 <div> {e.name}: </div>
    //                 {
    //                     !saved[layerIdx] && <>
    //                         <div> {e.params.map((parameter:param, paramIdx:any) => (
    //                         <>
    //                             <input type="text" placeholder='Name' value={parameter.name} onChange={(e) => set_layer_param_name(e.target.value, layerIdx, paramIdx)}/>
    //                             <input type="text" placeholder='Desc' value={parameter.desc} onChange={(e) => set_layer_param_desc(e.target.value, layerIdx, paramIdx)}/>
    //                             <form>
    //                                 <select id="dropdown" onChange={(e) => set_layer_param(e.target.value, layerIdx, paramIdx)}>
    //                                     {types.map((type) => (
    //                                         <option>
    //                                             {type}
    //                                         </option>
    //                                     ))}
    //                                 </select>
    //                             </form>
    //                         </>

    //                     ))} </div>
    //                     <Button onClick={() => add_layer_param(layerIdx)}> Add Param</Button>
    //                     <Button onClick={() => save(layerIdx)}> Save</Button>
    //                     </>

    //                 }
    //             </>
    //             ))
    //         }
    //         </div>
    // </div>
  );
}
