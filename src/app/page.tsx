import Link from "next/link";
import { AuditSection } from "@/components/spend-form/AuditSection";
import {
  CursorLogo,
  CopilotLogo,
  WindsurfLogo,
  OpenAILogo,
} from "@/components/icons/ToolLogos";
import { type ReactNode } from "react";

/* Floating brand icons config — uses actual PNGs where available, SVG fallback otherwise */
interface FloatingIcon {
  src?: string;          // PNG path from /public
  SvgLogo?: React.ComponentType<{ className?: string }>; // SVG fallback
  alt: string;
  pos: string;
  rotate: string;
  delay: string;
  duration: string;
}

const FLOATING_ICONS: FloatingIcon[] = [
  { SvgLogo: CursorLogo, alt: "Cursor", pos: "top-28 left-[8%]", rotate: "-12deg", delay: "0s", duration: "4s" },
  { SvgLogo: CopilotLogo, alt: "GitHub Copilot", pos: "top-20 right-[10%]", rotate: "10deg", delay: "0.7s", duration: "4.5s" },
  { src: "/Claude.png", alt: "Claude", pos: "top-52 left-[18%]", rotate: "8deg", delay: "1.2s", duration: "3.8s" },
  { src: "/chatgpt-PDcXnZl4.png", alt: "ChatGPT", pos: "top-36 right-[6%]", rotate: "-6deg", delay: "0.3s", duration: "5s" },
  { src: "/gemini-LRYtM26e.png", alt: "Gemini", pos: "bottom-36 left-[6%]", rotate: "15deg", delay: "1.8s", duration: "4.2s" },
  { SvgLogo: WindsurfLogo, alt: "Windsurf", pos: "bottom-28 right-[12%]", rotate: "-10deg", delay: "2.2s", duration: "3.5s" },
  { SvgLogo: OpenAILogo, alt: "OpenAI", pos: "bottom-52 right-[22%]", rotate: "5deg", delay: "1s", duration: "4.8s" },
  { src: "/aws-Bm8YM7ec.png", alt: "AWS", pos: "top-72 right-[5%]", rotate: "-8deg", delay: "1.5s", duration: "3.6s" },
  { src: "/gcp.png", alt: "GCP", pos: "bottom-56 left-[16%]", rotate: "6deg", delay: "0.5s", duration: "4.4s" },
  { src: "/azure-DcfNG_UU.png", alt: "Azure", pos: "top-44 left-[5%]", rotate: "-5deg", delay: "2s", duration: "3.9s" },
];

