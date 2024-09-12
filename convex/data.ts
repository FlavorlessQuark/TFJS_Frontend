import { v } from "convex/values";
import { internalQuery, mutation } from "./_generated/server";
import { dataParseFrom_Csv, dataParseFrom_Json } from "./tensorflow/data";
import { user } from "./helpers";


export const getRef = internalQuery({
    args: {
        id: v.id('dataref'),
    },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    }
})

export const saveDataset = mutation({
    args: {
        id: v.optional(v.id("container")),
        name:v.string(),
        description: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
        file: v.any(),
        filetype: v.string(),
    },
    handler: async (ctx, args) => {
        let file = undefined;

        if (args.filetype == "json")
            file = dataParseFrom_Json(args.file)
        if (args.filetype == "csv")
            file = dataParseFrom_Csv(args.file)

        if (file) {

        const refId = await ctx.db.insert("dataref", file)
        const self = await user(ctx)

        const dataset = await ctx.db.insert('dataset', {
            name:args.name,
            description: args.description,
            dataref: refId,
            tags: args.tags,
            creator: self,
        })

        if (args.id)
            await ctx.db.patch(args.id, {dataset: dataset})
        }
    }
})



