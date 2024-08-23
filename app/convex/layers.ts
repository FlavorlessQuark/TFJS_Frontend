import {  mutation, query } from "./_generated/server";
import { v } from "convex/values";


/*
    One time use function only. Adds layer type to the database. Not a production function
 */

export const saveLayers = mutation({
  args: {
    name: v.string(),
    params: v.array(
        v.object({
            name: v.string(),
            desc: v.string(),
            type: v.array(v.string()),
            options: v.optional(v.array(v.string()))
    }))},
  handler: async (ctx, args) => {
    await ctx.db.insert("layerTypes", args)

  },
});

export const getLayers = query({
    args: {},
    handler: async (ctx, _) => {
        return await ctx.db.query("layerTypes").collect()
    }
})
