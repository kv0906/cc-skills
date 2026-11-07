---
name: interactive-diagram
description: "Builds interactive architecture diagrams with React Flow, official icons, looping request/data arrows and plain-language explanations. Use for /interactive-diagram or interactive system maps; not static-only diagrams or motion videos."
---

# Interactive Diagram

Turn a system into an explorable explanation, not a node-management interface. Default to a bright, ByteByteGo-inspired architecture infographic with React Flow underneath.

## Workflow

1. Read the user's supplied sources and relevant project guidance. Identify products, actors, services, stores, integration boundaries and evidence dates. Separate observed implementation from proposed architecture and illustrative flows.
2. Model each connection as **source → target**, with its meaning, direction and type: request/response, data pipeline or logical relationship. A cache, operational database and analytics store are parallel responsibilities, not automatically one chain.
3. Start with an overview. Add focused views only when they clarify distinct flows, such as partner integration or analytics. Keep human setup and runtime API calls separate.
4. For an unchosen visual direction, use Painter to sketch 2–3 directions for approval. If a mockup is already approved, implement it directly and use it as the visual acceptance target; do not substitute a generic dashboard.

## Visual contract

- Use a white canvas, restrained pastel node shapes, crisp directional arrows and ample space. Group product areas and asynchronous pipelines into lightly outlined lanes. Avoid a permanent large sidebar, dense toolbars, dark node editors and decorative grids by default.
- Use recognizable shapes: phone for mobile, browser/product card for a portal, service card for an API, storage shape for a database. Use verified official vendor logos/architecture icons, not emoji approximations. Record provenance and usage terms; embed assets for offline delivery. Use a functional icon when no official product logo is verified.
- Arrange the main request horizontally, put stores on independent branches, and place analytics and partner/control-plane flows in separate lanes. Route arrows around cards, not through them. Give reverse-direction arrows a distinct path or show only the direction relevant to the focused view.
- Keep unrelated nodes visible but dimmed in focused views. Retain pan, zoom and fit-all; avoid extra controls.
- Put labels on edges. Selecting a node opens its explanation below the graph rather than permanently consuming canvas width.
- Match the user's language. Explain unfamiliar names beside the label: “ALB (bộ chia request)”, “Fargate (dịch vụ chạy container)”. Explain what a component does, why it is needed, its operating principle, strengths, weaknesses and why it fits this use case. Distinguish general technical rationale from the team's confirmed decision.

## Interaction contract

- Blue arrows represent requests/responses; orange dashed arrows represent analytical data movement. Use another explicitly labeled treatment for logical/unverified relationships. Include a legend.
- Enable **looping directional chevrons** on meaningful request/data paths by default. Provide a clearly labeled loop toggle. Do not animate a logical relationship as if it were verified traffic.
- Keep motion simple: arrows loop automatically. Do not add playback, pause/resume, replay, seeking, step counters or speed controls unless explicitly requested.
- State that motion illustrates direction, not actual throughput, latency, execution order or production health. Do not imply all overview branches are one transaction.
- Respect live changes to `prefers-reduced-motion`: disable animation while retaining readable arrows and node explanations. Use keyboard-accessible controls and node selection.
- Wrap any view tabs on mobile. The diagram may pan within its viewport; the page must not overflow horizontally. Do not let floating controls obscure cards.

## Implementation and verification

Read [references/react-flow.md](references/react-flow.md) for edge animation, geometry and offline delivery. Adapt to installed versions and the existing project; do not copy fixed coordinates or product names.

Build and open the final artifact. Check that arrows move in the right direction and loop, follow dragged nodes, stop with the loop toggle/reduced motion, and leave labels readable. Inspect desktop and mobile screenshots; verify node explanations and any focused views. A screenshot alone cannot prove animation.

Keep topology/content in data and rendering separate. Deliver maintainable source plus a self-contained HTML when requested or when the chat preview needs an offline artifact. Do not copy private customer sources into this reusable skill.

## Handoff

Show the inspected live preview or inline HTML artifact. Briefly state implemented interactions, important evidence gaps, verification limits and whether work is local, committed or published. Do not push, deploy or send internal architecture to another thread without the user's scoped authorization.
