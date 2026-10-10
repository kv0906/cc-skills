---
name: show-me
description: Explains the current topic with a focused diagram, code-shape sketch, or visual artifact. Use when the user explicitly asks to see or visualize an explanation.
---

# Show Me

Make the current topic easier to understand visually. Skip the preamble and choose the smallest useful form:

- pseudocode for decisions, ordering, or algorithms;
- a call tree for runtime flow;
- a component or file tree for ownership and structure;
- a plain-text diagram for relationships, sequences, or state flow (Mermaid only when explicitly requested);
- a compact diff when the key point is what changes;
- one focused HTML artifact only when text diagrams cannot communicate a visual UI, layout, comparison, or dense concept.

Place each visual next to the short explanation it supports. Include only relevant calls, files, states, props, and boundaries. Do not create an artifact merely because the skill supports one. If HTML is warranted, use real labels/data, support the necessary viewport sizes, and provide it through the environment's supported preview mechanism.
