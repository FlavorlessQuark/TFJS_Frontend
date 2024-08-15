"use node"
import { action } from "./_generated/server";
import tf from "@tensorflow/tfjs"
import { build_model } from "./tensorflow/tf_model";

const models: Array<tf.LayersModel> = []

export const _createModelAction = action({
  args: {},
  handler: async () => {
    const model:tf.LayersModel = build_model()
    models.push(model)
    // do something with data\
    console.log("Total models created", models.length)
    return models.length;
  },
});

