"use node"


import { mappings } from "./tf_fn_mapping";
import tf, { layers } from "@tensorflow/tfjs";

export const build_model = (model: tf.Sequential,  model_layers:any) =>
{
    model.resetStates()
    for (const layer of model_layers) {
        if (layer.name in mappings)
        {
            const key = layer.name as keyof typeof mappings;
            const constructed_params:any = {}

            layer.parameters.map((param:any) => constructed_params[param.name] = param.value)

            console.log("Name", layer.name, "params", constructed_params)

            model.add(mappings[key](constructed_params));
        }
    }

    const optimizer = tf.train.adam();
    model.compile({
        optimizer: optimizer,
        loss: 'binaryCrossentropy',
        metrics: ['accuracy'],

    });
}
