# CredLens 🔍

CredLens is a powerful AI spend audit tool built for startups and enterprise teams. It analyzes a company's software stack (like ChatGPT, GitHub Copilot, Cursor, etc.) and instantly finds actionable savings through seat optimization, plan downgrades, cross-vendor switching, and exclusive volume discounts.

## Core Features
- **Dynamic Rules Engine**: A hardcoded, highly tested algorithm that maps usage patterns to optimal pricing tiers across 8+ major AI vendors.
- **AI-Powered "CFO" Summaries**: Integrates with the Google Gemini (`gemini-3-flash-preview`) API to read the mathematical audit results and generate a conversational, actionable executive summary.
- **Lead Generation Pipeline**: Audits are "gated" behind a beautiful blur UI. Users must enter an email (verified through a honeypot anti-spam check) to unlock the full breakdown.
- **Transactional Emails**: Integrates with the Resend API to securely email users a permalink to their audit.
- **Sharable SSR Links**: Unique, persistent URLs (`/share/[id]`) loaded server-side from MongoDB, complete with dynamic OpenGraph tags for rich social media previews.

## Tech Stack
- **Framework:** Next.js 15 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (Zero-config, vanilla aesthetics)
- **Database:** MongoDB Atlas (Mongoose ORM)
- **Email Delivery:** Resend API
- **Testing:** Vitest
- **CI/CD:** GitHub Actions & Vercel

## Getting Started

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI="your_mongodb_connection_string"
   GEMINI_API_KEY="your_google_ai_key"
   RESEND_API_KEY="your_resend_api_key"
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

## Documentation
- [ARCHITECTURE.md](./ARCHITECTURE.md): Detailed explanation of data flow, state management, and the Gemini pipeline.
- [PROMPTS.md](./PROMPTS.md): The exact system prompts engineered for the Gemini API.
- [TESTS.md](./TESTS.md): Explanation of the Vitest framework and unit test scenarios.
- [DEVLOG.md](./DEVLOG.md): Daily development log chronicling the build process and technical decisions.
