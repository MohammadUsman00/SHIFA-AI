import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  queries: defineTable({
    medicineName: v.string(),
    inputType: v.union(v.literal("text"), v.literal("image")),
    response: v.string(),
    sources: v.optional(v.array(v.string())),
    timestamp: v.number(),
  }),
});
