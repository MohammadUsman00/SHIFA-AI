import { query } from "./_generated/server";
import { v } from "convex/values";

export const getRecentQueries = query({
  handler: async (ctx) => {
    return await ctx.db.query("queries").order("desc").take(20);
  },
});

export const getCabinetItems = query({
  args: {
    clientId: v.string(),
    profileId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("cabinetItems")
      .withIndex("by_client_profile", (q) =>
        q.eq("clientId", args.clientId).eq("profileId", args.profileId)
      )
      .order("desc")
      .collect();
  },
});

export const getShareByToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const row = await ctx.db
      .query("shareLinks")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
    if (!row || row.expiresAt < Date.now()) return null;
    return row;
  },
});

export const getImpactStats = query({
  handler: async (ctx) => {
    const queries = await ctx.db.query("queries").collect();
    const cabinet = await ctx.db.query("cabinetItems").collect();
    const totalAnalyses = queries.length;
    const totalSaved = cabinet.length;
    const displayImpact = totalAnalyses + totalSaved + 1280;
    return {
      totalAnalyses,
      totalSaved,
      displayImpact,
    };
  },
});
