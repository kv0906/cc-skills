---
name: animate
description: Implements a specific UI animation or transition. Use when asked to build motion; not for discovering opportunities, auditing an interface, reviewing a diff, or naming an effect.
---

# Build an Animation

Implement the requested motion in the existing stack. First establish its purpose and usage context; a no-motion or subtler-feedback solution is valid when animation would slow a frequent action or distract from functional content.

Honor explicitly requested behavior while preserving accessibility and responsiveness; explain tradeoffs rather than silently substituting a smaller feature. Keyboard initiation alone does not disqualify useful, non-blocking feedback.

## Workflow

1. Inspect the component, interaction states, existing motion tokens, and installed library versions.
2. Choose the simplest suitable mechanism: CSS transitions/`@starting-style` for simple state changes, WAAPI for programmatic browser animation, or the project's motion library for gestures, layout, exit, or spring behavior.
3. Match duration, easing, distance, and origin to the component and product rather than treating a table value as law. Prefer responsive entrances, coherent spatial paths, and compositor-friendly properties where practical.
4. Make rapidly retargeted or gesture-driven motion interruptible. Preserve current position and velocity when the chosen library supports it.
5. Include an appropriate `prefers-reduced-motion` alternative. Gate hover-only effects to hover-capable pointers and preserve keyboard/touch semantics.
6. Implement and run focused checks. Inspect the rendered interaction when browser tooling is available; test repeated triggers and interruption, not only the happy path.

Use [RECIPES.md](RECIPES.md) only when a listed recipe matches the task. Adapt it to the codebase and verify APIs against the installed library; do not load it for unrelated motion.

Report the implementation, focused verification, and any device- or feel-dependent checks that remain. Do not manufacture motion when the best result is an instant state change.
