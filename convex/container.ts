import {internalQuery, mutation, query } from "./_generated/server";
import {ConvexError, v} from "convex/values";
import { user, allowed } from "./helpers";
import { internal } from "./_generated/api";

/**
 * Mutations for the container table
 * @param name
 * @param description
 * @param tags
 * @param public
 * @returns {Promise<void>}
 */
export const createContainer = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    sharedWith: v.optional(v.array(v.id("users"))),
    public: v.boolean(),
  },
  async handler(ctx, args) {
    const userId = await user(ctx);

    const container = await ctx.db.insert("container", {
      ...args,
      sharedWith: [userId],
      creator: userId,
    });

    if (args.tags) {
      const tagIds = [];
      for (const tag of args.tags) {
        const newTag = await ctx.db.insert("tags", {
          name: tag,
          creator: userId,
        });
        tagIds.push(newTag);
      }
      await ctx.db.patch(container, { tags: tagIds });
    }

    return {
      message: "Container created",
      status: 200,
      container: container,
    }
  }
});

/**
 * Delete container and all models associated with it
 * @param id
 * @returns {Promise<void>}
 */
export const deleteContainer = mutation({
  args: {
    id: v.id("container"),
  },
  async handler(ctx, args) {
    const userId = await user(ctx);
    const container = await ctx.db.get(args.id);

    if (container && container.creator == userId) {
      const models = container?.models;

      if (models) {
        for (const model of models) {
          await ctx.db.delete(model);
        }
      }

      await ctx.db.delete(args.id);
    }
  }
});

/**
 * Queries for the container table
 * @returns {Promise<Container[]>}
 */
export const getMyContainers = query({
  args: {},
  async handler(ctx) {
    const userId = await user(ctx);

    const containers = await ctx.db
      .query("container")
      .withIndex("by_creator", (q) =>
        q.eq("creator", userId)
      )
      .collect();

      const containersWithCreator = await Promise.all(containers.map(async (container) => {
        const creator = await ctx.db
          .query("users")
          .filter((q) => q.eq(q.field("_id"), container.creator))
          .unique();
        return {
          ...container,
          creator: creator,
        };
      }));

      return containersWithCreator;
  }
});

/**
 * Get a container by id
 * @param id
 * @returns {Promise<Container>}
 */
export const getContainer = query({
  args: {
    id: v.id("container"),
  },
  handler: async (ctx, args) => {
    const userId = await user(ctx);
    const container = await ctx.db.get(args.id);
    const authorized = await allowed(ctx, args.id);

    if (!userId) {
      throw new ConvexError({
        message: "No credentials provided",
        severity: "low",
      });
    }

    if (!authorized) {
      throw new ConvexError({
        message: "You do not have permission to view this container",
        severity: "low",
      });
    }

    if (!container) {
      throw new ConvexError({
        message: "Container not found",
        severity: "low",
      });
    }

    console.log("container past second check")

    const creator = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("_id"), container.creator))
        .unique()

    if (!creator) {
      throw new ConvexError({
        message: "Container creator not found",
        severity: "low",
      });
    }

    const liked = container.likes?.includes(userId);

    return {
      ...container,
      creator: creator,
      liked,
    };
  }
});

/**
 * Get all public containers
 * @returns {Promise<Container[]>}
 */
export const getCommunityContainers = query({
  args: {},
  async handler(ctx) {

    const containers = await ctx.db
      .query("container")
      .withIndex("by_public", (q) =>
        q.eq("public", true)
      )
      .collect();

      const containersWithCreator = await Promise.all(containers.map(async (container) => {
        const creator = await ctx.db
          .query("users")
          .filter((q) => q.eq(q.field("_id"), container.creator))
          .unique();
        return {
          ...container,
          creator: creator,
        };
      }));

      return containersWithCreator;
  }
});

/**
 * Create a new model and add it to the container
 * @param id
 * @param name
 * @returns {Promise<void>}
 */
export const createContainerModel = mutation({
    args: {
        id: v.id("container"),
        name: v.string(),
    },
    handler: async(ctx, args) => {
        const userId = await user(ctx);


        const model = await ctx.db.insert("model", {name: args.name, layers: []})

        const container = await ctx.db.get(args.id)


        if (container && container.creator == userId) {
            if (!container.models)
                container.models = []
            container.models.push(model)

            await ctx.db.patch(args.id, {models: container.models})
        }

        return { 
          _id: model, 
          name: args.name, 
          layers: [],
          logs: {},
          message: "Model created",
          status: 200,
        };
    }
})

/**
 * Get container models
 * @param id
 * @returns {Promise<Model[]>}
 */
export const getContainerModels = query({
    args: {
        id: v.id("container"),
    },
    handler: async(ctx, args) => {
      const userId = await user(ctx);

      if (!userId) {
        throw new ConvexError({
          message: "Unauthorized",
          severity: "low",
        })
      }

      const container = await ctx.db.get(args.id)

      const modelPromises = (container?.models || []).map(async (id) => {
          const model = await ctx.db.get(id)

          if (model) {
              return model
          }

          return null
      })

      return await Promise.all(modelPromises)
    }
})

/**
 * Delete a model from the container
 * @param containerId
 * @param modelId
 * @returns {Promise<void>}
 */
export const deleteContainerModel = mutation({
    args: {
        containerId: v.id("container"),
        modelId: v.id("model"),
    },
    handler: async(ctx, args) => {
        const userId = await user(ctx);

        const container = await ctx.db.get(args.containerId)

        if (container && container.creator == userId) {
            const models = container?.models?.filter((id) => id != args.modelId)

            await ctx.db.patch(args.containerId, {models});
            await ctx.db.delete(args.modelId);
        }
    }
})

/**
 * Saves the given model layers and parameters to the container model
 * @param id
 * @param layers
 * @returns {Promise<void>}
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

    await ctx.db.patch(id, {
      layers
    })
  },
});

/**
 * Toggle like on a container
 * @param id
 */
export const toggleLikes = mutation({
  args: {
    id: v.id("container"),
  },
  async handler(ctx, args) {
    const userId = await user(ctx);

    const container = await ctx.db.get(args.id);

    if (container) {
      const likes = container.likes || [];
      const index = likes.indexOf(userId);

      if (index === -1) {
        likes.push(userId);
      } else {
        likes.splice(index, 1);
      }

      await ctx.db.patch(args.id, {
        likes
      });

      return {
        message: "Container liked",
        status: 200,
      }
  }}
});

/**
 * Increment the views of a container
 * @param id
 */
export const incrementViews = mutation({
  args: {
    id: v.id("container"),
  },
  async handler(ctx, args) {
    const container = await ctx.db.get(args.id);
    await ctx.db.patch(args.id, {views: (container?.views || 0) + 1});
  }
});


/**
 * Add tags to a container
 * @param id
 * @param tags
 * @returns {Promise<void>}
 */
export const addTags = mutation({
  args: {
    id: v.id("container"),
    tags: v.array(v.string()),
  },
  async handler(ctx, args) {
    const container = await ctx.db.get(args.id);
    await ctx.db.patch(args.id, {tags: [...(container?.tags || []), ...args.tags]});
  }
});
