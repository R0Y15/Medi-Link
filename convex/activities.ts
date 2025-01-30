import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all activities sorted by timestamp
export const getAll = query({
  handler: async (ctx) => {
    const activities = await ctx.db
      .query("activities")
      .order("desc")
      .collect();
    return activities;
  },
});

// Get activities by type
export const getByType = query({
  args: { type: v.string() },
  handler: async (ctx, args) => {
    const activities = await ctx.db
      .query("activities")
      .filter((q) => q.eq(q.field("type"), args.type))
      .order("desc")
      .collect();
    return activities;
  },
});

// Get activities by category
export const getByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    const activities = await ctx.db
      .query("activities")
      .filter((q) => q.eq(q.field("category"), args.category))
      .order("desc")
      .collect();
    return activities;
  },
});

// Create a new activity
export const create = mutation({
  args: {
    type: v.string(),
    title: v.string(),
    description: v.string(),
    timestamp: v.string(),
    category: v.string(),
    status: v.string(),
    relatedId: v.optional(v.string()),
    metadata: v.optional(v.object({
      doctorName: v.optional(v.string()),
      location: v.optional(v.string()),
      speciality: v.optional(v.string()),
      prescription: v.optional(v.array(v.string())),
      testResults: v.optional(v.array(v.string())),
      notes: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const activityId = await ctx.db.insert("activities", {
      type: args.type,
      title: args.title,
      description: args.description,
      timestamp: args.timestamp,
      category: args.category,
      status: args.status,
      relatedId: args.relatedId,
      metadata: args.metadata,
    });
    return activityId;
  },
}); 