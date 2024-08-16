import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  container: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    creator: v.id("users"),
    likes: v.optional(v.array(v.id("users"))),
    tags: v.optional(v.array(v.string())),
    model: v.optional(v.array(v.id("model"))),
    dataset: v.optional(v.any()),
    public: v.boolean(), // false by default
    sharedWith: v.optional(v.array(v.id("users"))),
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
        ))
    }),

    layerTypes : defineTable({
        name: v.string(),
        params: v.array(
            v.object({
                name: v.string(),
                desc: v.string(),
                type: v.string(),
                options: v.optional(v.array(v.string()))
        }))
    })
});
