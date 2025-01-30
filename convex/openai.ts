import { action } from "./_generated/server";
import { v } from "convex/values";

export type AIAnalysis = {
  summary: string;
  keyFindings: string[];
  recommendations: string[];
  needsReview: boolean;
  confidence: number;
};

export const analyzeReport = action({
  args: {
    content: v.string(),
  },
  handler: async (ctx, args): Promise<AIAnalysis> => {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }

    const prompt = `
      Analyze the following medical report and provide:
      1. A brief summary
      2. Key findings
      3. Recommendations
      4. Whether the report needs immediate review (true/false)
      5. Confidence level in the analysis (0-1)

      Report content:
      ${args.content}

      Respond in the following JSON format:
      {
        "summary": "brief summary here",
        "keyFindings": ["finding1", "finding2", ...],
        "recommendations": ["rec1", "rec2", ...],
        "needsReview": boolean,
        "confidence": number
      }
    `;

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a medical report analyzer. Analyze the report and provide structured insights."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error("Failed to get response from OpenAI");
      }

      const analysis = JSON.parse(content) as AIAnalysis;
      return analysis;
    } catch (error) {
      console.error("OpenAI API error:", error);
      throw new Error("Failed to analyze report");
    }
  },
}); 