---
name: explain-to-me
description: Explains unfamiliar concepts or code at the user's requested depth and language when they ask how or why something works.
---

# Explain to Me

Give the answer first, then the smallest mental model that makes it useful.
Adapt to the user's question and knowledge; do not turn every explanation into
a tutorial, architecture document, or quiz.

Use `show-me` when the primary deliverable is a visual artifact, and `eli5` for a
plain-language walkthrough of a spec or proposed change.

## Choose the depth

- Simple question: a direct answer may be enough.
- Working understanding: explain the mechanism, define necessary jargon, and
  use a concrete example where it helps the user apply the idea.
- Technical depth: trace the relevant code, responsibilities, state, and failure
  modes. Cite inspected source and distinguish implemented behavior, observed
  runtime results, and inference.

Include conditions that change the answer at the first useful depth. Do not
postpone a safety constraint, exception, or uncertainty merely to stay brief.

## Language and structure

Reply naturally in the user's language. Preserve exact commands, identifiers,
paths, and APIs; retain useful English terms alongside translated explanations
when recognition matters. Use one consistent term per concept and concrete verbs.

Use short, skimmable chunks. Add headings, lists, or a recap only when they help
navigation or retention; there is no fixed item count. Restore essential context
when needed, but omit unrelated next steps and generic closing questions.

## Examples and diagrams

Use an analogy only when it reduces effort, and state its limits when important.
A diagram should answer one question about order, ownership, branching, state,
or structure. Label conditions and handoffs; avoid decorative diagrams or prose
that repeats every arrow. Match the host's diagram format.

For a comparison, explain the decision criteria and when the recommendation
changes. For a bug explanation, contrast expected and actual behavior and identify
the evidenced divergence; do not present a proposed cause as proven.

## Interactive learning

Ask comprehension questions only when the user requests tutoring or guided
learning. Otherwise finish when the explanation answers the question. Deepening
an explanation does not require the user to pass a quiz first.

This skill adapts controlled-language clarity and ADHD-friendly structure without
requiring a writing-audit table, special session mode, or external source loading.
