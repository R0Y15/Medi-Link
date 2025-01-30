"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { ConvexError } from "convex/values";
import { api } from "./_generated/api";
import OpenAI from "openai";

// Action to analyze report with Kluster AI
export const analyzeReport = action({
  args: { reportId: v.id("reports") },
  handler: async (ctx, args) => {
    try {
      console.log("Starting analysis for report:", args.reportId);
      
      const report = await ctx.runQuery(api.reports.getReport, { reportId: args.reportId });
      if (!report) {
        console.error("Report not found:", args.reportId);
        throw new ConvexError("Report not found");
      }
      console.log("Found report:", report.title);
      
      if (!report.content) {
        throw new Error("Report content is missing");
      }

      // Check if Kluster AI API key is configured
      const apiKey = process.env.KLUSTER_API_KEY;
      if (!apiKey) {
        throw new Error("Kluster AI API key not configured");
      }

      // Initialize Kluster AI client with OpenAI compatibility
      const client = new OpenAI({
        apiKey: apiKey,
        baseURL: "https://api.kluster.ai/v1"
      });

      // Clean up and truncate the content to stay under token limit
      // Using a more conservative limit since we're using a different model
      const maxChars = 10000;
      let cleanContent = report.content
        .replace(/[^\x20-\x7E\n]/g, '') // Remove non-printable characters
        .replace(/\s+/g, ' ')  // Normalize whitespace
        .trim();
      
      if (cleanContent.length > maxChars) {
        console.log(`Content too long (${cleanContent.length} chars), truncating to ${maxChars} chars`);
        // Try to truncate at a sentence boundary
        const truncated = cleanContent.slice(0, maxChars);
        const lastSentence = truncated.match(/.*[.!?]/);
        cleanContent = lastSentence ? lastSentence[0] : truncated;
      }
      
      console.log("Clean content length:", cleanContent.length);

      // Single API call to analyze the content
      console.log("Starting analysis with Kluster AI");
      const analysisResponse = await client.chat.completions.create({
        model: "klusterai/Meta-Llama-3.1-8B-Instruct-Turbo",
        messages: [
          {
            role: "system",
            content: `You are a medical report analyzer. Analyze the given medical report and provide insights in JSON format.
Your response must be a valid JSON object with these exact fields:
{
  "summary": "A clear and concise summary of the medical report",
  "keyFindings": ["Finding 1", "Finding 2", ...],
  "recommendations": ["Recommendation 1", "Recommendation 2", ...],
  "confidence": 0.95,
  "needsReview": false
}
Do not include any text outside the JSON structure.`
          },
          {
            role: "user",
            content: cleanContent
          }
        ],
        temperature: 0.1,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      });

      const analysisText = analysisResponse.choices[0].message.content;
      if (!analysisText) {
        throw new Error("No analysis received from Kluster AI");
      }

      const analysis = JSON.parse(analysisText);
      console.log("Analysis complete:", JSON.stringify(analysis, null, 2));
      
      // Update report with analysis
      await ctx.runMutation(api.reports.updateReportWithAnalysis, {
        reportId: args.reportId,
        analysis: {
          summary: analysis.summary,
          keyFindings: analysis.keyFindings,
          recommendations: analysis.recommendations,
          confidence: analysis.confidence,
          needsReview: analysis.needsReview
        },
        status: analysis.needsReview ? "Review Required" : "Normal"
      });

      return analysis;

    } catch (error) {
      console.error("Analysis failed:", error);
      
      // Update report status with error
      await ctx.runMutation(api.reports.updateReportStatus, {
        reportId: args.reportId,
        status: `Analysis Failed: ${error}`
      });

      throw error;
    }
  }
}); 