import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import connectToDatabase from "@/lib/mongoose";
import { Audit } from "@/models/Audit";
import { ToolResultCard } from "@/components/results/ToolResultCard";

// ── Next.js 15 App Router dynamic route config ──
interface PageProps {
  params: Promise<{ id: string }>;
}

// ── OpenGraph Metadata Generation ──
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  
  await connectToDatabase();
  const auditDoc = await Audit.findOne({ shareId: id }).lean();

  if (!auditDoc) {
    return {
      title: "Audit Not Found | CredLens",
    };
  }

  // Format savings for the OG Title
  const formattedSavings = `$${auditDoc.totalAnnualSavings.toLocaleString()}/yr`;
  const title = `I found ${formattedSavings} in AI savings using CredLens!`;
  const description = `My team was spending $${auditDoc.totalCurrentMonthlySpend.toLocaleString()}/mo. CredLens optimized our stack for free.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "CredLens",
      images: [
        {
          url: "/og-image.jpg", // Assuming we have a default OG image in public/
          width: 1200,
          height: 630,
          alt: "CredLens AI Spend Audit",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function SharePage({ params }: PageProps) {
  const { id } = await params;

  // 1. Fetch Audit from MongoDB
  await connectToDatabase();
  const auditDoc = await Audit.findOne({ shareId: id }).lean();

  if (!auditDoc) {
    notFound();
  }

  // Next.js returns MongoDB documents with ObjectIds that can't be passed to Client Components directly,
  // but we are rendering everything Server-Side here anyway.
  const audit = auditDoc as any;

  const toolsWithSavings = audit.toolResults.filter(
    (r: any) => r.monthlySavings > 0
  );
  const toolsOptimal = audit.toolResults.filter(
    (r: any) => r.monthlySavings === 0
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:py-20">
      
      {/* ── CTA Header for visitors ── */}
      <div className="mb-12 rounded-2xl bg-primary/5 border border-primary/20 p-6 text-center animate-fade-in-up">
        <h2 className="text-xl font-bold text-foreground">
          Want to see if your team is overpaying for AI?
        </h2>
        <p className="mt-2 text-muted-foreground">
          CredLens is a free tool that audits your AI software stack and finds cheaper alternatives and hidden discounts.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-10 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
        >
          Audit My Team&apos;s Spend for Free →
        </Link>
      </div>

      <div className="text-center mb-12">
        <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Shared Audit Results
        </p>
        <h1 className="text-3xl font-extrabold sm:text-4xl text-foreground">
          AI Spend Breakdown
        </h1>
      </div>

      {/* ── Savings summary cards ── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-12">
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Current Spend
          </p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            ${audit.totalCurrentMonthlySpend.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">/month</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Optimized Spend
          </p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            ${audit.totalRecommendedMonthlySpend.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">/month</p>
        </div>
        <div className="rounded-xl border-2 border-savings-green bg-savings-green-bg p-4 text-center">
          <p className="text-xs font-medium text-savings-green uppercase tracking-wider">
            Monthly Savings
          </p>
          <p className="mt-1 text-2xl font-bold text-savings-green">
            ${audit.totalMonthlySavings.toLocaleString()}
          </p>
          <p className="text-xs text-savings-green">/month</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Annual Savings
          </p>
          <p className="mt-1 text-2xl font-bold text-cl-green">
            ${audit.totalAnnualSavings.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">/year</p>
        </div>
      </div>

      {/* ── AI-Powered Summary ── */}
      {audit.aiSummary && (
        <div className="mb-12 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground font-bold">
              ✦
            </span>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
              AI-Powered Insights
            </h2>
          </div>
          <div className="text-sm leading-relaxed text-foreground whitespace-pre-line">
            {audit.aiSummary}
          </div>
        </div>
      )}

      {/* ── Tool-by-tool breakdown ── */}
      {toolsWithSavings.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cl-red text-xs text-white font-bold">
              {toolsWithSavings.length}
            </span>
            Tools with savings opportunities
          </h2>
          <div className="space-y-3">
            {toolsWithSavings.map((result: any, index: number) => (
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
            {toolsOptimal.map((result: any, index: number) => (
              <ToolResultCard key={`${result.toolId}-${index}`} result={result} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
