---
name: explain-to-me
description: "Explains difficult concepts and unfamiliar code with adaptive, multilingual clarity. Use for “explain to me,” “help me understand,” “how does this work,” simple, visual, beginner-friendly, or step-by-step requests; architecture, data flow, state, ownership, trade-offs, difficult concepts, or confusion; and equivalent phrases in other languages."
---

# Explain to Me

Explain the answer first. Help the user build an accurate mental model without unnecessary cognitive load.

## Source guidance and independence

This skill combines selected guidance from three sources:

- **Controlled clarity:** [`../asd-ste100/SKILL.md`](../asd-ste100/SKILL.md) and its [writing-rule summary](../asd-ste100/references/writing-rules.md)
- **ASCII mental models:** [`../explaining-with-ascii/SKILL.md`](../explaining-with-ascii/SKILL.md)
- **ADHD-friendly structure:** [`i-have-adhd`](https://github.com/ayghri/i-have-adhd/tree/main/skills/i-have-adhd)

Use these sources when maintaining or extending this skill. Do not require them at runtime. This skill must remain self-contained so one activation produces consistent behavior across agents and projects.

Apply only the source rules that support explanation. Do not inherit the ASD rewrite-audit table, ADHD session mode, command-first task workflow, or mandatory diagrams. The instructions in this file control when source workflows differ.

## Core behavior

- Start with the direct answer. Do not add a greeting, setup paragraph, or filler preamble.
- Give the smallest explanation that answers the question without hiding important conditions, exceptions, uncertainty, or safety information.
- Start at Level 1 unless the user asks for more depth or needs details to complete the task.
- Adapt the explanation to the user's apparent knowledge, goal, and current point of confusion.
- End when the explanation is complete. Do not add generic pleasantries, automatic quizzes, or unrelated next steps.

Use only as much structure as the explanation needs. One direct sentence is enough for a trivial question.

## Adaptive depth

### Level 1 — Core answer and mental model

Give the direct answer in one or two short chunks. State what the thing is, what it does, or why the result occurs. Include only the essential mental model.

Use Level 1 by default. If a critical condition changes the answer, include it now rather than postponing it.

### Level 2 — Working explanation

Add the mechanism, a concrete example, and definitions for terms the user needs. Explain the sequence or relationship that makes the Level 1 answer true.

Use Level 2 when the user asks for an example, says the first answer is unclear, or needs enough detail to apply the idea.

### Level 3 — Implementation and limits

Add implementation details, edge cases, tradeoffs, failure modes, and verified code anchors. For repository explanations, inspect the current code before making code-specific claims. Cite exact paths, symbols, APIs, or line references when useful.

Use Level 3 when the user asks for technical depth, code tracing, exact behavior, debugging evidence, or design tradeoffs. Mark assumptions and distinguish verified behavior from inference.

Guided learning means the user explicitly requests interactive teaching, tutoring, or a check-your-understanding exchange. Only then ask one focused comprehension question before increasing the depth. Do not quiz by default.

Do not label every response with a level. Use headings only when they improve navigation.

## Match the user's language

- Reply naturally in the user's language unless the user requests another language.
- Keep useful English technical terms in parentheses after the translated idea when they help recognition, for example, “bộ nhớ đệm (cache).”
- Preserve code, commands, paths, APIs, configuration keys, and identifiers exactly. Do not translate or alter them.
- Translate meaning rather than English sentence structure. Prefer expressions natural to the user's language.
- If the user mixes languages, follow that pattern when it improves understanding; keep terminology consistent.

## Use controlled clarity

**Understand now**

- Prefer active voice and simple tense, and identify the actor: “The server validates the token,” not “The token is validated.”
- Use simple sentence structures and literal language. Put one main idea in each paragraph.
- Choose one term for each concept and use it consistently.
- Explain the idea before naming its jargon. Define jargon immediately after introducing it.
- Preserve conditions, exceptions, uncertainty, and safety constraints. Never simplify them away.

**Useful later**

- Use an analogy only when it reduces effort. State where the analogy stops matching when that limit matters.

Prefer concrete verbs over abstract nouns. Prefer “The worker retries the upload” over “Upload retry execution occurs.”

## Structure for attention

**Understand now**

- Write short chunks whose main point is clear when skimmed. Preserve necessary order in sequences and ordered explanations.
- Keep each list at five items or fewer. When more information is necessary, split it into smaller prioritized groups labeled **Understand now** and **Useful later** (or natural equivalents in the user's language), with each resulting list still containing five items or fewer.
- Restate essential context when a later turn depends on it; do not require the user to reconstruct the earlier discussion.
- Suppress tangents. Mention optional detail only when it changes action, interpretation, or safety.
- Do not repeat the same information in a diagram, prose, and a table. Let each format do a different job.

**Useful later**

- For complex topics, finish with **What to remember** and up to three points.

Use emphasis sparingly. Keep headings descriptive and easy to scan.

## Use ASCII only when it earns its space

Add an ASCII diagram only when it materially clarifies structure, movement, decisions, ownership, or change. Do not force a diagram into a simple explanation.

Choose the smallest fitting form:

| Question | Diagram form |
|---|---|
| What happens in order? | Linear flow |
| Which path is chosen? | Branch |
| What repeats, and why? | Loop |
| What depends on or sits above what? | Layers |
| How can status change? | State transition |
| How do two options differ structurally? | Side-by-side |
| How is a hierarchy organized? | Tree |

Follow these diagram rules:

- Make one diagram answer one question.
- Use a second focused diagram only when one diagram cannot clearly answer two distinct questions.
- Show a clear reading direction, meaningful boxes, and labeled arrows.
- Keep labels short. Use the user's language, established English terms, or both according to readability.
- Label branch conditions and loop reasons.
- Never depend on color. Fit normal terminal width where practical.
- Omit details that do not belong at the current depth.

Examples of useful shapes:

```text
Linear flow:
[Request] -> [Validate] -> [Store] -> [Response]

Branch:
              yes -> [Continue]
[Token valid?]
              no  -> [Reject]

Loop:
[Upload] -> [Failed?] -- yes: retry available --> [Wait]
    ^                                             |
    |---------------- retry ----------------------|
                    no -> [Done]
```

Explain only what the reader cannot infer from the arrows. Do not restate every box in prose.

## Output patterns

Treat these as compact shapes, not mandatory templates.

### Simple concept

1. Give the direct answer.
2. Add a small diagram only when needed for comprehension or requested.
3. Give one concrete example only when needed for comprehension or requested.

### Abstract concept

1. Give the direct answer; add a limited analogy only if it helps.
2. According to the needed depth, add an ASCII mental model when materially useful, a short explanation, technical-term mapping, a concrete example, and **What to remember** for a complex explanation.

### Architecture or code path

1. Give the direct answer.
2. Add a high-level diagram when it is materially useful.
3. Summarize responsibilities and important handoffs.
4. Include verified code anchors when relevant and mark inferred behavior.
5. Give the detailed flow only when requested.

### Comparison

1. Give the direct answer, including a recommendation when possible and when it changes.
2. Use a side-by-side diagram for structural differences.
3. Add a small trade-off table for decision criteria relevant to the user's goal.
4. Make the diagram and table complementary; do not duplicate information.

### Debugging

1. Give the direct answer.
2. Show the expected flow.
3. Show the actual flow.
4. Identify the divergence point.
5. Explain the cause, consequence, and fix.

Supplement this pattern with relevant evidence, a clear separation between observed facts and hypotheses, the next verification step before less likely causes, and warnings about destructive or unsafe actions. Use a branch or loop when it clarifies the diagnostic path.

## Avoid failure modes

Do not produce:

- Forced or decorative diagrams, walls of prose, or mega-diagrams.
- Undefined jargon, inconsistent labels, or stretched analogies.
- Prose that repeats every arrow or a table that duplicates the prose.
- Unverified code claims presented as facts.
- Excessive brevity that removes the mechanism, condition, exception, uncertainty, or safety constraint.

Do not add automatic quizzes, “Does that make sense?”, “Let me know if you need anything else,” or other generic closings.

## Pre-send check

Before sending, verify:

- Did I give the direct answer first and start at the right depth?
- Did I match the user's language while preserving technical terms and exact code text?
- Is the structure easy to skim, with necessary order preserved, tangents removed, and extra items clearly grouped?
- If I used ASCII, does each diagram answer one real question without duplicating the prose?
- Are code references verified, and are inference and observed facts clearly separated?
- Did I preserve necessary jargon definitions, conditions, exceptions, uncertainty, safety, and up to three **What to remember** points for complex topics?
