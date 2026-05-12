import type {
  SpendFormData,
  ToolSpendInput,
  ToolAuditResult,
  AuditResult,
  RecommendationType,
} from "@/types";
import { getToolDef, getPlan } from "./pricing-data";
import { nanoid } from "nanoid";

/**
 * CredLens Audit Engine
 *
 * Analyzes a user's AI tool spend and produces actionable recommendations.
 * Rules are hardcoded and based on verified vendor pricing (see PRICING_DATA.md).
 *
 * Strategy per tool:
 *  1. Check if user can DOWNGRADE to a cheaper plan from the same vendor
 *  2. Check if a CROSS-VENDOR SWITCH saves money for the same capability
 *  3. Check if seats can be OPTIMIZED (paying for more seats than team size)
 *  4. Suggest CREDEX discount for large spenders (>$500/mo total)
 *  5. Otherwise, KEEP — user is already optimal
 */

// ── Cross-vendor alternative mappings ──────────────────────────
// Maps tool categories to cheaper alternatives in the same capability space
const CROSS_VENDOR_ALTERNATIVES: Record<string, { toolId: string; planId: string; reason: string }[]> = {
  // IDE coding assistants — Copilot Pro is cheapest at $10/mo
  cursor: [
    { toolId: "github-copilot", planId: "copilot-pro", reason: "GitHub Copilot Pro offers similar AI code completion at $10/mo vs Cursor's $20/mo" },
  ],
  "github-copilot": [
    // Copilot is already cheap, but free tier exists
  ],
  windsurf: [
    { toolId: "github-copilot", planId: "copilot-pro", reason: "GitHub Copilot Pro offers comparable coding assistance at $10/mo vs Windsurf's $20/mo" },
  ],

  // Chat assistants — all priced similarly at $20/mo for individual
  chatgpt: [
    { toolId: "gemini", planId: "gemini-pro", reason: "Google AI Pro offers similar capabilities at $20/mo and includes 2TB storage" },
  ],
  claude: [
    { toolId: "chatgpt", planId: "chatgpt-plus", reason: "ChatGPT Plus is priced at the same $20/mo with a broader plugin ecosystem" },
  ],
  gemini: [],
};

// ── Credex discount tiers ──────────────────────────────────────
// Credex sells discounted AI credits — bigger spenders get better rates
function getCredexDiscount(totalMonthlySpend: number): number {
  if (totalMonthlySpend >= 2000) return 25; // 25% off for $2000+/mo spenders
  if (totalMonthlySpend >= 1000) return 20; // 20% off for $1000+/mo
  if (totalMonthlySpend >= 500) return 15;  // 15% off for $500+/mo
  if (totalMonthlySpend >= 200) return 10;  // 10% off for $200+/mo
  return 0; // No discount under $200/mo
}

