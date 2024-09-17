import { v } from "convex/values";
import { internalMutation, internalQuery, mutation } from "./_generated/server";



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
        console.log("updating logs")
        const model = await ctx.db.get(args.id)
        if (model) {

            if (!model.logs)  {
                model.logs = {logs: []}
            }
            if (model.logs && model.logs.logs.length > args.batchNum) {
                model.logs.logs = []
            }
            const formattedLogs = args.logs.map((log:any) => {
                let logObj = log
                try {
                    logObj = JSON.parse(log);
                } catch {}
                let output = "";
                for (const key in logObj) {
                    if (key !== "batch") {
                        output += `${key}: ${typeof logObj[key] === "number" ? logObj[key].toFixed(2) : logObj[key]}  `;
                    }
                }
                return output;
            });
            // let logObj = args.logs
            // try {
            //     logObj = JSON.parse(args.logs);
            // } catch {}
            // let output = "";
            // for (const key in logObj) {
            //     if (key !== "batch") {
            //         output += `${key}: ${logObj[key]}  `;
            //     }
            // }
            model.logs.logs = formattedLogs
            await ctx.db.patch(args.id, model)
        }

    }
})

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




