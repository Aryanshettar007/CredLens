"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SpendForm } from "@/components/spend-form/SpendForm";
import type { SpendFormData } from "@/types";

export function AuditSection() {
  const router = useRouter();
  const [isAuditing, setIsAuditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: SpendFormData) => {
    setIsAuditing(true);
    setError(null);

    try {
      // Call the API route (runs audit engine + Gemini summary)
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Audit failed");
      }

      const auditResult = await res.json();

      // Store full result for the results page
      sessionStorage.setItem(
        "credlens-audit-result",
        JSON.stringify(auditResult)
      );

      router.push("/results");
    } catch (err) {
      console.error("Audit error:", err);
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
      setIsAuditing(false);
    }
  };

  return (
    <section id="audit" className="border-t border-border bg-muted/30 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Audit Your AI Spend
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Select the AI tools your team pays for, and we&apos;ll analyze your spend
            against current vendor pricing to find savings.
          </p>
        </div>

        {/* Loading overlay */}
        {isAuditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 shadow-2xl">
              <div className="h-10 w-10 animate-spin rounded-full border-3 border-primary border-t-transparent" />
              <div className="text-center">
                <p className="text-base font-semibold text-foreground">
                  Running your audit...
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Analyzing pricing &amp; generating AI insights
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-center">
            <p className="text-sm font-medium text-destructive">{error}</p>
          </div>
        )}

        <SpendForm onSubmit={handleSubmit} />
      </div>
    </section>
  );
}
