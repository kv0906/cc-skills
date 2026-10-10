---
name: find-animation-opportunities
description: Finds high-value places where missing motion harms feedback, continuity, or comprehension. Use for a read-only search for animation opportunities; it does not audit existing motion or implement changes.
---

# Find Animation Opportunities

Inspect the requested UI or codebase for state changes that feel disconnected, lack feedback, or lose spatial continuity. This is a read-only recommendation task.

## Method

- Learn the product context, interaction frequency, existing motion conventions, and accessibility patterns.
- Look for abrupt entry/exit, unclear state changes, missing press/gesture feedback, spatially disconnected overlays, and rare moments where restrained delight supports the product.
- Reject candidates where motion would delay a frequent or keyboard-driven action, move data users are reading, duplicate an existing affordance, or add decoration without purpose.
- Cite concrete locations. Suggest the mechanism, properties, approximate timing/easing, interruption behavior, and reduced-motion treatment with enough precision to implement, while adapting values to local tokens. Prefer compositor-friendly properties and gate hover-only motion to hover-capable pointers.
- Keep the list proportional to scope and confidence. It is acceptable for no candidates to survive.

Output prioritized opportunities with `file:line` evidence, purpose, tradeoff, and suggested behavior. Briefly mention representative rejected candidates when that explains the restraint. Do not require a fixed count or hand off to another skill unless the user requests implementation or a plan.
