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

export const saveCabinetItem = mutation({
  args: {
    clientId: v.string(),
    profileId: v.string(),
    medicineName: v.string(),
    nameUrdu: v.optional(v.string()),
    dosage: v.optional(v.string()),
    timing: v.optional(v.string()),
    purpose: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("cabinetItems")
      .withIndex("by_client_profile", (q) =>
        q.eq("clientId", args.clientId).eq("profileId", args.profileId)
      )
      .filter((q) => q.eq(q.field("medicineName"), args.medicineName))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        nameUrdu: args.nameUrdu,
        dosage: args.dosage,
        timing: args.timing,
        purpose: args.purpose,
        savedAt: Date.now(),
      });
      return existing._id;
    }

    return await ctx.db.insert("cabinetItems", {
      ...args,
      purchased: false,
      savedAt: Date.now(),
    });
  },
});

export const removeCabinetItem = mutation({
  args: { id: v.id("cabinetItems") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const toggleCabinetPurchased = mutation({
  args: { id: v.id("cabinetItems"), purchased: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { purchased: args.purchased });
  },
});

export const createShareLink = mutation({
  args: {
    token: v.string(),
    payload: v.string(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("shareLinks", {
      token: args.token,
      payload: args.payload,
      expiresAt: args.expiresAt,
      createdAt: Date.now(),
    });
    return args.token;
  },
});
