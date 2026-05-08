"use client";

import type { ToolDefinition, ToolSpendInput } from "@/types";

interface ToolCardProps {
  tool: ToolDefinition;
  isSelected: boolean;
  spendInput?: ToolSpendInput;
  error?: string;
  onToggle: () => void;
  onUpdate: (updates: Partial<ToolSpendInput>) => void;
}

/** Color map for tool icons */
const TOOL_ICON_MAP: Record<string, { emoji: string; bg: string }> = {
  cursor: { emoji: "⌘", bg: "bg-black text-white dark:bg-white dark:text-black" },
  copilot: { emoji: "🤖", bg: "bg-[#24292e] text-white" },
  windsurf: { emoji: "🌊", bg: "bg-[#0EA5E9] text-white" },
  chatgpt: { emoji: "◆", bg: "bg-[#10A37F] text-white" },
  claude: { emoji: "✦", bg: "bg-[#D4A574] text-white" },
  gemini: { emoji: "✦", bg: "bg-[#4285F4] text-white" },
  openai: { emoji: "◈", bg: "bg-[#412991] text-white" },
  anthropic: { emoji: "A", bg: "bg-[#191919] text-[#D4A574]" },
};

export function ToolCard({
  tool,
  isSelected,
  spendInput,
  error,
  onToggle,
  onUpdate,
}: ToolCardProps) {
  const iconInfo = TOOL_ICON_MAP[tool.icon] || {
    emoji: "●",
    bg: "bg-gray-500 text-white",
  };

  const isApi = tool.category === "api";

  return (
    <div
      className={`group relative rounded-xl border-2 transition-all duration-200 ${
        isSelected
          ? "border-primary bg-primary/5 shadow-md"
          : "border-border bg-card hover:border-primary/30 hover:shadow-sm"
      }`}
    >
      {/* Toggle header — always visible */}
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 p-4 text-left"
        aria-label={`${isSelected ? "Remove" : "Add"} ${tool.name}`}
      >
        {/* Tool icon */}
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-base font-bold ${iconInfo.bg}`}
        >
          {iconInfo.emoji}
        </div>

        {/* Tool info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {tool.name}
          </p>
          <p className="text-xs text-muted-foreground">{tool.vendor}</p>
        </div>

        {/* Checkbox indicator */}
        <div
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
            isSelected
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border"
          }`}
        >
          {isSelected && (
            <svg
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </button>

      {/* Expanded details — shown when selected */}
      {isSelected && spendInput && (
        <div className="border-t border-border px-4 pb-4 pt-3 space-y-3 animate-fade-in">
          {/* Plan selector */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Plan
            </label>
            <select
              value={spendInput.planId}
              onChange={(e) => {
                const plan = tool.plans.find((p) => p.id === e.target.value);
                onUpdate({
                  planId: e.target.value,
                  monthlySpend: plan?.pricePerUser || spendInput.monthlySpend,
                });
              }}
              className="w-full rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm text-foreground
                         focus:outline-none focus:ring-2 focus:ring-ring
                         transition-colors appearance-none cursor-pointer"
            >
              {tool.plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name}
                  {plan.pricePerUser > 0 && ` — $${plan.pricePerUser}/mo`}
                  {plan.pricePerUser === 0 && !plan.isApiPlan && " — Free"}
                  {plan.isApiPlan && " — Usage-based"}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Seats */}
            {!isApi && (
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Seats
                </label>
                <input
                  type="number"
                  min={1}
                  max={10000}
                  value={spendInput.seats}
                  onChange={(e) =>
                    onUpdate({ seats: parseInt(e.target.value) || 1 })
                  }
                  className="w-full rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm text-foreground
                             focus:outline-none focus:ring-2 focus:ring-ring
                             transition-colors"
                  placeholder="1"
                />
              </div>
            )}

            {/* Monthly spend */}
            <div className={isApi ? "col-span-2" : ""}>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                {isApi ? "Monthly API spend ($)" : "$/seat/mo"}
              </label>
              <input
                type="number"
                min={0}
                max={100000}
                step={isApi ? 10 : 1}
                value={spendInput.monthlySpend}
                onChange={(e) =>
                  onUpdate({
                    monthlySpend: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm text-foreground
                           focus:outline-none focus:ring-2 focus:ring-ring
                           transition-colors"
                placeholder={isApi ? "e.g. 500" : "20"}
              />
            </div>
          </div>

          {/* Computed total */}
          {!isApi && spendInput.seats > 0 && spendInput.monthlySpend > 0 && (
            <div className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
              Total:{" "}
              <span className="font-semibold text-foreground">
                ${(spendInput.monthlySpend * spendInput.seats).toLocaleString()}
                /mo
              </span>{" "}
              ({spendInput.seats} seat{spendInput.seats > 1 ? "s" : ""} × $
              {spendInput.monthlySpend})
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-xs font-medium text-destructive">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}
