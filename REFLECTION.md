# Final Reflection: Building CredLens

Building CredLens in 7 days was an exercise in balancing "B2B Professionalism" with "Lead-Gen Conversion Tactics."

## Technical Decisions & Rationale

### 1. The Rules Engine vs. Pure AI
We decided to build a hardcoded TypeScript rules engine for the actual math (`src/lib/audit-engine.ts`) instead of letting an LLM calculate the savings. 
- **Reason:** Accuracy. Users will not trust a financial tool that "hallucinates" a $20 discount. AI is used solely for the "human" summary, while the math remains deterministic.

### 2. Next.js 15 & Turbopack
Using the latest Next.js 15 features like `generateMetadata` for dynamic OpenGraph tags made the product "viral-ready" with very little code. The `/share/[id]` routes feel premium because of the server-side rendering and instant social previews.

### 3. The "Gate" UI
The decision to blur the results was a product risk. However, by showing the **Total Savings** first and blurring only the *how-to-fix-it* part, we provide enough value (the "What") to justify the "price" of an email address (the "How").

## Challenges Overcome

- **Shadow IT Detection:** Modeling the logic for when to suggest a "Team" plan vs. "Individual" plan required deep research into vendor pricing (Cursor, OpenAI, etc.), which we documented in `PRICING_DATA.md`.
- **Email Deliverability:** Setting up Resend with a custom domain (`aryanshettar.tech`) and DNS records was a crucial step to ensure the lead-gen emails actually hit the inbox, not the spam folder.

## Future Roadmap

1. **Browser Extension:** A Chrome extension that automatically detects which AI tools an employee is logged into, making the audit 100% automated.
2. **Direct Purchase Integration:** Allowing users to click "Optimize" and have Credex automatically handle the plan downgrades and tool switches via API.
3. **Multi-Currency Support:** Adapting the pricing data for EU/India markets where pricing tiers and tax implications (VAT/GST) vary.

## Final Thought
CredLens proves that a simple, focused utility can be a powerful engine for a complex B2B business model. By solving a small, annoying problem (AI spend bloat), we earn the trust to solve a big one (Infrastructure procurement).
