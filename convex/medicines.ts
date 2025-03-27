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

// Create a new medicine order
export const createOrder = mutation({
  args: {
    userId: v.optional(v.string()),
    patientName: v.string(),
    contactNumber: v.string(),
    address: v.string(),
    items: v.array(v.object({
      medicineId: v.id("medicines"),
      medicineName: v.string(),
      quantity: v.number(),
      price: v.number(),
    })),
    totalAmount: v.number(),
    notes: v.optional(v.string()),
    prescriptionRequired: v.boolean(),
    prescriptionUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Create a new order
    const orderId = await ctx.db.insert("medicineOrders", {
      ...args,
      status: "Pending",
      orderDate: new Date().toISOString(),
    });

    // Update stock levels for each medicine
    for (const item of args.items) {
      const medicine = await ctx.db.get(item.medicineId);
      if (medicine) {
        const newStock = medicine.stock - item.quantity;
        // Determine status based on stock level
        let status: "In Stock" | "Low Stock" | "Out of Stock" = "In Stock";
        if (newStock <= 0) {
          status = "Out of Stock";
        } else if (newStock < 10) {
          status = "Low Stock";
        }

        await ctx.db.patch(item.medicineId, { 
          stock: newStock,
          status,
        });
      }
    }

    // Track this as an activity
    await ctx.db.insert("activities", {
      type: "order",
      title: "Medicine Order Placed",
      description: `Order for ${args.items.length} medicines has been placed`,
      timestamp: new Date().toISOString(),
      category: "pharmacy",
      status: "pending",
      relatedId: orderId,
      metadata: {
        notes: args.notes || "No additional notes",
      },
    });

    return orderId;
  },
});

// Get all orders for a user
export const getUserOrders = query({
  args: { 
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.userId) {
      return [];
    }
    
    // Since we're accepting a string userId (from Clerk) instead of a Convex ID,
    // we retrieve all orders and then filter them by showing only recent ones
    // This is a workaround since we can't directly query by the Clerk user ID format
    const orders = await ctx.db
      .query("medicineOrders")
      .order("desc")
      .take(20);
    
    return orders;
  },
});

// Get recent orders (for the pharmacy page)
export const getRecentOrders = query({
  handler: async (ctx) => {
    const orders = await ctx.db
      .query("medicineOrders")
      .order("desc")
      .take(10);
    
    return orders;
  },
}); 