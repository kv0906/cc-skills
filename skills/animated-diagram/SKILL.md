---
name: animated-diagram
description: Build animated technical diagrams (flowcharts, decision trees, pipelines) as Remotion + React videos. You describe the diagram in plain English, Claude writes Mermaid, and a set of React components bake in the design system, auto-layout, and animation patterns — node/edge reveals, trace dots that follow a path and light up nodes, and an optional CRT shader wrapper. Use when the user wants an animated diagram, an explainer video of a flow, a "make this flowchart move" request, or motion graphics for architecture/decision logic.
license: MIT
---

# Animated Diagram (Remotion + React)

Turn a plain-English description of a flow into an **animated diagram video**.

This skill is built on one idea from how people actually do this well:

> **Don't ask the model to draw pixels. Give it an input language it already speaks fluently, then build components that bake in the guardrails.**

For flowcharts and decision trees that language is **Mermaid**. Claude writes
Mermaid effortlessly, so it's the entry point. Everything downstream —
layout, styling, node/edge reveals, trace events — is handled by React
components you don't have to re-derive each time.

---

## The Pipeline

```
Plain English ──▶ Mermaid ──▶ parse ──▶ dagre layout ──▶ <DiagramBoard/> ──▶ [CRT shader] ──▶ video
  "show the         (Claude    (nodes &   (x/y/edge        (reveals +
   tier check"       writes)    edges)     points)          trace events)
```

