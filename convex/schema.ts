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
    name: v.string(),
    price: v.number(),
    status: v.union(v.literal("In Stock"), v.literal("Low Stock"), v.literal("Out of Stock")),
    stock: v.number(),
  }),

  medicineOrders: defineTable({
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
    status: v.union(
      v.literal("Pending"), 
      v.literal("Processing"), 
      v.literal("Shipped"), 
      v.literal("Delivered"), 
      v.literal("Cancelled")
    ),
    orderDate: v.string(),
    deliveryDate: v.optional(v.string()),
    notes: v.optional(v.string()),
    prescriptionRequired: v.boolean(),
    prescriptionUrl: v.optional(v.string()),
  }).index("by_orderDate", ["orderDate"]),

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

  activities: defineTable({
    type: v.string(), // appointment, prescription, report, vaccination, note
    title: v.string(),
    description: v.string(),
    timestamp: v.string(),
    category: v.string(), // medical, pharmacy, lab, general
    status: v.string(), // completed, pending, cancelled
    relatedId: v.optional(v.string()), // ID of related item (appointment, prescription etc)
    metadata: v.optional(v.object({
      doctorName: v.optional(v.string()),
      location: v.optional(v.string()),
      speciality: v.optional(v.string()),
      prescription: v.optional(v.array(v.string())),
      testResults: v.optional(v.array(v.string())),
      notes: v.optional(v.string()),
    })),
  }).index("by_timestamp", ["timestamp"]),
}); 