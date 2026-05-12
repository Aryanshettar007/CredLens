import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import { Audit } from "@/models/Audit";
import { Lead } from "@/models/Lead";
import { sendAuditEmail } from "@/lib/email";
import type { AuditResult } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, companyName, role, auditData, honeypot } = body;

    // 1. Honeypot check (anti-spam)
    if (honeypot) {
      // If the honeypot field is filled out, silently return success
      // so the bot thinks it succeeded, but we don't save anything.
      console.warn("[Leads API] Bot detected via honeypot. Discarding.");
      return NextResponse.json({ success: true, isBot: true });
    }

    if (!email || !auditData) {
      return NextResponse.json(
        { error: "Email and audit data are required." },
        { status: 400 }
      );
    }

    // 2. Connect to Database
    await connectToDatabase();

    const typedAudit = auditData as AuditResult;

    // 3. Save the Audit (upsert based on shareId to prevent duplicates if user submits multiple times)
    await Audit.findOneAndUpdate(
      { shareId: typedAudit.shareId },
      { ...typedAudit },
      { upsert: true, new: true }
    );

    // 4. Save the Lead
    const newLead = await Lead.create({
      email,
      companyName,
      role,
      teamSize: typedAudit.formData.teamSize,
      auditShareId: typedAudit.shareId,
      totalMonthlySavings: typedAudit.totalMonthlySavings,
      createdAt: new Date().toISOString(),
    });

    // 5. Send Email via Resend
    await sendAuditEmail(email, typedAudit);

    return NextResponse.json({ success: true, leadId: newLead._id });
  } catch (error: any) {
    console.error("[Leads API] Error saving lead:", error);
    return NextResponse.json(
      { error: "Failed to save lead.", details: error.message },
      { status: 500 }
    );
  }
} 