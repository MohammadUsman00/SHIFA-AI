import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const saveQuery = mutation({
  args: {
    medicineName: v.string(),
    inputType: v.union(v.literal("text"), v.literal("image")),
    response: v.string(),
    sources: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("queries", {
      ...args,
      timestamp: Date.now(),
    });
  },
});