function FloatingIconCard({ icon }: { icon: FloatingIcon }) {
  let content: ReactNode;
  if (icon.src) {
    content = (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={icon.src} alt={icon.alt} width={36} height={36} className="object-contain" />
    );
  } else if (icon.SvgLogo) {
    const SvgLogo = icon.SvgLogo;
    content = <SvgLogo className="h-9 w-9" />;
  }

  return (
    <div
      className={`absolute ${icon.pos} animate-float`}
      style={{
        animationDelay: icon.delay,
        animationDuration: icon.duration,
      }}
    >
      <div
        className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card p-2 shadow-lg shadow-black/[0.08]"
        style={{ transform: `rotate(${icon.rotate})` }}
      >
        {content}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        
        {/* Floating tool logos - decorative, Credex-style */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block" aria-hidden="true">
          {FLOATING_ICONS.map((icon, i) => (
            <FloatingIconCard key={i} icon={icon} />
          ))}
        </div>

        <div className="relative mx-auto max-w-4xl px-4 py-24 sm:py-32 lg:py-40 text-center">
          {/* Badge */}
          <div className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm mb-8">
            <span className="flex h-2 w-2 rounded-full bg-cl-green animate-pulse" />
            Free &middot; No login required &middot; Instant results
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-in-up animate-delay-100 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Are You{" "}
            <span className="text-cl-red">Overpaying</span>{" "}
            for AI Tools?
          </h1>

          {/* Subheadline */}
          <p className="animate-fade-in-up animate-delay-200 mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Get a free, instant audit of your team&apos;s AI spend.
            See exactly where you&apos;re wasting money — and save up to{" "}
            <span className="font-semibold text-savings-green">60% with Credex</span>.
          </p>

          {/* CTA */}
          <div className="animate-fade-in-up animate-delay-300 mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/#audit"
              id="hero-cta-primary"
              className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              Audit My AI Spend →
            </Link>
            <Link
              href="/#how-it-works"
              id="hero-cta-secondary"
              className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card px-6 text-base font-medium text-foreground transition-all hover:bg-secondary hover:scale-[1.02] active:scale-[0.98]"
            >
              See How It Works
            </Link>
          </div>

          {/* Social proof */}
          <div className="animate-fade-in-up animate-delay-400 mt-12 flex flex-col items-center gap-3">
            <div className="flex -space-x-2">
              {[
                "bg-cl-blue",
                "bg-cl-red",
                "bg-cl-yellow",
                "bg-cl-green",
                "bg-primary",
              ].map((bg, i) => (
                <div
                  key={i}
                  className={`h-8 w-8 rounded-full ${bg} border-2 border-background flex items-center justify-center text-white text-xs font-bold`}
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">500+</span> audits completed
              <span className="mx-2 text-border">·</span>
              <span className="font-semibold text-savings-green">$2.4M+</span> in savings found
              <span className="ml-1 text-xs text-muted-foreground">(mocked)</span>
            </p>
          </div>
        </div>
      </section>

      {/* ===== SUPPORTED TOOLS BAR ===== */}
      <section className="border-y border-border bg-muted/30 py-6">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">
            We audit spend across all major AI tools
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {[
              "Cursor", "GitHub Copilot", "Claude", "ChatGPT",
              "OpenAI API", "Anthropic API", "Gemini", "Windsurf",
            ].map((name) => (
              <span
                key={name}
                className="text-sm font-medium text-muted-foreground/70 hover:text-foreground transition-colors"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to find out if your team is overspending on AI tools.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3 stagger-children">
            {[
              {
                step: "1",
                color: "bg-cl-blue",
                title: "Enter Your Tools",
                description:
                  "Tell us what AI tools you're paying for, which plan you're on, and how many seats you have.",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                ),
              },
              {
                step: "2",
                color: "bg-cl-yellow",
                title: "Get Your Audit",
                description:
                  "Our engine analyzes your stack — plan fit, cheaper alternatives, and Credex discount opportunities.",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
              },
              {
                step: "3",
                color: "bg-cl-green",
                title: "Save Money",
                description:
                  "See your total savings potential. Share the report and, if eligible, get Credex discounted credits.",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
            ].map(({ step, color, title, description, icon }) => (
              <div
                key={step}
                className="relative flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center shadow-sm transition-all hover:shadow-md hover:border-primary/30 hover:-translate-y-1"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${color} text-white shadow-sm`}
                >
                  {icon}
                </div>
                <span className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Step {step}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== AUDIT SECTION ===== */}
      <AuditSection />

      {/* ===== FAQ ===== */}
      <section id="faq" className="py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-12 space-y-4">
            {[
              {
                q: "Is this really free?",
                a: "Yes, completely free. No login required to use the tool. You only share your email after seeing your results — and that's optional too.",
              },
              {
                q: "How accurate is the audit?",
                a: "Our pricing data is sourced directly from each vendor's official pricing page and verified weekly. The recommendations are based on real plan comparisons and usage-fit analysis.",
              },
              {
                q: "What's the connection to Credex?",
                a: "Credex sells discounted AI infrastructure credits sourced from companies that overforecast. If our audit finds significant savings, we'll suggest Credex as an option to save even more — but only when the savings are real.",
              },
              {
                q: "Will my data be shared?",
                a: "No. Your audit data stays private. When you share a result link, identifying information (email, company name) is stripped. Only tool names and savings numbers are shown publicly.",
              },
              {
                q: "What AI tools do you support?",
                a: "We currently audit: Cursor, GitHub Copilot, Claude, ChatGPT, Anthropic API, OpenAI API, Google Gemini, and Windsurf. More tools coming soon.",
              },
            ].map(({ q, a }, i) => (
              <details
                key={i}
                className="group rounded-xl border border-border bg-card transition-all hover:border-primary/30 [&[open]]:border-primary/30 [&[open]]:shadow-sm"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-4 text-left text-base font-medium text-foreground list-none">
                  {q}
                  <svg
                    className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-4 text-sm leading-relaxed text-muted-foreground">
                  {a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="border-t border-border bg-gradient-to-b from-muted/50 to-background py-20 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Ready to Stop Overpaying?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Takes 2 minutes. No signup needed. See your savings instantly.
          </p>
          <Link
            href="/#audit"
            id="bottom-cta"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            Start Your Free Audit →
          </Link>
        </div>
      </section>
    </div>
  );
}
