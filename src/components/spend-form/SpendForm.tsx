"use client";

import { useState, useEffect, useCallback } from "react";
import { TOOL_DEFINITIONS, USE_CASE_OPTIONS } from "@/lib/pricing-data";
import type { ToolId, ToolSpendInput, SpendFormData, UseCase } from "@/types";
import { ToolCard } from "./ToolCard";

const STORAGE_KEY = "credlens-spend-form";

const DEFAULT_FORM: SpendFormData = {
  tools: [],
  teamSize: 1,
  useCase: "mixed",
};

interface SpendFormProps {
  onSubmit: (data: SpendFormData) => void;
}

export function SpendForm({ onSubmit }: SpendFormProps) {
  const [formData, setFormData] = useState<SpendFormData>(DEFAULT_FORM);
  const [selectedToolIds, setSelectedToolIds] = useState<Set<ToolId>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // ── Load from localStorage on mount ──
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: SpendFormData = JSON.parse(saved);
        setFormData(parsed);
        setSelectedToolIds(new Set(parsed.tools.map((t) => t.toolId)));
      }
    } catch {
      // ignore parse errors
    }
    setIsLoaded(true);
  }, []);

  // ── Persist to localStorage on change ──
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData, isLoaded]);

  // ── Toggle tool selection ──
  const toggleTool = useCallback(
    (toolId: ToolId) => {
      setSelectedToolIds((prev) => {
        const next = new Set(prev);
        if (next.has(toolId)) {
          next.delete(toolId);
          setFormData((fd) => ({
            ...fd,
            tools: fd.tools.filter((t) => t.toolId !== toolId),
          }));
        } else {
          next.add(toolId);
          // Add with default values
          const toolDef = TOOL_DEFINITIONS.find((t) => t.id === toolId);
          const defaultPlan = toolDef?.plans[1] || toolDef?.plans[0]; // pick first paid plan
          setFormData((fd) => {
            if (fd.tools.some((t) => t.toolId === toolId)) return fd;
            return {
              ...fd,
              tools: [
                ...fd.tools,
                {
                  toolId,
                  planId: defaultPlan?.id || "",
                  monthlySpend: defaultPlan?.pricePerUser || 0,
                  seats: 1,
                },
              ],
            };
          });
        }
        return next;
      });
      // Clear errors for this tool
      setErrors((prev) => {
        const next = { ...prev };
        delete next[toolId];
        return next;
      });
    },
    []
  );

  // ── Update a single tool's data ──
  const updateTool = useCallback(
    (toolId: ToolId, updates: Partial<ToolSpendInput>) => {
      setFormData((fd) => ({
        ...fd,
        tools: fd.tools.map((t) =>
          t.toolId === toolId ? { ...t, ...updates } : t
        ),
      }));
    },
    []
  );

  // ── Validation ──
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (selectedToolIds.size === 0) {
      newErrors.general = "Select at least one AI tool to audit.";
    }

    if (formData.teamSize < 1 || formData.teamSize > 10000) {
      newErrors.teamSize = "Team size must be between 1 and 10,000.";
    }

    formData.tools.forEach((tool) => {
      if (tool.seats < 1) {
        newErrors[tool.toolId] = "Seats must be at least 1.";
      }
      if (tool.monthlySpend < 0) {
        newErrors[tool.toolId] = "Monthly spend cannot be negative.";
      }
      if (!tool.planId) {
        newErrors[tool.toolId] = "Please select a plan.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Submit ──
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* ── Step 1: Select Tools ── */}
      <div>
        <div className="mb-1 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cl-blue text-xs font-bold text-white">
            1
          </span>
          <h3 className="text-lg font-semibold text-foreground">
            Which AI tools does your team pay for?
          </h3>
        </div>
        <p className="ml-9 text-sm text-muted-foreground mb-5">
          Select all tools your team currently uses. Click to toggle.
        </p>

        {errors.general && (
          <p className="ml-9 mb-3 text-sm font-medium text-destructive">
            {errors.general}
          </p>
        )}

        {/* Tool category groups */}
        {(["ide", "chat", "api"] as const).map((category) => {
          const categoryTools = TOOL_DEFINITIONS.filter(
            (t) => t.category === category
          );
          const labels = {
            ide: "Coding Assistants / IDEs",
            chat: "Chat / Assistants",
            api: "APIs (usage-based)",
          };
          return (
            <div key={category} className="mb-6">
              <h4 className="ml-9 mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {labels[category]}
              </h4>
              <div className="ml-9 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {categoryTools.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    isSelected={selectedToolIds.has(tool.id)}
                    spendInput={formData.tools.find(
                      (t) => t.toolId === tool.id
                    )}
                    error={errors[tool.id]}
                    onToggle={() => toggleTool(tool.id)}
                    onUpdate={(updates) => updateTool(tool.id, updates)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Step 2: Team Details ── */}
      <div className="border-t border-border pt-8">
        <div className="mb-1 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cl-yellow text-xs font-bold text-white">
            2
          </span>
          <h3 className="text-lg font-semibold text-foreground">
            Tell us about your team
          </h3>
        </div>
        <p className="ml-9 text-sm text-muted-foreground mb-5">
          This helps us give you more relevant recommendations.
        </p>

        <div className="ml-9 grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-2xl">
          {/* Team size */}
          <div>
            <label
              htmlFor="team-size"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Total team size
            </label>
            <input
              id="team-size"
              type="number"
              min={1}
              max={10000}
              value={formData.teamSize}
              onChange={(e) =>
                setFormData((fd) => ({
                  ...fd,
                  teamSize: parseInt(e.target.value) || 1,
                }))
              }
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground
                         placeholder:text-muted-foreground
                         focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                         transition-colors"
              placeholder="e.g. 5"
            />
            {errors.teamSize && (
              <p className="mt-1 text-xs text-destructive">{errors.teamSize}</p>
            )}
          </div>

          {/* Use case */}
          <div>
            <label
              htmlFor="use-case"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Primary use case
            </label>
            <select
              id="use-case"
              value={formData.useCase}
              onChange={(e) =>
                setFormData((fd) => ({
                  ...fd,
                  useCase: e.target.value as UseCase,
                }))
              }
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground
                         focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                         transition-colors appearance-none cursor-pointer"
            >
              {USE_CASE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} — {opt.description}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Submit ── */}
      <div className="border-t border-border pt-8">
        <div className="ml-9 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <button
            type="submit"
            id="audit-submit"
            disabled={selectedToolIds.size === 0}
            className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground
                       shadow-lg shadow-primary/25 transition-all
                       hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]
                       active:scale-[0.98]
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg"
          >
            Run My Audit →
          </button>
          <p className="text-sm text-muted-foreground">
            {selectedToolIds.size === 0
              ? "Select at least one tool to get started"
              : `${selectedToolIds.size} tool${selectedToolIds.size > 1 ? "s" : ""} selected · $${formData.tools
                  .reduce((sum, t) => sum + t.monthlySpend * t.seats, 0)
                  .toLocaleString()}/mo total`}
          </p>
        </div>
      </div>
    </form>
  );
}
