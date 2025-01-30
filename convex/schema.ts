import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    role: v.string(),
    image: v.optional(v.string()),
    password: v.string(),
    isEmailVerified: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
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
    appointmentDate: v.string(),
    doctorName: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    id: v.string(),
    notes: v.optional(v.string()),
    patientName: v.string(),
    speciality: v.string(),
    status: v.string(),
    symptoms: v.optional(v.string()),
    type: v.optional(v.string()),
  }),

  medicines: defineTable({
    category: v.string(),
    expiryDate: v.string(),
    id: v.string(),
    name: v.string(),
    price: v.number(),
    status: v.string(),
    stock: v.number(),
  }),

  reports: defineTable({
    title: v.string(),
    type: v.string(),
    content: v.string(),
    fileUrl: v.string(),
    status: v.string(),
    createdAt: v.string(),
    updatedAt: v.string(),
    aiAnalysis: v.optional(v.object({
      summary: v.string(),
      keyFindings: v.array(v.string()),
      recommendations: v.array(v.string()),
      needsReview: v.boolean(),
      confidence: v.number(),
    })),
  }).index("by_updated", ["updatedAt"]),
}); 