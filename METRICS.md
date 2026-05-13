# Success Metrics & KPIs

CredLens is a B2B lead-generation tool, so the metrics focus on qualified leads and consultation intent rather than daily usage.

## North Star Metric
**Qualified Savings Leads per Week**: number of audits where (a) email is captured and (b) total savings >= $500/mo. This is the clearest indicator that the product is delivering value and that Credex has a real sales opportunity.

## Input Metrics (The 3 Levers)
1. **Audit Start Rate**: % of visitors who click “Start Audit.” If this drops, the landing page hook is weak.
2. **Audit Completion Rate**: % of users who finish the form and reach results. If this drops, the form is too long or confusing.
3. **Lead Capture Rate**: % of users who enter email to unlock details. If this drops, the perceived value is too low.

## Instrumentation Plan (What I’d Track First)
I would instrument the funnel with simple events: `landing_view`, `audit_start`, `audit_submit`, `results_view`, `lead_submit`, `share_click`, and `consult_click`. The first three tell me whether the product is valuable, and the last two tell me whether Credex is actually being considered.

## Pivot Triggers
- If audit completion rate stays below 60% after 500 users, the form needs simplification (fewer fields, better defaults).
- If lead capture rate stays below 15% after 300 completions, the “value shown before gate” needs to be stronger (more previewed details).
- If consult clicks from high-savings users stay below 5%, the CTA or value proposition for Credex is unclear and should be repositioned.

## Supporting Context Metrics
Track share rate and average savings as secondary indicators of virality. If share rate is <3%, the share CTA or OpenGraph preview needs improvement.
