import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all appointments
export const getAll = query({
  handler: async (ctx) => {
    const appointments = await ctx.db.query("appointments").collect();
    return appointments;
  },
});

// Get appointment by ID
export const getById = query({
  args: { id: v.id("appointments") },
  handler: async (ctx, args) => {
    const appointment = await ctx.db.get(args.id);
    return appointment;
  },
});

// Create new appointment
export const create = mutation({
  args: {
    appointmentDate: v.string(),
    doctorName: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    patientName: v.string(),
    speciality: v.string(),
    status: v.string(),
    symptoms: v.optional(v.string()),
    type: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const appointmentId = await ctx.db.insert("appointments", {
      ...args,
      id: Math.random().toString(36).substr(2, 9), // Generate a unique ID
    });
    return appointmentId;
  },
});

// Update appointment
export const update = mutation({
  args: {
    id: v.id("appointments"),
    appointmentDate: v.optional(v.string()),
    doctorName: v.optional(v.string()),
    startTime: v.optional(v.string()),
    endTime: v.optional(v.string()),
    patientName: v.optional(v.string()),
    speciality: v.optional(v.string()),
    status: v.optional(v.string()),
    symptoms: v.optional(v.string()),
    type: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});

// Delete appointment
export const remove = mutation({
  args: { id: v.id("appointments") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Get appointments by date range
export const getByDateRange = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const appointments = await ctx.db
      .query("appointments")
      .filter((q) => 
        q.gte(q.field("appointmentDate"), args.startDate) &&
        q.lte(q.field("appointmentDate"), args.endDate)
      )
      .collect();
    return appointments;
  },
}); 