// ── Downgrade analysis ─────────────────────────────────────────
function analyzeDowngrade(
  input: ToolSpendInput,
  teamSize: number
): { recommendedPlanId: string; reason: string } | null {
  const toolDef = getToolDef(input.toolId);
  if (!toolDef) return null;

  const currentPlan = getPlan(input.toolId, input.planId);
  if (!currentPlan || currentPlan.pricePerUser === 0) return null; // already free

  // Rule 1: Solo user on a Teams/Business plan → suggest individual plan
  if (input.seats <= 2 && teamSize <= 2) {
    const individualPlans = toolDef.plans.filter(
      (p) =>
        !p.id.includes("team") &&
        !p.id.includes("business") &&
        !p.id.includes("enterprise") &&
        p.pricePerUser > 0 &&
        p.pricePerUser < currentPlan.pricePerUser
    );

    if (individualPlans.length > 0) {
      // Pick the cheapest individual plan that still provides value
      const cheapest = individualPlans.sort(
        (a, b) => a.pricePerUser - b.pricePerUser
      )[0];
      return {
        recommendedPlanId: cheapest.id,
        reason: `You're on ${currentPlan.name} ($${currentPlan.pricePerUser}/mo) with only ${input.seats} seat${input.seats > 1 ? "s" : ""}. The ${cheapest.name} plan at $${cheapest.pricePerUser}/mo covers individual use just as well.`,
      };
    }
  }

  // Rule 2: User on highest tier but might not need it
  // e.g., Cursor Ultra ($200) → Pro ($20) if not a power user
  const cheaperPlans = toolDef.plans.filter(
    (p) =>
      p.pricePerUser > 0 &&
      p.pricePerUser < currentPlan.pricePerUser &&
      !p.isApiPlan
  );

  if (cheaperPlans.length > 0 && currentPlan.pricePerUser >= 100) {
    // Suggest the next tier down
    const nextDown = cheaperPlans.sort(
      (a, b) => b.pricePerUser - a.pricePerUser
    )[0];
    return {
      recommendedPlanId: nextDown.id,
      reason: `You're on the ${currentPlan.name} tier ($${currentPlan.pricePerUser}/mo). Unless you need the highest usage limits, the ${nextDown.name} plan at $${nextDown.pricePerUser}/mo offers great value.`,
    };
  }

  return null;
}

// ── Seat optimization analysis ─────────────────────────────────
function analyzeSeats(
  input: ToolSpendInput,
  teamSize: number
): { recommendedSeats: number; reason: string } | null {
  // If user is paying for more seats than their team size
  if (input.seats > teamSize && teamSize > 0) {
    return {
      recommendedSeats: teamSize,
      reason: `You're paying for ${input.seats} seats but your team has ${teamSize} people. Reducing to ${teamSize} seats saves $${((input.seats - teamSize) * input.monthlySpend).toFixed(0)}/mo.`,
    };
  }
  return null;
}

