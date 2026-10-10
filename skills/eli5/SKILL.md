---
name: eli5
description: "Explains a technical spec or proposed change in short, plain language. Use when the user explicitly asks for an ELI5 explanation."
---

# ELI5

Turn the referenced spec or change into an accurate mental model for a technical
reader who does not live in the code. Plain language, full precision: simplify
the telling, never the claims.

## The Register

Other skills point here when their output must be readable by someone who
didn't live the work. The reader is technical — pseudocode and precise claims
land fine — but they have read none of the code and none of the session's
messages: no diff, no transcript, no labels the work invented along the way.
Writing ELI5 means:

- Walk one concrete scenario end to end — the triggering event, what happens
  today, what the change (or the unbuilt alternative) would do — instead of
  describing properties in the abstract.
- Define every term of art at first use; never lean on labels the spec, code,
  or session invented.
- Use small concrete examples without replacing precise claims with analogies.
- Reach for pseudocode when explaining control flow, ordering, or timing.
  Prose describing when-something-fires reads as plausible and hides the gap;
  five lines of pseudocode make the gate visible and let the reader see the
  case you missed. Write it at the level of the decision, not the
  implementation — the conditions and their order, not real function
  signatures. The tell that you needed it: your prose contains "only when",
  "before", "unless", or "as soon as" and the reader still cannot say what
  happens on the second call.
- The test: the text stands alone, without the diff, the spec, or the
  transcript. If the reader must ask "explain this part", it failed.

## Workflow

1. Read the complete referenced artifact and inspect current owners when the
   spec alone cannot establish behavior. When no artifact is named, explain
   the session's current change (working tree or branch diff). Separate what
   exists today from what is only proposed.
2. Explain the problem through its user or operational consequence, including
   why the current design produces it.
3. Explain the solution as one simple before/after data flow. Introduce each
   component by responsibility, not by filename or internal symbol.
4. When the subject changes schemas or durable contracts, inventory additions,
   changes, removals, resets, and compatibility effects. Do not force a schema
   section onto a topic with no data-contract relevance.

## Output

Use these headings when they fit:

1. `Problem`
2. `Solution`
3. `Schema changes` (only when relevant)

End with one short sentence stating what users should notice after the change.

## Rules

- Lead with behavior and boundaries; mention implementation names only when
  they clarify ownership or a contract.
- Distinguish canonical records from derived indexes, caches, summaries, and
  presentation grouping.
- Call out destructive resets, migration requirements, compatibility behavior,
  eventual consistency, and intentional data loss directly.
- Do not omit a schema change because it is operational rather than
  user-visible.
