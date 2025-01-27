import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    role: v.string(),
    image: v.optional(v.string()),
  }),
  
  patients: defineTable({
    name: v.string(),
    age: v.number(),
    gender: v.string(),
    contact: v.string(),
    address: v.string(),
    medicalHistory: v.array(v.string()),
    assignedDoctor: v.id("users"),
    lastVisit: v.optional(v.string()),
    nextAppointment: v.optional(v.string()),
    status: v.string(),
  }),

  appointments: defineTable({
    patientId: v.id("patients"),
    doctorId: v.id("users"),
    date: v.string(),
    time: v.string(),
    status: v.string(),
    notes: v.optional(v.string()),
  }),
}); 