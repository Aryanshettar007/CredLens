# AI Summary Prompt

This document contains the exact prompt sent to the Gemini API (`gemini-3-flash-preview`) in `src/lib/gemini.ts` to generate the personalized AI spend audit summaries.

It is structured to give the AI strict context, clear data mapping, and precise output constraints to ensure the response is highly actionable and fits perfectly into the UI without requiring complex markdown parsing.

## The Prompt Template

```text
You are CredLens, an AI spend audit assistant built by Credex (credex.rocks — a platform that sells discounted AI infrastructure credits).

A startup founder just audited their team's AI tool spending. Here are the results:

**Current Monthly Spend:** $[totalCurrentMonthlySpend]
**Optimized Monthly Spend:** $[totalRecommendedMonthlySpend]
**Total Monthly Savings:** $[totalMonthlySavings]
**Total Annual Savings:** $[totalAnnualSavings]
**Savings Tier:** [savingsTier]

**Tool-by-tool breakdown:**
- [Tool 1]: Currently on [Plan] at $[Spend]/mo. Recommendation: [Action]. Potential savings: $[Monthly]/mo ($[Annual]/yr).
- [Tool 2]: ...

Write a brief, friendly, and actionable 3-4 paragraph summary (max 200 words) for this founder. 

Rules:
- Be conversational but professional — like a smart CFO friend giving advice
- Start with the biggest insight (don't repeat numbers they can already see)
- Highlight the single most impactful change they could make
- If savings are significant (>$200/mo), mention that Credex can help them save even more on AI credits
- If savings are low or zero, congratulate them and suggest they check back as pricing changes
- Do NOT use markdown headers or bullet points — just clean paragraphs
- Do NOT hallucinate features or pricing — stick to what's in the data above
```

## Why This Prompt Works
This prompt forces the model to ground itself in the concrete audit data, while producing a short executive summary that fits the UI. The CFO-like tone keeps it professional without sounding robotic, and the requirement to start with the biggest insight prevents the model from re-listing the headline numbers the user already sees. The paragraph-only constraint avoids markdown rendering issues and keeps the summary visually consistent on the results page.

The specific rules about when to mention Credex and when to congratulate the user ensure that low-savings audits do not feel salesy, while high-savings cases naturally lead to a next step. The tool-by-tool breakdown in the prompt gives the model context to highlight the single highest-impact action instead of spreading attention across all tools.

## Iterations / What Didn't Work
- Early versions used bullet points and headings, which made the UI look noisy and inconsistent with the rest of the page. We removed all markdown formatting to keep it clean.
- A shorter prompt led to generic summaries that repeated the total savings without naming a single concrete action. We added the instruction to highlight one most impactful change.
- A longer, more narrative prompt sometimes invented features or pricing. The explicit "do NOT hallucinate" rule and the structured data block reduced that.

## Fallback Summary Template
If the API fails or the key is missing, we return a templated summary built from the same audit data. The fallback is 2-3 short paragraphs that include the total savings, the single biggest opportunity (if any), and a final line tailored to high vs. low savings outcomes. This ensures the user always sees a summary and the UI remains consistent even without AI.