1. **Articulate** — the user describes what they want ("create a flowchart for
   the tier-check section"). You translate it to Mermaid.
2. **Parse** — `parseMermaid()` turns the text into typed nodes + edges.
3. **Layout** — `layoutDiagram()` runs dagre to assign positions and edge paths.
4. **Render** — `<DiagramBoard/>` reveals nodes/edges on a timeline and plays
   any **trace events** (a dot that walks a path and lights up the nodes it hits).
5. **Finish** — optionally wrap the board in `<CRTShader/>` for the retro-terminal look.

You never hand-place a box. You change the Mermaid or the design tokens and the
whole diagram re-flows.

---

## When to use this skill

- "Animate this flowchart / decision tree / pipeline"
- "Make an explainer video of how X flows through the system"
- "Show the request going through the tier check and getting denied"
- Any request that's fundamentally **nodes + edges + a story about traversal**.

For a static, editable diagram (no motion) prefer the `excalidraw` skill. Use
this skill when the output is a **video** and **motion is the point**.

---

## Setup

See `references/setup.md` for the full walkthrough. The short version:

```bash
npm create video@latest      # scaffold a Remotion project (Blank template)
cd <project>
npm i @dagrejs/dagre
```

Then copy the `templates/` files into `src/diagram/` and register a composition
(see `examples/`). Preview with `npx remotion studio`, render with
`npx remotion render`.

---

## Shared Vocabulary

A shared vocabulary with the agent is what makes this fast. The animation
helpers in `templates/animation.ts` are named to match how you talk:

| You say | Helper | What it does |
|---------|--------|--------------|
| "rise in" | `riseIn` | fade in while translating up from an offset |
| "fade in" | `fadeIn` | opacity 0→1 |
| "pop in" | `scaleIn` | fade + scale up from ~0.92 |
| "draw in" (edges) | `drawIn` | stroke reveals along its length |
| "fast / base / slow" | `DURATION.fast \| base \| slow` | 10 / 18 / 28 frames |
| "out / snap / linear / in-out" | `BEZIER.out \| snap \| linear \| inOut` | easing curves |

So **"rise in fast on enter"** = `riseIn({ frame, delay, duration: DURATION.fast, easing: BEZIER.out })`.
When the user invents a phrase, add it here as a named preset so it sticks.

> The helpers assume **30fps**. At other frame rates, scale durations by `fps/30`.

---

## Mermaid: the input language

Write standard Mermaid `flowchart` / `graph`. Supported subset (see
`references/mermaid-input.md` for the full table):

```
flowchart TD              # direction: TD/TB, BT, LR, RL
  action[Action]          # [..] rectangle
  classifier{Classifier}  # {..} decision diamond
  skip([Skips classifier])# ([..]) stadium/pill
  cache{{Cache}}          # {{..}} hexagon
  node(Round)             # (..) rounded
  action --> classifier            # edge
  action -->|allowed| classifier   # edge with label
  classifier --> approve
  classifier --> deny
```

Use `<br/>` inside a label for a line break. That's enough to express almost
any flow the user describes in English. **Your job is the translation; the
components do the rest.**

---

## Rendering a diagram

The whole board is one component:

```tsx
import { AbsoluteFill } from 'remotion';
import { DiagramBoard } from './diagram/DiagramBoard';
import { CRTShader } from './diagram/CRTShader';

const chart = `flowchart TD
  action[Action] --> t3[Tier 3<br/>everything else]
  t3 --> classifier{Classifier}
  classifier --> approve[Approve]
  classifier --> deny[Deny]`;

export const MyDiagram = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <CRTShader>
      <DiagramBoard
        mermaid={chart}
        revealStart={10}     // frame the first node appears
        nodeStagger={7}      // frames between node reveals
        traces={[{ path: ['action', 't3', 'classifier', 'deny'], startFrame: 120 }]}
      />
    </CRTShader>
  </AbsoluteFill>
);
```

`DiagramBoard` props:

| Prop | Default | Meaning |
|------|---------|---------|
| `mermaid` | — | the diagram source (required) |
| `revealStart` | `0` | frame the reveal begins |
| `nodeStagger` | `6` | frames between consecutive node reveals |
| `traces` | `[]` | trace events (see below) |
| `fit` | `true` | scale the graph to fit the canvas |

---

## Events: the trace dot

This is the payoff of the component approach — **follow-ups are data, not
redraws**. A trace is a dot that walks a list of node ids; as it reaches each
node, that node (and the edge it just crossed) lights up in the accent color.

```tsx
traces={[
  {
    path: ['action', 't3', 'classifier', 'deny'],
    startFrame: 120,    // when the dot starts moving
    segDuration: 18,    // frames to travel one hop
    holdDuration: 9999, // frames a reached node stays lit
  },
]}
```

Use it to narrate: "an action comes in, it's Tier 3, so it hits the classifier,
and it gets denied." Multiple traces can run at once for parallel paths.

---

## The CRT shader wrapper

`<CRTShader>` wraps the board and applies the retro-terminal look — scanlines,
a rolling scan band, vignette, flicker, chroma. It's a separate component on
purpose: the board stays clean and reusable, and the "finish" is one wrapper you
add or remove. It's pure CSS/SVG (deterministic, no WebGL) so it renders
reliably in Remotion. Drop it for a clean modern look; keep it for the terminal
aesthetic.

---

## How to work a request

1. **Confirm the story, not just the shape.** A diagram is nodes + edges *plus*
   what moves through it. Ask (or infer) the traversal you'll animate.
2. **Write the Mermaid.** Keep it minimal and well-labeled. This is the artifact
   the user can read and correct.
3. **Pick the reveal rhythm.** Set `revealStart` / `nodeStagger` so the build-on
   feels deliberate (default ~6–7 frames between nodes reads well at 30fps).
4. **Add trace events** for the narrative beats.
5. **Decide on the CRT wrapper** based on the desired aesthetic.
6. **Set composition length** so it covers the last trace + hold. Preview in
   Remotion Studio, then render.

When the user asks to change something, prefer editing **the Mermaid or the
design tokens** over touching component internals. That's the whole point of
the input-language approach.

---

## Extending the guardrails

Everything lives in two files:

- **`templates/design-system.ts`** — colors, fonts, node sizing, spacing.
  Change a token, every diagram updates. Add semantic tints here.
- **`templates/animation.ts`** — easing curves, durations, named transitions.
  Add a new spoken phrase here when you and the user coin one.

If you need a new node shape, add a case to `Node.tsx` + a `SHAPE` entry in
`parse-mermaid.ts`. If you need a new event type (e.g. a pulsing highlight or a
counter on an edge), model it like `Trace`: a plain data object the board reads
per-frame. Keep events declarative.

---

## File Structure

```
animated-diagram/
├── SKILL.md                     # This document
├── references/
│   ├── setup.md                 # Remotion project setup + render commands
│   ├── mermaid-input.md         # Supported Mermaid subset + examples
│   └── animation-vocabulary.md  # The shared motion vocabulary, in depth
├── templates/
│   ├── animation.ts             # riseIn/fadeIn/scaleIn/drawIn + BEZIER/DURATION
│   ├── design-system.ts         # Design tokens (the guardrails)
│   ├── parse-mermaid.ts         # Mermaid flowchart -> typed nodes/edges
│   ├── layout.ts                # dagre auto-layout -> positions + edge paths
│   ├── Node.tsx                 # Node renderer (rect/diamond/stadium/hexagon/round)
│   ├── Edge.tsx                 # Edge renderer with draw-in + arrowhead
│   ├── TraceDot.tsx             # Trace event: dot follows path, lights nodes
│   ├── DiagramBoard.tsx         # The board: parse + layout + reveal + events
│   └── CRTShader.tsx            # CRT post-process wrapper
└── examples/
    ├── Root.tsx                 # Remotion composition registration
    └── tier-check.tsx           # The tier-check flow, animated + traced
```

---

## Remember

The leverage isn't a clever prompt — it's the **layer of abstraction**. Mermaid
is the language you and the model share; the components are the guardrails that
turn that language into something that always looks and moves right. Talk in the
input language and the shared vocabulary, and the rest is handled.
