"use node"


import { v } from "convex/values";
import { internal } from "../_generated/api";
import { action } from "../_generated/server";
import { dataMakeTensors, make_dummy_data } from "./data";
import { mappings } from "./tf_fn_mapping";
import tf, { layers } from "@tensorflow/tfjs";

 const build_model = (model: tf.Sequential,  model_layers:any) =>
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

export const run_model = action({
  args: {id: v.id('model'), refId: v.id("dataref")},
  handler: async (ctx, args) => {

    const _model = await ctx.runQuery(internal.model.getModel, {id: args.id})
    const dataset = await ctx.runQuery(internal.data.getRef, {id: args.refId});
    const model = tf.sequential();

    if (!dataset)
        throw "No dataset found";
    if (!_model)
        throw "No model found";
    // const data = make_dummy_data();
    const BATCHSIZE = 5;
    const EPOCHS = 10
    const TRAIN_COUNT = Math.floor(dataset.data.length * 0.37)
    const TEST_COUNT = Math.floor(dataset.data.length * 0.25)


    const [train, validation, test] = dataMakeTensors(dataset, TRAIN_COUNT, TEST_COUNT);
    build_model(model, _model.layers)

    await model.fit(train.x, train.y, {
        batchSize: BATCHSIZE,
        validationData: [validation.x, validation.y],
        epochs: EPOCHS,
        shuffle: true,
        callbacks: {
            onTrainBegin: async () => {
            console.log("onTrainBegin")
            },
            onTrainEnd: async () => {
            console.log("onTrainEnd")
            },
            onBatchEnd: async (epoch, logs) => {
                await ctx.runMutation(internal.model.updateModel_Logs, {logs: logs, id:args.id, batchNum:epoch})
            }
        }})

    const result = (model.evaluate(test.x, test.y))

    console.log("result", result)
}});
