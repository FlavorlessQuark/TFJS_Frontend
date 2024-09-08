import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { user } from "./helpers";

/**
 * Create a new tag
 * @param name
 * @returns {Promise<void>}
 */
export const createTag = mutation({
  args: {
    name: v.string(),
  },
  async handler(ctx, args) {
    const userId = await user(ctx);

    const tag = await ctx.db.insert("tags", {
      name: args.name,
      creator: userId,
    });

    return tag;
  },
});

/**
 * Get all tags from the user and populate them
 * @returns {Promise<Tag[]>}
 */
export const getTags = query({
  args: {},
  async handler(ctx) {
    const userId = await user(ctx);

    const tags = await ctx.db.query("tags").collect();

    return tags;
  },
});