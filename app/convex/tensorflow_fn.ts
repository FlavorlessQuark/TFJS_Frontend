"use node"
import { action, internalQuery, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api"
import tf, { layers } from "@tensorflow/tfjs"
import { v } from "convex/values";
import { mappings } from "./tensorflow/tf_fn_mapping";

const train_data: Array<number> = [1,2,3,4,5,6,7,8,9,20]
const train_ans = train_data.map((e) =>  e * 2)

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
  args: {id: v.id('model')},
  handler: async (ctx, args) => {

    const _model_data = await ctx.runQuery(internal.container.getModel, {id: args.id})

    const model = tf.sequential();

    const model_training_x = tf.tensor(train_data).reshape([train_data.length, 1])
    const model_training_y = tf.tensor(train_ans).reshape([train_data.length, 1])

    let model_validation_x:Array<number> | tf.Tensor = [];
    let model_validation_y:Array<number> | tf.Tensor = [];

    const VALIDATION_COUNT = train_data.length;
    for (let i = 0; i < VALIDATION_COUNT; i++) {
        model_validation_x.push(train_data.length + i)
        model_validation_y.push((train_data.length + i) * 2)
    }

    model_validation_x = tf.tensor(model_validation_x).reshape([model_validation_x.length, 1])
    model_validation_y = tf.tensor(model_validation_y).reshape([model_validation_y.length, 1])

    console.log("Built data", _model_data)
    build_model(model, _model_data?.layers)

    console.log("Built model")
    await model.fit(model_training_x, model_training_y, {
        batchSize: 3,
        validationData: [model_validation_x, model_validation_y],
        epochs: 10,
        shuffle: true,
        callbacks: {
            onTrainBegin: async () => {
            console.log("onTrainBegin")
            },
            onTrainEnd: async () => {
            console.log("onTrainEnd")
            },
            onEpochBegin: async (epoch, logs) => {
            console.log("onEpochBegin" + epoch + JSON.stringify(logs))
            },
            onEpochEnd: async (epoch, logs) => {
            console.log("onEpochEnd" + epoch + JSON.stringify(logs))
            },
            onBatchBegin: async (epoch, logs) => {
            console.log("onBatchBegin" + epoch + JSON.stringify(logs))
            },
            onBatchEnd: async (epoch, logs) => {
            console.log("onBatchEnd" + epoch + JSON.stringify(logs))
            }        }

    });

    const TEST_SET_LEN = 50

    let test_xs:Array<number> | tf.Tensor = []
    let test_ys:Array<number> | tf.Tensor = []

    for (let i = 0; i < TEST_SET_LEN; i++) {
        const num = Math.ceil(Math.random() * 1000)
        test_xs.push(num)
        test_ys.push(num * 2)
    }

    test_xs = tf.tensor(test_xs).reshape([test_xs.length, 1])
    test_ys = tf.tensor(test_ys).reshape([test_ys.length, 1])

    const result = model.predict(test_xs)

    console.log("result", result)

}});


