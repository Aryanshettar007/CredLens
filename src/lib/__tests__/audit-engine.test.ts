import { describe, it, expect } from "vitest";
import { runAudit } from "../audit-engine";
import type { SpendFormData } from "@/types";

describe("CredLens Audit Engine", () => {
  it("should recommend seat optimization when paying for more seats than team size", () => {
    const input: SpendFormData = {
      teamSize: 5,
      useCase: "Coding",
      tools: [
        {
          toolId: "github-copilot",
          planId: "copilot-pro",
          seats: 10,
          monthlySpend: 10,
        },
      ],
    };

    const result = runAudit(input);
    const copilotResult = result.toolResults[0];

    expect(copilotResult.recommendationType).toBe("optimize");
    expect(copilotResult.monthlySavings).toBe(50); // 5 extra seats * $10
    expect(copilotResult.newMonthlySpend).toBe(50); // 5 seats * $10
  });

  it("should recommend downgrade for a solo user on an expensive team plan", () => {
    const input: SpendFormData = {
      teamSize: 1,
      useCase: "Coding",
      tools: [
        {
          toolId: "cursor",
          planId: "cursor-business",
          seats: 1,
          monthlySpend: 40,
        },
      ],
    };

    const result = runAudit(input);
    const cursorResult = result.toolResults[0];

    expect(cursorResult.recommendationType).toBe("downgrade");
    expect(cursorResult.recommendedPlan).toBe("Pro"); // Cursor Pro is $20
    expect(cursorResult.monthlySavings).toBe(20);
  });

  it("should recommend cross-vendor switch to cheaper alternative", () => {
    const input: SpendFormData = {
      teamSize: 1,
      useCase: "Coding",
      tools: [
        {
          toolId: "windsurf",
          planId: "windsurf-pro",
          seats: 1,
          monthlySpend: 20,
        },
      ],
    };

    const result = runAudit(input);
    const windsurfResult = result.toolResults[0];

    // Assuming we map Windsurf -> Copilot Pro ($10)
    expect(windsurfResult.recommendationType).toBe("switch");
    expect(windsurfResult.recommendedTool).toBe("GitHub Copilot");
    expect(windsurfResult.monthlySavings).toBe(10);
  });

  it("should apply Credex discount for high spenders (>$500/mo)", () => {
    const input: SpendFormData = {
      teamSize: 50,
      useCase: "Engineering",
      tools: [
        {
          toolId: "openai-api",
          planId: "openai-api-usage",
          seats: 1,
          monthlySpend: 1250, // $1250/mo total
        },
      ],
    };

    const result = runAudit(input);
    const apiResult = result.toolResults[0];

    expect(apiResult.recommendationType).toBe("credex");
    expect(apiResult.credexDiscount).toBe(20); // $1250 should hit 20% tier
    expect(apiResult.monthlySavings).toBe(250); // 20% of $1250
  });

  it("should keep optimal stack as-is with zero savings", () => {
    const input: SpendFormData = {
      teamSize: 1,
      useCase: "Coding",
      tools: [
        {
          toolId: "github-copilot",
          planId: "copilot-pro",
          seats: 1,
          monthlySpend: 10,
        },
      ],
    };

    const result = runAudit(input);
    const copilotResult = result.toolResults[0];

    expect(copilotResult.recommendationType).toBe("keep");
    expect(copilotResult.monthlySavings).toBe(0);
    expect(result.savingsTier).toBe("optimal");
  });
});
