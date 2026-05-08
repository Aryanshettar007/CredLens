import { GoogleGenAI } from "@google/genai";
import type { AuditResult } from "@/types";

/**
 * Generate a personalized AI summary of the audit results using Gemini.
 * Falls back gracefully if the API key is missing or the call fails.
 */
export async function generateAuditSummary(
  audit: AuditResult
): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your-gemini-api-key") {
    console.warn("[Gemini] No API key configured — skipping AI summary.");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const toolBreakdown = audit.toolResults
      .map(
        (t) =>
          `- ${t.toolName}: Currently on ${t.currentPlan} at $${t.currentMonthlySpend}/mo. ` +
          `Recommendation: ${t.recommendedAction}. ` +
          `Potential savings: $${t.monthlySavings}/mo ($${t.annualSavings}/yr).`
      )
      .join("\n");

    const prompt = `You are CredLens, an AI spend audit assistant built by Credex (credex.rocks — a platform that sells discounted AI infrastructure credits).

A startup founder just audited their team's AI tool spending. Here are the results:

**Current Monthly Spend:** $${audit.totalCurrentMonthlySpend}
**Optimized Monthly Spend:** $${audit.totalRecommendedMonthlySpend}
**Total Monthly Savings:** $${audit.totalMonthlySavings}
**Total Annual Savings:** $${audit.totalAnnualSavings}
**Savings Tier:** ${audit.savingsTier}

**Tool-by-tool breakdown:**
${toolBreakdown}

Write a brief, friendly, and actionable 3-4 paragraph summary (max 200 words) for this founder. 

Rules:
- Be conversational but professional — like a smart CFO friend giving advice
- Start with the biggest insight (don't repeat numbers they can already see)
- Highlight the single most impactful change they could make
- If savings are significant (>$200/mo), mention that Credex can help them save even more on AI credits
- If savings are low or zero, congratulate them and suggest they check back as pricing changes
- Do NOT use markdown headers or bullet points — just clean paragraphs
- Do NOT hallucinate features or pricing — stick to what's in the data above`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || null;
  } catch (error) {
    console.error("[Gemini] Failed to generate summary:", error);
    return null;
  }
}
