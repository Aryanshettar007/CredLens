# CredLens — AI Spend Audit Tool

A free web app that audits startup AI tool spending, surfaces savings, and generates leads for Credex.

## Overview

CredLens helps startups understand if they are overpaying for AI tools (like ChatGPT, Claude, GitHub Copilot, Cursor, etc.). Users input their current stack, plan tiers, and seat counts, and the tool's audit engine analyzes the data against official vendor pricing to recommend cheaper plans, better alternatives, and Credex discounts.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + custom design system (Google/Credex inspired)
- **Database:** MongoDB Atlas (Mongoose)
- **AI Integration:** Google Gemini API (for personalized summaries)
- **Emails:** Resend
- **Deployment:** Vercel

## Local Development Setup

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   Copy `.env.example` to `.env.local` and fill in the required keys:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   RESEND_API_KEY=your_resend_api_key
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```
4. **Run the development server:**
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app/`: Next.js App Router pages and API routes
- `src/components/`: Reusable React components (Layout, UI, Icons)
- `src/lib/`: Core logic (Audit Engine, DB connection, API clients)
- `src/types/`: TypeScript interfaces and type definitions
- `src/models/`: Mongoose schemas
- `public/`: Static assets (Logos, OG Images)

## Assignment Documentation

This project fulfills the requirements of the Credex Web Development Intern Assignment. Please refer to the following required documentation files:

- [`ARCHITECTURE.md`](ARCHITECTURE.md): Technical decisions, data flow, and stack justification
- [`DEVLOG.md`](DEVLOG.md): Daily progress log across the 7-day build
- [`TESTS.md`](TESTS.md): Test suite documentation
- [`PRICING_DATA.md`](PRICING_DATA.md): Verifiable pricing sources for the audit engine
- [`PROMPTS.md`](PROMPTS.md): LLM prompt engineering strategies
- [`GTM.md`](GTM.md): Go-to-market strategy
- [`ECONOMICS.md`](ECONOMICS.md): Business model and unit economics
- [`USER_INTERVIEWS.md`](USER_INTERVIEWS.md): Insights from user interviews
- [`LANDING_COPY.md`](LANDING_COPY.md): Landing page copywriting strategy
- [`METRICS.md`](METRICS.md): Key performance indicators for the product
- [`REFLECTION.md`](REFLECTION.md): Personal reflection on the assignment

## License

This project is created for the Credex Web Development Intern Assignment.

