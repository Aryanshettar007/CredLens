"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { AuditResult, ToolAuditResult } from "@/types";

/** Color + icon config for recommendation types */
const REC_STYLES: Record<
  string,
  { label: string; color: string; bg: string; icon: string }
> = {
  downgrade: {
    label: "Downgrade Plan",
    color: "text-cl-blue",
    bg: "bg-cl-blue/10",
    icon: "↓",
  },
  switch: {
    label: "Switch Tool",
    color: "text-cl-yellow",
    bg: "bg-cl-yellow/10",
    icon: "⇄",
  },
  optimize: {
    label: "Reduce Seats",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    icon: "✂",
  },
  credex: {
    label: "Buy via Credex",
    color: "text-cl-green",
    bg: "bg-cl-green/10",
    icon: "💰",
  },
  keep: {
    label: "Looks Good",
    color: "text-muted-foreground",
    bg: "bg-muted",
    icon: "✓",
  },
};

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

function ToolResultCard({ result }: { result: ToolAuditResult }) {
  const style = REC_STYLES[result.recommendationType] || REC_STYLES.keep;
  const hasSavings = result.monthlySavings > 0;

  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            {result.toolName}
          </h3>
          <p className="text-sm text-muted-foreground">
            Current: {result.currentPlan} · $
            {result.currentMonthlySpend.toLocaleString()}/mo
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${style.bg} ${style.color}`}
        >
          <span>{style.icon}</span>
          {style.label}
        </span>
      </div>

      {/* Recommendation */}
      <div className="mt-4 rounded-lg bg-muted/50 p-3">
        <p className="text-sm font-medium text-foreground">
          {result.recommendedAction}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {result.reason}
        </p>
      </div>

      {/* Savings bar */}
      {hasSavings && (
        <div className="mt-4 flex items-center justify-between rounded-lg bg-savings-green-bg px-3 py-2">
          <span className="text-sm text-savings-green font-medium">
            Save ${result.monthlySavings.toLocaleString()}/mo
          </span>
          <span className="text-xs text-savings-green">
            ${result.annualSavings.toLocaleString()}/yr
          </span>
        </div>
      )}
    </div>
  );
}

export default function ResultsPage() {
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Read full audit result from API (set by AuditSection)
      const raw = sessionStorage.getItem("credlens-audit-result");
      if (raw) {
        setAuditResult(JSON.parse(raw));
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

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
            if (navigator.share) {
              navigator.share({
                title: "My CredLens AI Spend Audit",
                text: `I found $${auditResult.totalAnnualSavings.toLocaleString()}/yr in AI tool savings with CredLens!`,
                url: window.location.href,
              });
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied to clipboard!");
            }
          }}
          className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
        >
          Share Results 🔗
        </button>
      </div>
    </div>
  );
}
