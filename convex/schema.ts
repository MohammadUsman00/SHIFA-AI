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

  cabinetItems: defineTable({
    clientId: v.string(),
    profileId: v.string(),
    medicineName: v.string(),
    nameUrdu: v.optional(v.string()),
    dosage: v.optional(v.string()),
    timing: v.optional(v.string()),
    purpose: v.optional(v.string()),
    purchased: v.boolean(),
    savedAt: v.number(),
  }).index("by_client_profile", ["clientId", "profileId"]),

  shareLinks: defineTable({
    token: v.string(),
    payload: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
  }).index("by_token", ["token"]),
});
