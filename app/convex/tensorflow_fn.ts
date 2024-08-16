"use node"
import { action, mutation } from "./_generated/server";
import tf from "@tensorflow/tfjs"
import { v } from "convex/values";
import { any } from "prop-types";

const models: Array<tf.LayersModel> = []

export const list_layers = action({
  args: {},
  handler: async () => {

    return Object.getOwnPropertyNames(tf.layers).filter(function(property) {
        return typeof ((tf.layers as any)[property]) == 'function';
    });
  },
});


