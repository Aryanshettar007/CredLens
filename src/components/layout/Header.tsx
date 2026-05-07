"use client";

import Link from "next/link";
import { ThemeToggle } from "../ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full py-3 px-4 sm:px-6 lg:px-8">
      {/* Floating pill navbar — inspired by credex.rocks */}
      <nav
        className="mx-auto flex h-14 max-w-5xl items-center justify-between rounded-full border border-border bg-background/85 backdrop-blur-lg px-4 sm:px-6 shadow-sm shadow-black/5"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group" id="header-logo">
          <div className="relative flex h-7 w-7 items-center justify-center">
            <svg
              viewBox="0 0 32 32"
              fill="none"
              className="h-7 w-7 transition-transform group-hover:scale-110"
              aria-hidden="true"
            >
              <circle cx="14" cy="14" r="9" stroke="var(--cl-blue)" strokeWidth="2.5" fill="none" />
              <text x="14" y="18" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--cl-green)" fontFamily="Inter, sans-serif">$</text>
              <line x1="21" y1="21" x2="28" y2="28" stroke="var(--cl-blue)" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            Cred<span className="text-primary">Lens</span>
          </span>
        </Link>

        {/* Center nav links */}
        <div className="hidden sm:flex items-center gap-1">
          <Link
            href="/#how-it-works"
            className="rounded-full px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary"
          >
            How it Works
          </Link>
          <Link
            href="/#faq"
            className="rounded-full px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary"
          >
            FAQ
          </Link>
          <a
            href="https://credex.rocks"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary"
          >
            Credex
          </a>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Link
            href="/#audit"
            id="header-cta"
            className="inline-flex h-8 items-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
          >
            Start Audit
          </Link>
        </div>
      </nav>
    </header>
  );
}
