import { GoogleGenAI } from "@google/genai";
import type { AuditResult } from "@/types";

function buildFallbackSummary(audit: AuditResult): string {
  let topOpportunity: AuditResult["toolResults"][number] | null = null;

  for (const result of audit.toolResults) {
    if (!topOpportunity || result.monthlySavings > topOpportunity.monthlySavings) {
      topOpportunity = result;
    }
  }

  const hasSavings = audit.totalMonthlySavings > 0;
  const savingsLine = hasSavings
    ? `You have real savings potential across your stack, with about $${audit.totalMonthlySavings.toLocaleString()}/mo ($${audit.totalAnnualSavings.toLocaleString()}/yr) available if you follow the recommendations.`
    : "Your stack is already well optimized and we did not find meaningful savings at your current usage levels.";

  const opportunityLine =
    topOpportunity && topOpportunity.monthlySavings > 0
      ? `The biggest quick win is ${topOpportunity.recommendedAction} for ${topOpportunity.toolName}, which saves roughly $${topOpportunity.monthlySavings.toLocaleString()}/mo.`
      : "No single tool stands out as a major overpayment, which is a strong signal that your current plans fit your usage.";

  const closingLine =
    audit.totalMonthlySavings >= 200
      ? "If you want to capture even more savings, Credex can help you access discounted AI credits through a short consultation."
      : "If your team size or usage changes, re-run the audit to catch new optimization opportunities as pricing evolves.";

  return `${savingsLine}\n\n${opportunityLine}\n\n${closingLine}`;
}

/**
 * Generate a personalized AI summary of the audit results using Gemini.
 * Falls back gracefully if the API key is missing or the call fails.
 */
export async function generateAuditSummary(
  audit: AuditResult
): Promise<string> {
  const fallback = buildFallbackSummary(audit);
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your-gemini-api-key") {
    console.warn("[Gemini] No API key configured — skipping AI summary.");
    return fallback;
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
    return response.text || fallback;
  } catch (error) {
    console.error("[Gemini] Failed to generate summary:", error);
    return fallback;
  }
}
