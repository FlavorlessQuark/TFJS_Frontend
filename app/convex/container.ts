import {mutation, query} from "./_generated/server";
import { v} from "convex/values";
import { Id } from "./_generated/dataModel";

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
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const subject = identity.subject.split('|')[0];

    await ctx.db.insert("container", {
      ...args,
      creator: subject as Id<"users">,
    })
  }
});

/**
 * Queries for the container table
 */
export const getMyContainers = query({
  args: {},
  async handler(ctx) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

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