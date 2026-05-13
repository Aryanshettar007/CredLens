# User Interviews & Market Research

I could not reach enterprise founders in time, so I interviewed three developer friends who actively use AI tools and are planning AI startups. These were 10–15 minute conversations focused on how they buy tools today, what feels wasteful, and what would make an audit feel trustworthy.

---

## Interview 1 — Rahul (National level hackathon winner)
**Role / Stage:** Full-stack developer, pre-seed AI startup idea, solo builder.

Rahul uses Cursor, ChatGPT Plus, and Gemini for his side project and expects to add Claude for research. He described his AI spend as “death by a thousand subscriptions” and said he does not have a simple way to see overlap or whether a tool tier is overkill. He reacted positively to the concept of a deterministic audit that shows exact plan switches with numbers. He was fine with an email gate as long as he saw the top-line savings first and got a shareable link after.

**Direct quotes:**
- “I am paying for three tools that do similar things, but I keep them because I do not want to lose my workflow.”
- “If you show me the exact plan to move to and the savings, I will trust it more than a generic AI recommendation.”
- “I do not mind the email gate if I already see the savings headline.”

**Most surprising thing:** He said the shareable report is more useful than email for his workflow because he forwards links to collaborators more than he checks marketing emails.

**What it changed about the design:** I kept the soft gate (show totals first, blur the breakdown) and made the share link the primary post-audit action. Rahul also helped me map the audit data flow and suggested keeping the share page SSR for better OpenGraph previews.

---

## Interview 2 — Kowshik (GDG JSSATEB member, developer)
**Role / Stage:** Developer, early-stage team building an AI devtool.

Kowshik’s team is small (3–4 people) and rotates between ChatGPT Team, Claude Pro, and Gemini Pro depending on the task. He said the main problem is “context switching cost” rather than just price, so any recommendation needs a reason that explains why the alternative is truly equivalent. He also asked whether the audit accounts for use case (coding vs. research), because he would ignore a recommendation that didn’t reflect how his team uses the tools.

**Direct quotes:**
- “I will switch only if the recommendation tells me I am not losing a core capability.”
- “Show the reason, not just the number.”
- “If it knows I am mostly coding, the downgrade makes more sense.”

**Most surprising thing:** He said he would happily share an audit screenshot publicly if it looked clean and defensible, which means the report design is a growth lever.

**What it changed about the design:** I emphasized one-sentence reasons per tool and kept the use-case field in the form. It also reinforced the importance of the share page and OpenGraph preview for viral sharing.

---

## Interview 3 — Rishit (GDG JSSATEB Web Dev Lead, 5x hackathon winner)
**Role / Stage:** Team lead, small dev team exploring an AI SaaS concept.

Rishit manages interns and short-term collaborators. His biggest issue is “zombie seats” that remain active after a contractor leaves. He liked the seat optimization rule because it turns a vague pain into a concrete action. He also said he wants honest feedback when the stack is already optimized, because exaggerating savings would make him distrust the tool. He did not care about a long AI summary but wanted the top insight and the next action to be obvious.

**Direct quotes:**
- “We forget to remove seats and the bill quietly grows.”
- “If the savings are small, tell me that. Do not make up a reason.”
- “I just want the top action and the estimated savings in one glance.”

**Most surprising thing:** He said he would prefer a shorter summary if it removed fluff, which pushed me to keep the AI summary concise and structured.

**What it changed about the design:** I made sure the low-savings state is honest (“you are spending well”), and I kept the results page hierarchy focused on the top savings and single best action. I also added the anti-spam honeypot so the lead list stays clean.

---

## Key Takeaways
1. **Trust comes from specificity**: explicit plan switches plus a one-sentence reason per tool.
2. **Soft gating beats hard gating**: show top-line savings first, then ask for email.
3. **Shareability is a feature**: a clean share page and OpenGraph preview drive organic growth.
