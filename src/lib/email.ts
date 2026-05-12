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
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111; background: #fff; padding: 8px 0;">
          <h2 style="font-size: 20px; margin: 0 0 8px;">Your CredLens audit is ready</h2>
          <p style="margin: 0 0 16px; color: #444;">
            Thanks for running an audit. Here is a quick summary based on your inputs:
          </p>

          <div style="background: #f6f6f7; border: 1px solid #eee; border-radius: 10px; padding: 16px; margin: 16px 0;">
            <p style="margin: 0 0 6px;"><strong>Current spend:</strong> $${audit.totalCurrentMonthlySpend.toLocaleString()}/month</p>
            <p style="margin: 0 0 6px;"><strong>Optimized spend:</strong> $${audit.totalRecommendedMonthlySpend.toLocaleString()}/month</p>
            <p style="margin: 0;"><strong>Estimated monthly savings:</strong> $${audit.totalMonthlySavings.toLocaleString()}/month</p>
          </div>

          <p style="margin: 16px 0;">
            Estimated annual savings: <strong>$${audit.totalAnnualSavings.toLocaleString()}</strong>
          </p>

          <p style="margin: 16px 0;">
            <a href="${shareUrl}" style="display: inline-block; background: #111; color: #fff; text-decoration: none; padding: 12px 18px; border-radius: 8px; font-weight: 600;">
              View full report
            </a>
          </p>

          <p style="margin: 24px 0 0; color: #666; font-size: 13px;">
            If you have questions, just reply to this email.
          </p>

          <p style="margin: 12px 0 0; color: #111; font-size: 13px;">
            — Aryan, CredLens
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
