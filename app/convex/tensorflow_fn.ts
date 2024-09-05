"use node"
import { action, internalQuery, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api"
import tf, { layers } from "@tensorflow/tfjs"
import { v } from "convex/values";
import { mappings } from "./tensorflow/tf_fn_mapping";
import { make_dummy_data } from "./tensorflow/data";
import { getModel } from "./model";
import { build_model } from "./tensorflow/tf_model";

const train_data: Array<number> = [1,2,3,4,5,6,7,8,9,20]
const train_ans = train_data.map((e) =>  e * 2)

export const run_model = action({
  args: {id: v.id('model')},
  handler: async (ctx, args) => {

    const _model_data = await ctx.runQuery(internal.model.getModel, {id: args.id})

    const model = tf.sequential();
    const data = make_dummy_data();

    build_model(model, _model_data?.layers)

    await model.fit(data.train.x, data.train.y, {
        batchSize: 5,
        validationData: [data.validation.x, data.validation.y],
        epochs: 10,
        shuffle: true,
        callbacks: {
            onTrainBegin: async () => {
            console.log("onTrainBegin")
            },
            onTrainEnd: async () => {
            console.log("onTrainEnd")
            },
            onBatchEnd: async (epoch, logs) => {
                const info = (logs as tf.Logs)
                await ctx.runMutation(internal.model.updateModel_Logs, {logs: JSON.stringify(logs), id:args.id, batchNum:epoch})
            }
        }})

    const result = (model.evaluate(data.test.x, data.test.y))

    console.log("result", result)
}});


