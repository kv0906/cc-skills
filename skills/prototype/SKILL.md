---
name: prototype
description: Builds either multiple UI variants for comparison or a full-screen core-flow prototype organized by product area and screen. Uses the project's DESIGN.md and verifies interactions and rendered states. Runs only when explicitly invoked.
disable-model-invocation: true
---

# Prototype UI

Build an isolated, realistic prototype without silently integrating it into production. Choose the mode from the user's intent:

- **Variant mode:** the user wants alternatives, directions, or a comparison.
- **Core Flow mode:** the user wants key screens, a clickable journey, or an engineering handoff. Load [FLOW.md](FLOW.md) and follow it.

## Variant Mode

1. Clarify the component, context, required behavior, and the axis on which alternatives should differ. If scope is broad, choose or state a bounded comparison surface.
2. Inspect the stack, tokens, product personality, surrounding layout, and accessibility conventions. In a standalone context, use restrained defaults.
3. Build a small set of defensible variants—usually three, or the number requested. Name each direction and vary meaningful structure, density, interaction, personality, or motion rather than only color/copy.
4. Use an isolated project route/page or standalone HTML harness. Load [PICKER.md](PICKER.md) for the picker contract. Preserve its required integration behavior, controls, selection state, keyboard access, and one-variant-at-a-time comparison, but adapt equivalent markup/styles where the host framework or accessibility conventions require it.
5. Give variants realistic context, content, states, and working interactions. Respect reduced motion and existing design tokens. Switching variants should remain immediate.
6. Run the harness and verify every variant and picker control. Check the console and inspect representative screenshots when browser tooling is available.
7. Present each direction's axis, best use, and cost, then stop for the user's choice.

Only after the user selects a variant, promote that variant using project conventions. Remove the prototype surface unless the user asks to retain it. If the user requests another round, keep the harness and diverge around their feedback without treating it as final selection.

## Shared Rules

- Read `DESIGN.md` when present. Its tokens are normative; never copy literal brand colors from an earlier prototype into another product.
- Use realistic domain copy and data. Do not ship lorem ipsum, generic dashboards, or decorative controls with no role in the requested flow.
- Prefer a standalone HTML/CSS/JavaScript deliverable for handoff unless the repository already has an isolated preview route.
- Use the repository's existing assets. When a supplied device frame exists, use that asset and map the app into its transparent screen region; do not redraw a second frame with CSS.
- Keep prototype code deliberately separate from production code until the user asks to promote it.
- Render and inspect representative states. A screenshot is not verification until it has been visually reviewed.
