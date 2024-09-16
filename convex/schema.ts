import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";
import { object } from "prop-types";

export default defineSchema({
  ...authTables,
  container: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    creator: v.id("users"),
    likes: v.optional(v.array(v.id("users"))),
    tags: v.optional(v.array(v.string())),
    models: v.optional(v.array(v.id("model"))),
    dataset: v.optional(v.id("dataset")),
    public: v.boolean(),
    views: v.optional(v.number()),
    sharedWith: v.optional(v.array(v.id("users"))),
    compileOptions: (v.object({
        batchSize: v.number(),
        epochs:v.number(),
        loss:v.string(),
        metrics:v.string()
    }))
  })
    .index("by_creator", ["creator"])
    .index("by_public", ["public"]),
    model : defineTable({
      name: v.string(),
      layers: v.array(v.object({
        name: v.string(),
        parameters: v.array(v.object({
          name: v.string(),
          value: v.union(v.string(), v.number(), v.array(v.number()), v.boolean())
            }))
        }
      )),
      logs : v.optional(v.any())
    }),
    layerTypes : defineTable({
        name: v.string(),
        params: v.array(
            v.object({
                name: v.string(),
                desc: v.string(),
                type: v.array(v.string()),
                options: v.optional(v.array(v.string()))
        }))
    }),
    tags: defineTable({
      name: v.string(),
      creator: v.id("users"),
    }),
    dataset:defineTable({
        name: v.string(),
        creator: v.id('users'),
        description: v.optional(v.string()),
        tags:v.optional(v.array(v.string())),
        dataref: v.id("dataref")
    }),
    dataref:defineTable({
        data: v.object({
            x:v.array(v.array(v.any())),
            y:v.array(v.array(v.any())),
        }),
        xshape:v.array(v.number()),
        yshape:v.array(v.number())
    })
});
