import { NextRequest, NextResponse } from "next/server";
import { runAudit } from "@/lib/audit-engine";
import { generateAuditSummary } from "@/lib/gemini";
import type { SpendFormData } from "@/types";

/**
 * POST /api/audit
 * 
 * Receives spend form data, runs the audit engine, and generates
 * an AI summary using Gemini. Returns the complete audit result.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const formData = body as SpendFormData;

    // Basic validation
    if (!formData.tools || formData.tools.length === 0) {
      return NextResponse.json(
        { error: "No tools provided. Select at least one tool to audit." },
        { status: 400 }
      );
    }

    if (!formData.teamSize || formData.teamSize < 1) {
      return NextResponse.json(
        { error: "Invalid team size." },
        { status: 400 }
      );
    }

    // 1. Run the audit engine (instant — hardcoded rules)
    const auditResult = runAudit(formData);

    // 2. Generate AI summary via Gemini (async — may take 1-3s)
    const aiSummary = await generateAuditSummary(auditResult);
    if (aiSummary) {
      auditResult.aiSummary = aiSummary;
    }

    return NextResponse.json(auditResult);
  } catch (error) {
    console.error("[API /audit] Error:", error);
    return NextResponse.json(
      { error: "Failed to process audit. Please try again." },
      { status: 500 }
    );
  }
}