// ── Single tool analysis ───────────────────────────────────────
function auditTool(
  input: ToolSpendInput,
  teamSize: number,
  totalMonthlySpend: number
): ToolAuditResult {
  const toolDef = getToolDef(input.toolId);
  const currentPlan = getPlan(input.toolId, input.planId);
  const toolName = toolDef?.name || input.toolId;
  const currentMonthly = input.monthlySpend * input.seats;
  const credexDiscount = getCredexDiscount(totalMonthlySpend);

  // Default: keep current plan
  let recommendation: RecommendationType = "keep";
  let recommendedAction = "Your current plan looks optimal for your usage.";
  let recommendedPlan = currentPlan?.name;
  let recommendedTool: string | undefined;
  let newMonthly = currentMonthly;
  let reason = "No changes needed — you're getting good value.";

  // ── Priority 1: Seat optimization ──
  const seatOpt = analyzeSeats(input, teamSize);
  if (seatOpt) {
    recommendation = "optimize";
    newMonthly = input.monthlySpend * seatOpt.recommendedSeats;
    recommendedAction = `Reduce seats from ${input.seats} to ${seatOpt.recommendedSeats}`;
    reason = seatOpt.reason;
  }

  // ── Priority 2: Plan downgrade ──
  const downgrade = analyzeDowngrade(input, teamSize);
  if (downgrade) {
    const newPlan = getPlan(input.toolId, downgrade.recommendedPlanId);
    if (newPlan) {
      const downgradeSavings =
        currentMonthly - newPlan.pricePerUser * input.seats;
      // Only suggest if savings are meaningful (>$5/mo)
      if (downgradeSavings > 5) {
        recommendation = "downgrade";
        recommendedPlan = newPlan.name;
        newMonthly = newPlan.pricePerUser * (seatOpt?.recommendedSeats || input.seats);
        recommendedAction = `Switch to ${newPlan.name} ($${newPlan.pricePerUser}/mo per seat)`;
        reason = downgrade.reason;
      }
    }
  }

  // ── Priority 3: Cross-vendor switch (only if still on "keep") ──
  if (recommendation === "keep" && input.toolId in CROSS_VENDOR_ALTERNATIVES) {
    const alternatives = CROSS_VENDOR_ALTERNATIVES[input.toolId];
    for (const alt of alternatives) {
      const altTool = getToolDef(alt.toolId);
      const altPlan = getPlan(alt.toolId, alt.planId);
      if (altTool && altPlan && altPlan.pricePerUser < input.monthlySpend) {
        const switchSavings =
          currentMonthly - altPlan.pricePerUser * input.seats;
        if (switchSavings > 5) {
          recommendation = "switch";
          recommendedTool = altTool.name;
          recommendedPlan = altPlan.name;
          newMonthly = altPlan.pricePerUser * input.seats;
          recommendedAction = `Consider switching to ${altTool.name} ${altPlan.name} ($${altPlan.pricePerUser}/mo)`;
          reason = alt.reason;
          break;
        }
      }
    }
  }

  // ── Priority 4: Credex discount (for API and high spenders) ──
  if (credexDiscount > 0 && currentMonthly >= 100) {
    const credexSavings = currentMonthly * (credexDiscount / 100);
    // If Credex savings are better than current recommendation
    if (credexSavings > currentMonthly - newMonthly) {
      recommendation = "credex";
      newMonthly = currentMonthly * (1 - credexDiscount / 100);
      recommendedAction = `Buy through Credex for ${credexDiscount}% off`;
      reason = `At your spending level ($${totalMonthlySpend.toFixed(0)}/mo total), Credex can offer ${credexDiscount}% discounted credits — saving $${credexSavings.toFixed(0)}/mo on ${toolName} alone.`;
    }
  }

  const monthlySavings = Math.max(0, currentMonthly - newMonthly);

  return {
    toolId: input.toolId,
    toolName,
    currentPlan: currentPlan?.name || "Unknown",
    currentMonthlySpend: currentMonthly,
    recommendationType: recommendation,
    recommendedAction,
    recommendedPlan,
    recommendedTool,
    newMonthlySpend: newMonthly,
    monthlySavings: Math.round(monthlySavings * 100) / 100,
    annualSavings: Math.round(monthlySavings * 12 * 100) / 100,
    reason,
    credexDiscount: credexDiscount > 0 ? credexDiscount : undefined,
  };
}

// ── Main audit function ────────────────────────────────────────
export function runAudit(formData: SpendFormData): AuditResult {
  const totalCurrentMonthly = formData.tools.reduce(
    (sum, t) => sum + t.monthlySpend * t.seats,
    0
  );

  // Audit each tool
  const toolResults = formData.tools.map((tool) =>
    auditTool(tool, formData.teamSize, totalCurrentMonthly)
  );

  const totalRecommendedMonthly = toolResults.reduce(
    (sum, r) => sum + r.newMonthlySpend,
    0
  );
  const totalMonthlySavings = Math.max(
    0,
    totalCurrentMonthly - totalRecommendedMonthly
  );
  const totalAnnualSavings = totalMonthlySavings * 12;

  // Determine savings tier
  let savingsTier: AuditResult["savingsTier"];
  if (totalMonthlySavings >= 500) savingsTier = "high";
  else if (totalMonthlySavings >= 100) savingsTier = "medium";
  else if (totalMonthlySavings > 0) savingsTier = "low";
  else savingsTier = "optimal";

  return {
    shareId: nanoid(10),
    createdAt: new Date().toISOString(),
    formData,
    toolResults,
    totalCurrentMonthlySpend: Math.round(totalCurrentMonthly * 100) / 100,
    totalRecommendedMonthlySpend:
      Math.round(totalRecommendedMonthly * 100) / 100,
    totalMonthlySavings: Math.round(totalMonthlySavings * 100) / 100,
    totalAnnualSavings: Math.round(totalAnnualSavings * 100) / 100,
    savingsTier,
  };
}
