"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { AuditResult } from "@/types";
import { LeadCaptureForm } from "@/components/lead-capture/LeadCaptureForm";
import { ToolResultCard } from "@/components/results/ToolResultCard";

/** Savings tier messaging */
const TIER_CONFIG: Record<
  string,
  { headline: string; subtext: string; color: string }
> = {
  high: {
    headline: "You could save big.",
    subtext:
      "Your team is significantly overspending on AI tools. Here's how to fix it.",
    color: "text-cl-red",
  },
  medium: {
    headline: "There's room to optimize.",
    subtext:
      "We found meaningful savings opportunities across your stack.",
    color: "text-cl-yellow",
  },
  low: {
    headline: "Minor savings available.",
    subtext:
      "Your stack is mostly efficient, but there are a few tweaks worth considering.",
    color: "text-cl-blue",
  },
  optimal: {
    headline: "You're spending well. 🎉",
    subtext:
      "Your AI tool stack is well-optimized. No major changes needed.",
    color: "text-cl-green",
  },
};

export default function ResultsPage() {
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      // Read full audit result from API (set by AuditSection)
      const raw = sessionStorage.getItem("credlens-audit-result");
      if (raw) {
        setAuditResult(JSON.parse(raw));
      }
      
      // Check if user already unlocked
      const unlocked = sessionStorage.getItem("credlens-unlocked");
      if (unlocked === "true") {
        setIsUnlocked(true);
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleUnlockSuccess = () => {
    sessionStorage.setItem("credlens-unlocked", "true");
    setIsUnlocked(true);
    // Smooth scroll to top of details
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!auditResult) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
        <h1 className="text-2xl font-bold text-foreground">
          No audit data found
        </h1>
        <p className="mt-2 text-muted-foreground">
          Please run an audit first from the home page.
        </p>
        <Link
          href="/#audit"
          className="mt-6 inline-flex h-10 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground"
        >
          ← Start Audit
        </Link>
      </div>
    );
  }

  const tier = TIER_CONFIG[auditResult.savingsTier] || TIER_CONFIG.optimal;
  const toolsWithSavings = auditResult.toolResults.filter(
    (r) => r.monthlySavings > 0
  );
  const toolsOptimal = auditResult.toolResults.filter(
    (r) => r.monthlySavings === 0
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:py-20">
      {/* ── Hero savings display ── */}
      <div className="text-center mb-12 animate-fade-in-up">
        <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Your AI Spend Audit
        </p>
        <h1 className={`text-3xl font-extrabold sm:text-4xl lg:text-5xl ${tier.color}`}>
          {tier.headline}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-xl mx-auto">
          {tier.subtext}
        </p>
      </div>
      {/* ── Savings summary cards ── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-12 animate-fade-in-up animate-delay-100">
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Current Spend
          </p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            ${auditResult.totalCurrentMonthlySpend.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">/month</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Optimized Spend
          </p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            ${auditResult.totalRecommendedMonthlySpend.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">/month</p>
        </div>
        <div className="rounded-xl border-2 border-savings-green bg-savings-green-bg p-4 text-center">
          <p className="text-xs font-medium text-savings-green uppercase tracking-wider">
            Monthly Savings
          </p>
          <p className="mt-1 text-2xl font-bold text-savings-green">
            ${auditResult.totalMonthlySavings.toLocaleString()}
          </p>
          <p className="text-xs text-savings-green">/month</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Annual Savings
          </p>
          <p className="mt-1 text-2xl font-bold text-cl-green">
            ${auditResult.totalAnnualSavings.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">/year</p>
        </div>
      </div>

      {/* ── Gated Content Area ── */}
      <div className={`relative transition-all duration-700 ${!isUnlocked ? "overflow-hidden pb-32" : ""}`}>
        
        {/* If locked, overlay the Lead Capture Form */}
        {!isUnlocked && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-start bg-background/60 backdrop-blur-md pt-10 px-4">
            <LeadCaptureForm 
              auditResult={auditResult} 
              onSuccess={handleUnlockSuccess} 
            />
          </div>
        )}

        <div className={!isUnlocked ? "opacity-30 blur-sm pointer-events-none select-none" : ""}>
          {/* ── AI-Powered Summary (from Gemini) ── */}
          {auditResult.aiSummary && (
            <div className="mb-12 animate-fade-in-up animate-delay-50 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground font-bold">
                  ✦
                </span>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
                  AI-Powered Insights
                </h2>
                <span className="text-xs text-muted-foreground ml-auto">by Gemini</span>
              </div>
              <div className="text-sm leading-relaxed text-foreground whitespace-pre-line">
                {auditResult.aiSummary}
              </div>
            </div>
          )}

      {/* ── Tool-by-tool breakdown ── */}
      <div className="animate-fade-in-up animate-delay-200">
        {toolsWithSavings.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cl-red text-xs text-white font-bold">
                {toolsWithSavings.length}
              </span>
              Tools with savings opportunities
            </h2>
            <div className="space-y-3">
              {toolsWithSavings.map((result, index) => (
                <ToolResultCard key={`${result.toolId}-${index}`} result={result} />
              ))}
            </div>
          </div>
        )}

        {toolsOptimal.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cl-green text-xs text-white font-bold">
                ✓
              </span>
              Tools already optimized
            </h2>
            <div className="space-y-3">
              {toolsOptimal.map((result, index) => (
                <ToolResultCard key={`${result.toolId}-${index}`} result={result} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Credex CTA (only for significant savings) ── */}
      {auditResult.totalMonthlySavings >= 100 && (
        <div className="mt-10 rounded-2xl border-2 border-cl-green/30 bg-cl-green/5 p-6 sm:p-8 text-center animate-fade-in-up animate-delay-300">
          <p className="text-sm font-semibold text-cl-green uppercase tracking-wider mb-2">
            Unlock even more savings
          </p>
          <h3 className="text-xl font-bold text-foreground sm:text-2xl">
            Save up to{" "}
            <span className="text-cl-green">
              ${Math.round(auditResult.totalAnnualSavings * 0.6).toLocaleString()}
            </span>{" "}
            more per year with Credex
          </h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-lg mx-auto">
            Credex sells discounted AI credits from companies that overforecast.
            Get the same tools at lower prices — verified and guaranteed.
          </p>
          <a
            href="https://credex.rocks"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex h-11 items-center rounded-full bg-cl-green px-6 text-sm font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
          >
            Explore Credex Credits →
          </a>
        </div>
      )}

          {/* ── Honest message for low/no savings ── */}
          {auditResult.savingsTier === "optimal" && (
            <div className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8 text-center">
              <p className="text-3xl mb-3">🎉</p>
              <h3 className="text-xl font-bold text-foreground">
                Great job on your AI stack!
              </h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-lg mx-auto">
                Your team is spending efficiently. We didn&apos;t find significant savings
                opportunities. Check back if your usage changes — we update pricing weekly.
              </p>
            </div>
          )}

          {/* ── Bottom actions ── */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/#audit"
              className="inline-flex h-10 items-center rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground transition-all hover:bg-secondary"
            >
              ← Edit My Inputs
            </Link>
            <button
              onClick={() => {
                const shareUrl = `${window.location.origin}/share/${auditResult.shareId}`;

                if (navigator.share) {
                  navigator.share({
                    title: "My CredLens AI Spend Audit",
                    text: `I found $${auditResult.totalAnnualSavings.toLocaleString()}/yr in AI tool savings with CredLens!`,
                    url: shareUrl,
                  });
                } else {
                  navigator.clipboard.writeText(shareUrl);
                  alert("Link copied to clipboard!");
                }
              }}
              className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
            >
              Share Results 🔗
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
