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

---

## Day 2 & 3 — 2026-05-08

**Hours worked:**4

**What I did:**
- Completed 2 days worth of work today because I will be busy tomorrow (2026-05-09) attending a Buildathon Bengaluru event in the Microsoft office!
- Created the comprehensive pricing data module (`src/lib/pricing-data.ts`) with all 8 tools:
  - IDE tools: Cursor (5 plans), GitHub Copilot (4 plans), Windsurf (4 plans)
  - Chat tools: ChatGPT (4 plans), Claude (5 plans), Gemini (3 plans)
  - APIs: OpenAI API and Anthropic API (usage-based)
- Built the SpendForm component with:
  - Tool cards grouped by category (Coding Assistants, Chat, APIs)
  - Toggle selection with smooth expand/collapse animation
  - Plan dropdown auto-populates price per user
  - Seats input for subscription tools, direct spend input for APIs
  - Live "total spend" calculation per card and in the submit button
  - Form validation (at least 1 tool, valid seats, valid plan selection)
- Built the ToolCard component with:
  - Visual checkbox indicator and colored brand icons
  - Expandable detail section with plan, seats, and spend fields
  - Computed total display (seats × price)
- Implemented localStorage persistence — form state survives page reloads
- Created the AuditSection wrapper component for client-side form submission
- Built the core Audit Engine (`src/lib/audit-engine.ts`) with hardcoded, finance-literate pricing rules based on official vendor data.
  - Implemented 4-priority recommendation logic: seat optimization, plan downgrade, cross-vendor switch (e.g., Cursor to Copilot Pro, Claude to ChatGPT), and Credex volume discount tiering.
- Developed the complete Results Page UI (`src/app/results/page.tsx`):
  - Dynamic "Savings Tier" hero messaging (high, medium, low, optimal).
  - 4-card summary (Current Spend, Optimized Spend, Monthly Savings, Annual Savings).
  - Componentized `ToolResultCard` for per-tool breakdown, styled via recommendation type badges.
  - Added Credex CTA block for high-spend users and honest "Looks Good" fallback for optimal stacks.
- Built the Gemini AI summary pipeline:
  - Created `src/lib/gemini.ts` with the new `@google/genai` SDK and a robust prompt engineered to sound like a "smart CFO friend." Added graceful degradation if the API key is missing.
  - Implemented the `/api/audit` Next.js Route Handler to run the rules engine instantly and fetch the Gemini summary asynchronously.
  - Updated the frontend form submission to hit the API, display a loading overlay, and handle errors.
- Created `PRICING_DATA.md` document (to be finalized with exact URLs) as required by the assignment constraints.

**What I learned:**
- Separating the form state (`SpendFormData`) from the selected tools set (`Set<ToolId>`) makes toggle logic much cleaner — the set drives UI state, while the formData array holds the actual values.
- Using `sessionStorage` for cross-page data passing (form → results) is a good pattern for Next.js App Router since it avoids URL param bloat and works without a backend.
- Moving computation to an API route (`/api/audit`) cleanly abstracts the heavy lifting (both sync business logic and async LLM calls) away from the client.
- Giving Gemini strict formatting constraints ("Do NOT use markdown headers or bullet points — just clean paragraphs") ensures the response fits perfectly into our custom UI without needing a full markdown parser.
- Had issues with the Google Gemini API imports. I figured out the difference between the deprecated `import { GoogleGenerativeAI } from "@google/generative-ai";` and the new unified `import { GoogleGenAI } from "@google/genai";` and corrected the AI's code to use the modern SDK.

**Blockers / what I'm stuck on:**
- None, the AI pipeline is working smoothly with the new package!

**Plan for tomorrow:**
- Build the email capture (Lead Capture) flow to guard the results.
- Set up MongoDB and Mongoose schemas to persist audit runs and captured leads.
- Create the final `/share/[id]` public route for sharable audits.
