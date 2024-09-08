import {MutationCtx, QueryCtx} from "./_generated/server";
import { ConvexError } from "convex/values";
import { Id } from "./_generated/dataModel";

/**
 * Get the user id from the context
 * @param ctx
 * @returns {Promise<Id<"users">>}
 */
export async function user(ctx : QueryCtx | MutationCtx): Promise<Id<"users">> {
  const identity = await ctx.auth.getUserIdentity()
  const subject = identity?.subject.split('|')[0] as Id<"users">;

  if (!identity) {
    throw new ConvexError({
      message: "You must be authenticated to perform this action",
      severity: "low",
    });
  }

  return subject;
}

/**
 * Check Permissions
 * @param ctx
 * @param id
 * @returns {Promise<boolean>}
 */
export async function allowed(ctx : QueryCtx | MutationCtx, id: Id<"container">): Promise<boolean> {
  const userId = await user(ctx);
  const container = await ctx.db.get(id);

  if (!container) {
    throw new ConvexError({
      message: "Container not found",
      severity: "low",
    });
  }

  const allowed = container.sharedWith?.some((id) => id == userId) ||  container.creator == userId;

  if (!allowed) {
    throw new ConvexError({
      message: "You do not have permission to view this container",
      severity: "low",
    });
  }

  return true;
}
