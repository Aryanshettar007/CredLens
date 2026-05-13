# CredLens Architectural Overview

This document outlines the core architecture, data flow, and design patterns used to build the CredLens AI Spend Audit tool.

## 1. Tech Stack
- **Framework**: Next.js 15 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (Vanilla CSS aesthetic, zero config)
- **Database**: MongoDB Atlas with Mongoose ORM
- **AI Integration**: Google Gemini (`gemini-3-flash-preview`) via `@google/genai`
- **Email Delivery**: Resend API

## 2. System Diagram (Mermaid)

```mermaid
flowchart LR
	subgraph Client
		Landing[Landing Page] --> SpendForm[Spend Input Form]
		SpendForm --> AuditSubmit[POST /api/audit]
		Results[Results Page]
		Results --> ShareCTA[Share Results Button]
		Results --> LeadGate[Lead Capture Gate]
		LeadGate --> Unlocked[AI Summary + Breakdown (Unlocked)]
	end

	subgraph Server
		AuditAPI[API /api/audit] --> AuditEngine[Rules Engine]
		AuditEngine --> Gemini[Gemini Summary]
		LeadsAPI[API /api/leads] --> MongoDB[(MongoDB Atlas)]
		SharePage[SSR /share/:id] --> MongoDB
	end

	AuditSubmit --> AuditAPI
	AuditEngine --> Results
	Gemini --> Unlocked
	LeadGate --> LeadsAPI
	LeadsAPI --> Email[Resend Email]
	ShareCTA --> SharePage
```

## 3. Core Components & Data Flow

### End-to-End Data Flow
1. A visitor lands on the marketing page and fills out the multi-tool spend form.
2. The client submits the form to `POST /api/audit`.
3. The rules engine computes deterministic savings and returns the full audit.
4. The server calls Gemini to generate a short summary; if Gemini fails, a templated summary is returned.
5. The results page renders totals immediately, but keeps the AI summary and detailed tool-by-tool breakdown behind the email gate.
6. When a user submits the lead form, `POST /api/leads` persists the audit and lead in MongoDB, unlocks the AI summary + breakdown, and sends a Resend email with the `/share/:id` link.
7. The share page (`/share/:id`) is SSR and reads the saved audit for link previews and public viewing.

### The Audit Engine (`src/lib/audit-engine.ts`)
The heart of the application is a synchronous, rules-based engine. It processes the user's `SpendFormData` against verified vendor data (`src/lib/pricing-data.ts`).
- **Priority 1 (Seat Optimization)**: Identifies if a user is paying for more seats than their specified `teamSize` across all tools.
- **Priority 2 (Plan Downgrade)**: Recommends dropping to a cheaper tier within the same vendor if the capabilities match the `useCase`.
- **Priority 3 (Cross-Vendor Switch)**: Maps expensive tools to cheaper equivalents (e.g., Cursor Ultra → GitHub Copilot Pro).
- **Priority 4 (Credex Discount)**: Applies a volume-based discount logic (10–25%) for users who route their spending through the Credex platform.

### The Gemini AI Pipeline (`src/lib/gemini.ts`)
To provide a personalized, "CFO-like" executive summary, the output of the Audit Engine is serialized and sent to the Gemini API.
- **Prompt Engineering**: The prompt is strictly formatted (see `PROMPTS.md`) to prevent hallucination and enforce a 3-paragraph structure without markdown headers, ensuring it maps directly into our UI components.
- **Graceful Degradation**: If the Gemini API key is missing or the request fails, the pipeline returns a templated fallback summary so the UI remains consistent.

### State Management & Persistence
1. **Client-Side Storage**: We use `localStorage` for the form inputs so users don't lose their data on refresh. We use `sessionStorage` to pass the complex `AuditResult` object from the home page to the results page, keeping the URL clean.
2. **Database (MongoDB)**: When the user unlocks their full report, the `AuditResult` is persisted to MongoDB (`Audit` model), and a `Lead` is created linking to that audit.

### The "Gate" & Lead Generation
The `/results` page acts as a "teaser". It immediately displays the high-level savings metrics (Total Spend vs Total Savings) but overlays a blurred `LeadCaptureForm` over the AI summary and detailed breakdown.
- **Honeypot**: The form includes an invisible `website_url` input. Spam bots that fill this out are silently intercepted by the `POST /api/leads` route, preventing database pollution.
- **Email Delivery**: Upon successful form submission, the Resend API fires a transactional email to the user with a secure link to their persistent report.

### Public Share Routes (`src/app/share/[id]/page.tsx`)
This is a Server-Side Rendered (SSR) page that reads directly from MongoDB.
- **OpenGraph Tags**: Next.js `generateMetadata` reads the specific user's audit to dynamically generate `<meta property="og:title">` tags (e.g., "I found $14,000/yr in AI savings using CredLens!"). This ensures rich, highly-clickable previews when the URL is shared in Slack or iMessage.

## 4. Why This Stack
- **Next.js App Router**: Server-rendered share pages and API routes without a separate backend.
- **TypeScript**: Pricing logic needs strict types to avoid silent mistakes in math.
- **MongoDB**: Simple document storage for audit snapshots and leads; fits the data shape naturally.
- **Resend**: Lightweight transactional email with minimal integration overhead.
- **Gemini**: Provides a human summary without changing the deterministic audit math.

## 5. Scaling to 10k Audits/Day
To handle 10k audits/day, I would:
- Add a queue for AI summary generation (e.g., a background job) to prevent API spikes.
- Cache audit results keyed by a hash of form data so duplicate audits return instantly.
- Introduce read replicas or a managed cluster tier for MongoDB to avoid write bottlenecks.
- Move the share page to ISR with revalidation, since share URLs are mostly read-only.
- Add basic rate limiting at the API layer to protect from abuse and spikes.
