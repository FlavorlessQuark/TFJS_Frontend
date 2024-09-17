import { ConvexError, v } from "convex/values";
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

export const getSet = internalQuery({
    args: {
        id: v.id('dataset'),
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
        public: v.optional(v.boolean()),
        file: v.any(),
        filetype: v.string(),
    },
    handler: async (ctx, args) => {
        let file;

        console.log("args", args)
        console.log("file", args.file)

        if (args.filetype == "text/json")
            file = dataParseFrom_Json(args.file)
        if (args.filetype == "text/csv")
            file = dataParseFrom_Csv(args.file)

        console.log("file", file)

        let dataset;
        if (file) {
            const refId = await ctx.db.insert("dataref", file)
            const self = await user(ctx)

            console.log("refId", refId)
            console.log("self", self)

            dataset = await ctx.db.insert('dataset', {
                name:args.name,
                description: args.description,
                dataref: refId,
                tags: args.tags,
                creator: self,
                public: args.public,
                xshape:file.xshape,
                yshape:file.yshape
            })

            if (args.id)
                await ctx.db.patch(args.id, {dataset: dataset})
        }

        console.log("dataset", dataset)

        return {
            message: "Dataset created",
            status: 200,
            dataset: dataset
        }
    }
})

export const generateUploadUrl = mutation(async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("you must be logged in to upload a file");
    }

    return await ctx.storage.generateUploadUrl();
  });


