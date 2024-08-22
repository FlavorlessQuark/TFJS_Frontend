import {mutation, query} from "./_generated/server";
import { v} from "convex/values";
import { Id } from "./_generated/dataModel";

const confirmAuth = async (ctx:any) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    return identity
}


/**
 * Mutations for the container table
 */
export const createContainer = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    public: v.boolean(),
  },
  async handler(ctx, args) {
    const identity = await confirmAuth(ctx);

    const subject = identity.subject.split('|')[0];

    await ctx.db.insert("container", {
      ...args,
      creator: subject as Id<"users">,
    })
  }
});


/*
    Delete container AND ALL models it contains
 */


export const deleteContainer = mutation({
  args: {
    id: v.id("container"),
  },
  async handler(ctx, args) {
     await confirmAuth(ctx);

    const models = (await ctx.db.get(args.id))?.models

    if (models) {
        for (let model of models)
            await ctx.db.delete(model)
    }

    await ctx.db.delete(args.id)

  }
});


/**
 * Queries for the container table
 */
export const getMyContainers = query({
  args: {},
  async handler(ctx) {
    const identity = await confirmAuth(ctx);

    const subject = identity.subject.split('|')[0];

    return await ctx.db
      .query("container")
      .withIndex("by_creator", (q) =>
        q.eq("creator", subject as Id<"users">)
      )
      .collect();
  }
});

export const getCommunityContainers = query({
  args: {},
  async handler(ctx) {

    return await ctx.db
      .query("container")
      .withIndex("by_public", (q) =>
        q.eq("public", true)
      )
      .collect();
  }
});

export const createContainerModel = mutation({
    args: {
        id: v.id("container"),
        name: v.string(),
    },
    handler: async(ctx, args) => {
        const model = await ctx.db.insert("model", {name: args.name, layers: []})

        const container = await ctx.db.get(args.id)

        container?.models?.push(model)

        await ctx.db.patch(args.id, {models: container?.models})
    }
})

export const deleteContainerModel = mutation({
    args: {
        containerId: v.id("container"),
        modelId: v.id("model"),
    },
    handler: async(ctx, args) => {
        const container = await ctx.db.get(args.containerId)

        const models = container?.models?.filter((id) => id != args.modelId)

        await ctx.db.patch(args.containerId, {models});
        await ctx.db.delete(args.modelId);
    }
})


/*
    Saves the given model layers and parameters
 */
export const saveContainerModel = mutation({
  args: {
    id: v.id("model"),
    layers: v.array(v.object({
        name: v.string(),
        parameters: v.array(v.object({
                    name: v.string(),
                    value: v.union(v.string(), v.number(), v.array(v.number()), v.boolean())
            }))
        }
    ))},
  handler: async (ctx, args) => {
    const {id, layers} = args
    ctx.db.patch(id, {layers})

  },
});
