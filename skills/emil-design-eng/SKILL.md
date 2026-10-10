---
name: emil-design-eng
description: "Applies Emil Kowalski-inspired design-engineering philosophy when explicitly requested. Use for opt-in guidance on UI taste, polish, interaction craft, and invisible details; use the dedicated animation skills for motion tasks."
disable-model-invocation: true
---

# Emil Design Engineering

Use this skill only when the user explicitly invokes it or asks for Emil Kowalski's design-engineering philosophy. Do not trigger it for routine UI implementation, animation work, or design review.

## Role

Apply a restrained craft lens: train taste by studying strong interfaces, make behavior match user expectations, and treat small interaction details as a coherent system rather than isolated decoration. Beauty can improve trust and usability, but never overrides accessibility, performance, or product context.

## Choose the task-specific skill

- Build requested motion with `animate`.
- Discover worthwhile motion opportunities without editing code with `find-animation-opportunities`.
- Audit motion across a codebase and write plans with `improve-animations`.
- Review an existing animation implementation or diff with `review-animations`.

Those skills own animation workflows and defaults. Do not duplicate or override them here.

## Workflow

1. Identify the user's product, audience, frequency of use, and concrete goal.
2. Inspect the existing design language before recommending a new pattern.
3. Explain the highest-leverage craft issue first: purpose, behavior, cohesion, feedback, or polish.
4. Prefer the smallest change that improves the experience.
5. Validate accessibility, input modes, reduced motion, and runtime performance.
6. State which choices require visual or device testing instead of presenting taste as certainty.

Load [reference/design-engineering-guide.md](reference/design-engineering-guide.md) only when detailed principles, component recipes, gesture guidance, debugging methods, or examples are needed. Treat its numeric values as starting points to adapt to the product and existing tokens, not universal requirements.
