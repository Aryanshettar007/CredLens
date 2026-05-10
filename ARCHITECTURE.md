# CredLens Architectural Overview

This document outlines the core architecture, data flow, and design patterns used to build the CredLens AI Spend Audit tool.

## 1. Tech Stack
- **Framework**: Next.js 15 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (Vanilla CSS aesthetic, zero config)
- **Database**: MongoDB Atlas with Mongoose ORM
- **AI Integration**: Google Gemini (`gemini-3-flash-preview`) via `@google/genai`
- **Email Delivery**: Resend API

## 2. Core Components & Data Flow

### The Audit Engine (`src/lib/audit-engine.ts`)
The heart of the application is a synchronous, rules-based engine. It processes the user's `SpendFormData` against verified vendor data (`src/lib/pricing-data.ts`).
- **Priority 1 (Seat Optimization)**: Identifies if a user is paying for more seats than their specified `teamSize` across all tools.
- **Priority 2 (Plan Downgrade)**: Recommends dropping to a cheaper tier within the same vendor if the capabilities match the `useCase`.
- **Priority 3 (Cross-Vendor Switch)**: Maps expensive tools to cheaper equivalents (e.g., Cursor Ultra → GitHub Copilot Pro).
- **Priority 4 (Credex Discount)**: Applies a volume-based discount logic (10–25%) for users who route their spending through the Credex platform.

### The Gemini AI Pipeline (`src/lib/gemini.ts`)
To provide a personalized, "CFO-like" executive summary, the output of the Audit Engine is serialized and sent to the Gemini API.
- **Prompt Engineering**: The prompt is strictly formatted (see `PROMPTS.md`) to prevent hallucination and enforce a 3-paragraph structure without markdown headers, ensuring it maps directly into our UI components.
- **Graceful Degradation**: If the Gemini API key is missing or the request fails, the pipeline returns `null`, and the frontend seamlessly hides the AI insights block without breaking the core experience.

### State Management & Persistence
1. **Client-Side Storage**: We use `localStorage` for the form inputs so users don't lose their data on refresh. We use `sessionStorage` to pass the complex `AuditResult` object from the home page to the results page, keeping the URL clean.
2. **Database (MongoDB)**: When the user unlocks their full report, the `AuditResult` is persisted to MongoDB (`Audit` model), and a `Lead` is created linking to that audit.

### The "Gate" & Lead Generation
The `/results` page acts as a "teaser". It immediately displays the high-level savings metrics (Total Spend vs Total Savings) but overlays a blurred `LeadCaptureForm` over the detailed breakdown.
- **Honeypot**: The form includes an invisible `website_url` input. Spam bots that fill this out are silently intercepted by the `POST /api/leads` route, preventing database pollution.
- **Email Delivery**: Upon successful form submission, the Resend API fires a transactional email to the user with a secure link to their persistent report.

### Public Share Routes (`src/app/share/[id]/page.tsx`)
This is a Server-Side Rendered (SSR) page that reads directly from MongoDB.
- **OpenGraph Tags**: Next.js `generateMetadata` reads the specific user's audit to dynamically generate `<meta property="og:title">` tags (e.g., "I found $14,000/yr in AI savings using CredLens!"). This ensures rich, highly-clickable previews when the URL is shared in Slack or iMessage.
