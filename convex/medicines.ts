import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all medicines
export const getAll = query({
  handler: async (ctx) => {
    const medicines = await ctx.db.query("medicines").collect();
    return medicines;
  },
});

// Get medicine by ID
export const getById = query({
  args: { id: v.id("medicines") },
  handler: async (ctx, args) => {
    const medicine = await ctx.db.get(args.id);
    return medicine;
  },
});

// Create new medicine
export const create = mutation({
  args: {
    name: v.string(),
    stock: v.number(),
    category: v.string(),
    price: v.number(),
    expiryDate: v.string(),
    status: v.union(v.literal("In Stock"), v.literal("Low Stock"), v.literal("Out of Stock")),
  },
  handler: async (ctx, args) => {
    const medicineId = await ctx.db.insert("medicines", args);
    return medicineId;
  },
});

// Update medicine
export const update = mutation({
  args: {
    id: v.id("medicines"),
    name: v.optional(v.string()),
    stock: v.optional(v.number()),
    category: v.optional(v.string()),
    price: v.optional(v.number()),
    expiryDate: v.optional(v.string()),
    status: v.optional(v.union(v.literal("In Stock"), v.literal("Low Stock"), v.literal("Out of Stock"))),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});

// Delete medicine
export const remove = mutation({
  args: { id: v.id("medicines") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Get medicines by category
export const getByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    const medicines = await ctx.db
      .query("medicines")
      .filter((q) => q.eq(q.field("category"), args.category))
      .collect();
    return medicines;
  },
});

// Get low stock medicines
export const getLowStock = query({
  handler: async (ctx) => {
    const medicines = await ctx.db
      .query("medicines")
      .filter((q) => 
        q.eq(q.field("status"), "Low Stock")
      )
      .collect();
    return medicines;
  },
});

// Update stock level
export const updateStock = mutation({
  args: {
    id: v.id("medicines"),
    stock: v.number(),
  },
  handler: async (ctx, args) => {
    const { id, stock } = args;
    
    // Determine status based on stock level
    let status: "In Stock" | "Low Stock" | "Out of Stock" = "In Stock";
    if (stock === 0) {
      status = "Out of Stock";
    } else if (stock < 10) {
      status = "Low Stock";
    }

    await ctx.db.patch(id, { 
      stock,
      status,
    });
    
    return id;
  },
}); 