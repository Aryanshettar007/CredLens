import type { ToolAuditResult } from "@/types";

/** Color + icon config for recommendation types */
export const REC_STYLES: Record<
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

export function ToolResultCard({ result }: { result: ToolAuditResult }) {
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

      {/* Body: Action + Reason */}
      <div className="mt-4 rounded-lg bg-secondary/50 p-3">
        <p className="text-sm font-medium text-foreground">
          {result.recommendedAction}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{result.reason}</p>
      </div>

      {/* Footer: Savings */}
      {hasSavings && (
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <p className="text-sm text-muted-foreground">Potential Savings</p>
          <div className="text-right">
            <p className="text-lg font-bold text-savings-green">
              ${result.monthlySavings.toLocaleString()}/mo
            </p>
            <p className="text-xs font-medium text-cl-green">
              ${result.annualSavings.toLocaleString()}/yr
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
