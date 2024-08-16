import {  mutation } from "./_generated/server";
import { v } from "convex/values";


export const save_layer = mutation({
  args: {
    name: v.string(),
    params: v.array(
        v.object({
            name: v.string(),
            desc: v.string(),
            type: v.string()
    }))},
  handler: async (ctx, args) => {
    await ctx.db.insert("layerTypes", {name: args.name, params: args.params})

  },
});
