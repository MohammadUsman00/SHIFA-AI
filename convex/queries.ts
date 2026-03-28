import { query } from "./_generated/server";

export const getRecentQueries = query({
  handler: async (ctx) => {
    return await ctx.db.query("queries").order("desc").take(20);
  },
});
