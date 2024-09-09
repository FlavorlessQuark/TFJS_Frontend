import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";



/**
 * Get a model by id
 * @param id
 * @returns {Promise<Model>}
 */
export const getModel = internalQuery({
    args: {
        id: v.id("model"),
    },
    handler: async(ctx, args) => {
        return await ctx.db.get(args.id)
    }
})

export const updateModel_Logs = internalMutation({
    args: {
        id: v.id('model'),
        logs: v.any(),
        batchNum: v.number(),
    },
    handler: async (ctx, args) => {
        const model = await ctx.db.get(args.id)

        if (model) {

            if (!model.logs)  {
                model.logs = {logs: []}
            }
            if (model.logs && model.logs.logs.length > args.batchNum) {
                model.logs.logs = []
            }
            model.logs.logs.push(args.logs)
            ctx.db.patch(args.id, model)
        }

    }
})

<<<<<<< HEAD:convex/model.ts
export const deleteModel = mutation({
    args: {
        id: v.id('model'),
    },
    handler: async (ctx, args) => {
        const model = await ctx.db.delete(args.id)

        return {
            message: "Model deleted",
            status: 200,
            model: model,
        }
    }
})
=======




>>>>>>> c164a9f (backend for filr upload and refactor model/ data):app/convex/model.ts
