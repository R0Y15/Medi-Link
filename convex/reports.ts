import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";
import { api } from "./_generated/api";

// Get all reports
export const getReports = query({
  handler: async (ctx) => {
    console.log("Fetching all reports");
    const reports = await ctx.db
      .query("reports")
      .withIndex("by_updated")
      .order("desc")
      .collect();
    
    // Log full report details for debugging
    console.log("Reports with analysis:", reports.map(r => ({
      id: r._id,
      title: r.title,
      status: r.status,
      hasAnalysis: !!r.aiAnalysis,
      analysisFields: r.aiAnalysis ? Object.keys(r.aiAnalysis) : []
    })));
    
    return reports;
  },
});

// Upload a new report
export const uploadReport = mutation({
  args: {
    title: v.string(),
    type: v.string(),
    content: v.string(),
    fileUrl: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("Starting report upload:", args.title);
    console.log("FileUrl format check:", {
      startsWithData: args.fileUrl.startsWith('data:application/pdf;base64,'),
      totalLength: args.fileUrl.length,
      sampleContent: args.fileUrl.substring(0, 100)
    });
    
    // Clean up the content by removing binary and special characters
    let content = args.content.replace(/[^\x20-\x7E\n]/g, '');
    
    // Split content if it's too large
    const maxChunkSize = 900 * 1024; // 900KB to be safe
    if (content.length > maxChunkSize) {
      console.log("Content too large, truncating to first 900KB");
      content = content.substring(0, maxChunkSize);
    }
    
    // Create report entry
    const reportId = await ctx.db.insert("reports", {
      title: args.title,
      type: args.type,
      content: content,
      fileUrl: args.fileUrl,
      status: "Processing",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    console.log("Report created with ID:", reportId);

    // Schedule the analysis action
    await ctx.scheduler.runAfter(0, api.reportActions.analyzeReport, { reportId });

    return reportId;
  },
});

// Internal query to get a report
export const getReport = query({
  args: { reportId: v.id("reports") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.reportId);
  },
});

// Internal mutation to update report status
export const updateReportStatus = mutation({
  args: { 
    reportId: v.id("reports"),
    status: v.string()
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.reportId, {
      status: args.status,
      updatedAt: new Date().toISOString(),
    });
  },
});

// Internal mutation to update report with analysis
export const updateReportWithAnalysis = mutation({
  args: { 
    reportId: v.id("reports"),
    analysis: v.object({
      summary: v.string(),
      confidence: v.number(),
      needsReview: v.boolean(),
      recommendations: v.array(v.string()),
      keyFindings: v.array(v.string())
    }),
    status: v.string()
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.reportId, {
      aiAnalysis: args.analysis,
      status: args.status,
      updatedAt: new Date().toISOString(),
    });
  },
});

// Generate new AI insights for a report
export const generateInsights = mutation({
  args: { reportId: v.id("reports") },
  handler: async (ctx, args) => {
    const report = await ctx.db.get(args.reportId);
    if (!report) throw new ConvexError("Report not found");

    // Schedule the analysis action
    await ctx.scheduler.runAfter(0, api.reportActions.analyzeReport, { reportId: args.reportId });
    
    return report.aiAnalysis || null;
  },
});

// Delete a report
export const deleteReport = mutation({
  args: { id: v.id("reports") },
  handler: async (ctx, args) => {
    const report = await ctx.db.get(args.id);
    if (!report) {
      throw new ConvexError("Report not found");
    }

    await ctx.db.delete(args.id);
    return true;
  },
}); 