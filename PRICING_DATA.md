# CredLens Pricing Data Source of Truth

This document contains the verified vendor pricing data used by the CredLens Audit Engine (`src/lib/audit-engine.ts`).

**Last Verified:** May 2026

## 1. IDE / Coding Assistants

### Cursor (Anysphere)
**Source:** https://www.cursor.com/pricing
- Hobby: $0/mo
- Pro: $20/mo
- Pro+: $60/mo
- Business: $40/mo per user
- Ultra: $200/mo

### GitHub Copilot (GitHub / Microsoft)
**Source:** https://github.com/features/copilot/plans
- Free: $0/mo
- Pro: $10/mo
- Business: $19/mo per user
- Pro+: $39/mo

### Windsurf (Cognition AI)
**Source:** https://windsurf.com/pricing
- Free: $0/mo
- Pro: $20/mo
- Teams: $40/mo per user
- Max: $200/mo

## 2. Chat Assistants

### ChatGPT (OpenAI)
**Source:** https://openai.com/chatgpt/pricing/
- Free: $0/mo
- Plus: $20/mo
- Team: $25/mo per user
- Enterprise: $60/mo per user

### Claude (Anthropic)
**Source:** https://www.anthropic.com/pricing
- Free: $0/mo
- Pro: $20/mo
- Team: $25/mo per user
- Max 5x: $100/mo
- Max 20x: $200/mo

### Gemini (Google)
**Source:** https://one.google.com/about/ai-premium
- Free: $0/mo
- Google AI Pro: $20/mo
- Google AI Ultra: $250/mo

## 3. APIs

### OpenAI API
**Source:** https://openai.com/api/pricing/
- Pay-as-you-go based on token usage. (No flat monthly seat cost).

### Anthropic API
**Source:** https://www.anthropic.com/pricing#api
- Pay-as-you-go based on token usage. (No flat monthly seat cost).

---

## 4. Credex Volume Discount Tiers
*(Internal logic applied in `audit-engine.ts`)*

- Spends < $200/mo: 0% discount
- Spends ≥ $200/mo: 10% discount
- Spends ≥ $500/mo: 15% discount
- Spends ≥ $1000/mo: 20% discount
- Spends ≥ $2000/mo: 25% discount
