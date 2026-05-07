# DEVLOG — CredLens

## Day 1 — 2025-05-07

**Hours worked:** 2

**What I did:**
- Scaffolded the Next.js 15 project with TypeScript, Tailwind CSS, and App Router
- Set up the design system with a Google-inspired color palette (blue, red, yellow, green accents)
- Built a complete theme system with light/dark/system mode toggle and localStorage persistence
- Created the Header component with CredLens logo (SVG magnifying glass with dollar sign), navigation, and CTA
- Created the Footer component with proper sections and Credex attribution
- Built the landing page with:
  - Hero section with floating AI tool brand icons downloaded them and stored in public folder used them animation 
  - Social proof bar (mocked metrics)
  - "How It Works" 3-step section with staggered animations
  - Supported tools bar showing all 8 tools
  - FAQ section with accordion-style details/summary elements
  - Bottom CTA section
- Defined TypeScript types for all core entities (tools, spend inputs, audit results, leads)
- Set up environment variable template (.env.example)
- Installed core dependencies: mongoose, @google/generative-ai, resend, nanoid

**What I learned:**
- Had an issue with floating brand logos not rendering — the Next.js `Image` component was failing silently for small decorative PNGs. Switched to plain `<img>` tags which fixed it immediately. Lesson: `next/image` is great for content images but overkill for small decorative icons where optimization isn't needed.
- Tailwind CSS v4 uses `@theme inline` blocks instead of the old `tailwind.config.ts` approach for custom theme values.
- The `suppressHydrationWarning` on `<html>` is essential when injecting a theme script to prevent React hydration mismatch.
**Blockers / what I'm stuck on:**
- None so far — clean start

**Plan for tomorrow:**
- Build the complete multi-tool spend input form with all 8 tools, plan dropdowns, seat counts
- Implement localStorage persistence for form state across reloads
- Add form validation
