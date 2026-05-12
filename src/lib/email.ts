import { Resend } from "resend";
import type { AuditResult } from "@/types";

const resendApiKey = process.env.RESEND_API_KEY;

// Create Resend instance only if key exists
const resend = resendApiKey && resendApiKey !== "your-resend-api-key" 
  ? new Resend(resendApiKey) 
  : null;

export async function sendAuditEmail(
  toEmail: string,
  audit: AuditResult
): Promise<boolean> {
  if (!resend) {
    console.warn("[Resend] No API key configured — skipping email send.");
    return false;
  }

  const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/share/${audit.shareId}`;

  try {
    await resend.emails.send({
      from: "CredLens <audit@aryanshettar.tech>",
      // In production (with a verified domain), we send to the user's entered email:
      to: toEmail, 
      subject: `Your CredLens AI Audit is ready (Save $${audit.totalAnnualSavings.toLocaleString()}/yr)`,

      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; line-height: 1.6; color: #111;">

          <p>Hi,</p>

          <p>
            We finished analyzing your AI tool usage and generated your CredLens audit report.
          </p>

          <p>
            Based on the current inputs, we identified approximately 
            <strong>$${audit.totalAnnualSavings.toLocaleString()}</strong> 
            in potential annual savings opportunities.
          </p>

          <div style="background:#f5f5f5; padding:16px; border-radius:8px; margin:20px 0;">
            <p><strong>Current spend:</strong> $${audit.totalCurrentMonthlySpend.toLocaleString()}/month</p>
            <p><strong>Optimized spend:</strong> $${audit.totalRecommendedMonthlySpend.toLocaleString()}/month</p>
            <p><strong>Estimated monthly savings:</strong> $${audit.totalMonthlySavings.toLocaleString()}/month</p>
          </div>

          <p>
            You can access the complete breakdown and recommendations here:
          </p>

          <p>
            <a href="${shareUrl}">View your audit report</a>
          </p>

          <br/>

          <p>
            — Aryan<br/>
            CredLens
          </p>

        </div>
      `,
    });
    
    return true;
  } catch (error) {
    console.error("[Resend] Failed to send email:", error);
    return false;
  }
}
