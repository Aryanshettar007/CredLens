"use client";

import { useState } from "react";
import type { AuditResult } from "@/types";

interface LeadCaptureFormProps {
  auditResult: AuditResult;
  onSuccess: () => void;
}

export function LeadCaptureForm({ auditResult, onSuccess }: LeadCaptureFormProps) {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [honeypot, setHoneypot] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          companyName,
          role,
          auditData: auditResult,
          honeypot,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save your details. Please try again.");
      }

      onSuccess();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8">
      <div className="text-center mb-6">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <span className="text-xl">🔒</span>
        </div>
        <h3 className="text-xl font-bold text-foreground">
          Unlock Your Full Report
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your email to get your detailed, tool-by-tool savings breakdown and AI insights.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-center text-sm font-medium text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Anti-spam honeypot (visually hidden) */}
        <div className="absolute opacity-0 -z-50 h-0 w-0 overflow-hidden" aria-hidden="true">
          <label htmlFor="website_url">Website</label>
          <input
            type="text"
            id="website_url"
            name="website_url"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
            Work Email <span className="text-destructive">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="you@company.com"
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-foreground mb-1">
            Company Name <span className="text-muted-foreground font-normal">(Optional)</span>
          </label>
          <input
            id="company"
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Acme Inc."
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-foreground mb-1">
            Your Role <span className="text-muted-foreground font-normal">(Optional)</span>
          </label>
          <input
            id="role"
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="CTO, Founder, etc."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !email}
          className="mt-2 w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
        >
          {isSubmitting ? "Unlocking..." : "View Detailed Report →"}
        </button>
        
        <p className="text-center text-xs text-muted-foreground mt-4">
          We'll also email you a secure link to view these results anytime.
        </p>
      </form>
    </div>
  );
}
