import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <svg viewBox="0 0 32 32" fill="none" className="h-7 w-7" aria-hidden="true">
                <circle cx="14" cy="14" r="9" stroke="var(--cl-blue)" strokeWidth="2.5" fill="none" />
                <text x="14" y="18" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--cl-green)" fontFamily="Inter, sans-serif">$</text>
                <line x1="21" y1="21" x2="28" y2="28" stroke="var(--cl-blue)" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <span className="text-lg font-bold text-foreground">
                Cred<span className="text-primary">Lens</span>
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground max-w-xs">
              Free AI spend audit tool. Find out if you&apos;re overpaying for AI tools — and save thousands annually.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Product</h3>
            <ul className="mt-3 space-y-2.5">
              <li>
                <Link href="/#audit" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Start Audit
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Credex */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Credex</h3>
            <ul className="mt-3 space-y-2.5">
              <li>
                <a
                  href="https://credex.rocks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  Buy Credits
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://credex.rocks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  Sell Credits
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Legal</h3>
            <ul className="mt-3 space-y-2.5">
              <li>
                <span className="text-sm text-muted-foreground">Privacy Policy</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {year} CredLens — A{" "}
            <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
              Credex
            </a>{" "}
            tool. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with ♥ for startups overpaying for AI
          </p>
        </div>
      </div>
    </footer>
  );
}
