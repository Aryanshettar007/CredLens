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
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; color: #1a1a1a;">
          <h2 style="color: #000;">Your AI Spend Audit Results</h2>
          <p>Hi there,</p>
          <p>Thanks for using CredLens! We analyzed your team's AI tool usage and found <strong>$${audit.totalAnnualSavings.toLocaleString()} in potential annual savings</strong>.</p>
          
          <div style="background-color: #f4f4f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; font-size: 16px; color: #52525b; text-transform: uppercase;">Audit Summary</h3>
            <p style="margin: 5px 0;"><strong>Current Spend:</strong> $${audit.totalCurrentMonthlySpend.toLocaleString()}/mo</p>
            <p style="margin: 5px 0;"><strong>Optimized Spend:</strong> $${audit.totalRecommendedMonthlySpend.toLocaleString()}/mo</p>
            <p style="margin: 5px 0; color: #16a34a;"><strong>Monthly Savings:</strong> $${audit.totalMonthlySavings.toLocaleString()}/mo</p>
          </div>

          <p>You can view your detailed tool-by-tool breakdown and Gemini AI recommendations anytime at your persistent link below:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${shareUrl}" style="background-color: #000; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">
              View Full Report
            </a>
          </div>

          <p style="font-size: 12px; color: #71717a;">
            (Note: This email was sent to aryanshettar007@gmail.com because the app is using the Resend sandbox environment. The user entered: ${toEmail})
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
